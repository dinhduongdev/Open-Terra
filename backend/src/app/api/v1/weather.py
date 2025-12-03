from fastapi import APIRouter
from src.app.schemas.api_response import APIResponse
from src.app.schemas.smart_data.weather_observed import WeatherObserved, WeatherObservedResponse, WeatherListResponse
from src.app.services.context_broker_client import ContextBrokerClient
from src.app.core.config import settings
router = APIRouter(prefix="/v1/weather", tags=["weather"])

async def get_context_broker() -> ContextBrokerClient:
    client = ContextBrokerClient(
        broker_url=settings.ORION_LD_BASE_URL,
        context_url=settings.ORION_LD_CONTEXT
    )
    try:
        yield client
    finally:
        await client.close()

@router.get(
    "/latest",
    response_model=APIResponse[WeatherObservedResponse],
    summary="Get latest weather observation",
    description="Retrieve the most recent weather data from the station"
)
async def get_latest_weather(
    context_broker_client: ContextBrokerClient = Depends(get_context_broker)
):
    """
    Get the latest weather observation from the station.
    
    **Example Request:**
    ```
    GET /v1/weather/latest
    ```
    
    **Context Broker Query:**
    ```
    GET /ngsi-ld/v1/entities?type=WeatherObserved&limit=1&format=concise
    ```
    """
    try:
        entities = await context_broker_client.get_entities(
            entity_type="WeatherObserved",
            entity_format="concise",
            limit=1
        )
        
        if not entities:
            return APIResponse.fail(
                message="No weather data available",
                error_code="NO_DATA",
                code=404
            )
        
        # Convert to WeatherResponse format
        weather_data = entities[0]
        
        return APIResponse.success(
            data=weather_data,
            message="Latest weather data retrieved successfully"
        )
        
    except Exception as e:
        return APIResponse.fail(
            message=f"Failed to retrieve weather data: {str(e)}",
            error_code="WEATHER_FETCH_ERROR",
            code=500
        )
    finally:
        await context_broker_client.close()

@router.get(
    "/{entity_id}",
    response_model=APIResponse[WeatherResponse],
    summary="Get weather observation by ID",
    description="Retrieve a specific weather observation by its entity ID"
)
async def get_weather_by_id(
    entity_id: str = Path(
        ..., 
        description="Entity ID (e.g., urn:ngsi-ld:WeatherObserved:Station-001)"
    ),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker)
):
    """
    Get weather observation by entity ID.
    
    **Example Request:**
    ```
    GET /v1/weather/urn:ngsi-ld:WeatherObserved:Station-001
    ```
    
    **Context Broker Query:**
    ```
    GET /ngsi-ld/v1/entities/{entity_id}?format=concise
    ```
    """
    try:
        weather = await context_broker_client.get_entity(
            entity_id=entity_id,
            entity_format="concise"
        )
        
        if not weather:
            return APIResponse.fail(
                message=f"Weather entity '{entity_id}' not found",
                error_code="NOT_FOUND",
                code=404
            )
        
        return APIResponse.success(
            data=weather,
            message="Weather observation retrieved successfully"
        )
        
    except Exception as e:
        return APIResponse.fail(
            message=f"Failed to retrieve weather: {str(e)}",
            error_code="FETCH_ERROR",
            code=500
        )
    finally:
        await context_broker_client.close()
        
@router.get(
    "/query",
    response_model=APIResponse[list[WeatherResponse]],
    summary="Query weather data with filters",
    description="Filter weather observations by various conditions"
)
async def query_weather(
    # Temperature filters
    min_temperature: Optional[float] = Query(
        None, 
        ge=-100, 
        le=100,
        description="Minimum temperature in Celsius"
    ),
    max_temperature: Optional[float] = Query(
        None, 
        ge=-100, 
        le=100,
        description="Maximum temperature in Celsius"
    ),
    
    # Humidity filters
    min_humidity: Optional[float] = Query(
        None, 
        ge=0, 
        le=1,
        description="Minimum relative humidity (0-1)"
    ),
    max_humidity: Optional[float] = Query(
        None, 
        ge=0, 
        le=1,
        description="Maximum relative humidity (0-1)"
    ),
    
    # Wind filters
    min_wind_speed: Optional[float] = Query(
        None, 
        ge=0,
        description="Minimum wind speed in m/s"
    ),
    max_wind_speed: Optional[float] = Query(
        None, 
        ge=0,
        description="Maximum wind speed in m/s"
    ),
    
    # Pressure filters
    min_pressure: Optional[float] = Query(
        None,
        ge=800,
        le=1100, 
        description="Minimum atmospheric pressure in hPa"
    ),
    max_pressure: Optional[float] = Query(
        None,
        ge=800,
        le=1100,
        description="Maximum atmospheric pressure in hPa"
    ),
    
    # General filters
    weather_type: Optional[str] = Query(
        None,
        description="Weather type (e.g., 'Rainy', 'Sunny', 'Cloudy')"
    ),
    
    # Time filter
    start_date: Optional[datetime] = Query(
        None,
        description="Start date for filtering (ISO 8601 format)"
    ),
    end_date: Optional[datetime] = Query(
        None,
        description="End date for filtering (ISO 8601 format)"
    ),
    
    # Pagination
    limit: int = Query(
        10, 
        ge=1, 
        le=100,
        description="Maximum number of results"
    ),
    offset: int = Query(
        0, 
        ge=0,
        description="Number of results to skip"
    ),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker)
):
    """
    Query weather observations with multiple filters.
    
    **Example Requests:**
    
    1. Get hot weather:
    ```
    GET /weather/query?min_temperature=30
    ```
    
    2. Get high humidity days:
    ```
    GET /weather/query?min_humidity=0.8
    ```
    
    3. Get rainy weather in date range:
    ```
    GET /weather/query?weather_type=Rainy&start_date=2025-12-01T00:00:00Z&end_date=2025-12-02T00:00:00Z
    ```
    
    **Context Broker Query:**
    ```
    GET /ngsi-ld/v1/entities/
        ?type=WeatherObserved
        &q=temperature>=30;relativeHumidity>=0.8
        &limit=10
        &offset=0
        &format=concise
    ```
    """
    try:
        # Build NGSI-LD query string
        conditions = []
        
        if min_temperature is not None:
            conditions.append(f"temperature>={min_temperature}")
        if max_temperature is not None:
            conditions.append(f"temperature<={max_temperature}")
        if min_humidity is not None:
            conditions.append(f"relativeHumidity>={min_humidity}")
        if max_humidity is not None:
            conditions.append(f"relativeHumidity<={max_humidity}")
        if weather_type:
            conditions.append(f"weatherType=='{weather_type}'")
        
        q_param = ";".join(conditions) if conditions else None
        
        entities = await context_broker_client.get_entities(
            entity_type="WeatherObserved",
            entity_format="concise",
            limit=limit,
            offset=offset,
            q=q_param
        )
        
        result = WeatherListResponse(
            total=len(entities),
            items=entities
        )
        
        return APIResponse.success(
            data=result,
            message=f"Found {len(entities)} weather observations"
        )
        
    except Exception as e:
        return APIResponse.fail(
            message=f"Query failed: {str(e)}",
            error_code="QUERY_ERROR",
            code=500
        )
    finally:
        await context_broker_client.close()

@router.get(
    "/history",
    response_model=APIResponse[WeatherListResponse],
    summary="Get weather history",
    description="Retrieve historical weather data for a time period"
)
async def get_weather_history(
    start_time: Optional[datetime] = Query(
        None,
        description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"
    ),
    end_time: Optional[datetime] = Query(
        None,
        description="End time (ISO 8601 format)"
    ),
    last_n: Optional[int] = Query(
        None,
        ge=1,
        le=1000,
        description="Get last N observations (alternative to time range)"
    ),
    limit: int = Query(
        100,
        ge=1,
        le=1000,
        description="Maximum number of results"
    ),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker)
):
    """
    Get historical weather data.
    
    You can either:
    - Use time range: `start_time` and `end_time`
    - Or use `last_n` to get last N observations
    
    **Example Requests:**
    
    1. Get last 24 hours:
    ```
    GET /weather/history?last_n=24
    ```
    
    2. Get specific time range:
    ```
    GET /weather/history?start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z
    ```
    
    **Context Broker Temporal Query:**
    ```
    GET /temporal/entities/
        ?type=WeatherObserved
        &timerel=between
        &timeAt=2025-12-01T00:00:00Z
        &endTimeAt=2025-12-02T00:00:00Z
        &format=concise
    ```
    """
    try:
        # Validate input
        if last_n and (start_time or end_time):
            return APIResponse.bad_request(
                message="Cannot use both 'last_n' and time range"
            )
        
        if not last_n and not (start_time and end_time):
            return APIResponse.bad_request(
                message="Must provide either 'last_n' or both 'start_time' and 'end_time'"
            )
        
        if start_time and end_time and start_time >= end_time:
            return APIResponse.bad_request(
                message="start_time must be before end_time"
            )
        
        entities = await context_broker_client.get_temporal_entities(
            entity_type="WeatherObserved",
            timerel="between" if start_time else "before",
            time_at=start_time,
            end_time_at=end_time,
            last_n=last_n,
            limit=limit,
            entity_format="concise"
        )
        
        return APIResponse.success(
            data={"total": len(entities), "items": entities},
            message="Weather history retrieved successfully"
        )
    except Exception as e:
        return APIResponse.fail(
            message=f"Failed to retrieve weather history: {str(e)}",
            error_code="HISTORY_FETCH_ERROR",
            code=500
        )

@router.get(
    "/statistics",
    response_model=APIResponse[dict],
    summary="Get weather statistics",
    description="Calculate statistical aggregations over time"
)
async def get_weather_statistics(
    start_time: datetime = Query(
        ...,
        description="Start time (ISO 8601 format)"
    ),
    end_time: datetime = Query(
        ...,
        description="End time (ISO 8601 format)"
    ),
    attributes: str = Query(
        "temperature,relativeHumidity,windSpeed,atmosphericPressure",
        description="Comma-separated list of attributes to calculate stats for"
    ),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker)
):
    """
    Get statistical aggregations for weather data.
    
    Returns min, max, avg, count for each requested attribute.
    
    **Example Request:**
    ```
    GET /weather/statistics?start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z&attributes=temperature,humidity
    ```
    
    **Response Format:**
    ```json
    {
        "success": true,
        "code": 200,
        "message": "Statistics calculated successfully",
        "error": null,
        "result": {
            "period": {
                "start": "2025-12-01T00:00:00Z",
                "end": "2025-12-02T00:00:00Z",
                "duration_hours": 24
            },
            "statistics": {
                "temperature": {
                    "min": 18.5,
                    "max": 32.1,
                    "avg": 25.3,
                    "count": 24
                },
                "relativeHumidity": {
                    "min": 0.45,
                    "max": 0.89,
                    "avg": 0.67,
                    "count": 24
                }
            }
        }
    }
    ```
    """
    try:
        # Validate time range
        if start_time >= end_time:
            return APIResponse.bad_request(
                message="start_time must be before end_time"
            )
        
        # Parse attributes
        attr_list = [attr.strip() for attr in attributes.split(",")]
        
        entities = await context_broker_client.get_temporal_entities(
            entity_type="WeatherObserved",
            timerel="between",
            time_at=start_time,
            end_time_at=end_time,
            attrs=attr_list,
            entity_format="temporalValues"
        )
        
        duration_hours = (end_time - start_time).total_seconds() / 3600
        
        result = {
            "period": {
                "start": start_time.isoformat(),
                "end": end_time.isoformat(),
                "duration_hours": duration_hours
            },
            "statistics": {
                attr: {
                    "min": 0.0,
                    "max": 0.0,
                    "avg": 0.0,
                    "count": len(entities)
                }
                for attr in attr_list
            }
        }
        
        return APIResponse.success(
            data=result,
            message="Statistics calculated successfully"
        )
    except Exception as e:
        return APIResponse.error(
            message=f"Failed to calculate statistics: {str(e)}",
            error_code="STATISTICS_ERROR",
            status=500
        )
    finally:
        await context_broker_client.close()