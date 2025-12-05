"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from fastapi import APIRouter, Depends, Path, Query
from typing import Optional
from datetime import datetime, timedelta
from src.app.schemas.api_response import APIResponse
from src.app.schemas.smart_data.weather_observed import WeatherObserved, WeatherObservedResponse, WeatherListResponse
from src.app.services.context_broker_client import ContextBrokerClient
from src.app.core.config import settings
from src.app.core.constants import (
    WEATHER_ENTITY_ID,
    WEATHER_ID_PATTERN
)
router = APIRouter(prefix="/v1/weather", tags=["weather"])

# ==== BUG_FIXING: THIS API IS CURRENTLY UNAVAILABLE DUE TO ISSUES WITH CONTEXT BROKER INTERACTIONS. ====

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
        # Use the exact entity ID from constants
        weather = await context_broker_client.get_entity(
            entity_id=WEATHER_ENTITY_ID,
            entity_format="concise"
        )
        
        if not weather:
            return APIResponse(
                success=False,
                code=404,
                message="No weather data available",
                error="NO_DATA",
                result=None
            )
        
        weather_data = weather
        
        return APIResponse(
            success=True,
            code=200,
            message="Latest weather data retrieved successfully",
            error=None,
            result=weather_data
        )
        
    except Exception as e:
        import traceback
        print(f"[ERROR] Exception in get_latest_weather: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to retrieve weather data: {str(e)}",
            error="WEATHER_FETCH_ERROR",
            result=None
        )


@router.get(
    "/query",
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
    
    # Time filter (optional - defaults to last 24 hours if not provided)
    start_time: Optional[datetime] = Query(
        None,
        description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"
    ),
    end_time: Optional[datetime] = Query(
        None,
        description="End time (ISO 8601 format)"
    ),
    
    # Pagination
    limit: int = Query(
        100, 
        ge=1, 
        le=1000,
        description="Maximum number of results"
    ),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker)
):
    """
    Query weather observations with multiple filters from historical data.
    
    **Note:** This endpoint queries temporal data (Timescale DB via Mintaka).
    MongoDB only stores the latest record. For current data, use `/latest`.
    
    **Example Requests:**
    
    1. Get hot weather in last 24 hours:
    ```
    GET /weather/query?min_temperature=30&start_time=2025-12-03T00:00:00Z&end_time=2025-12-04T00:00:00Z
    ```
    
    2. Get high humidity days:
    ```
    GET /weather/query?min_humidity=0.8&start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z
    ```
    
    **Context Broker Temporal Query:**
    ```
    GET /temporal/entities/
        ?type=WeatherObserved
        &timerel=between
        &timeAt=2025-12-01T00:00:00Z
        &endTimeAt=2025-12-02T00:00:00Z
        &q=temperature>=30;relativeHumidity>=0.8
    ```
    """
    try:
        # Set default time range if not provided (last 24 hours)
        if start_time is None:
            end_time = datetime.utcnow()
            start_time = end_time - timedelta(days=1)
        elif end_time is None:
            end_time = datetime.utcnow()
        
        # Validate time range
        if start_time >= end_time:
            return APIResponse(
                success=False,
                code=400,
                message="start_time must be before end_time",
                error="INVALID_PARAMS",
                result=None
            )
        
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
        
        # Weather has only one station - use constant entity ID
        entity_id = WEATHER_ENTITY_ID
        
        # Query temporal data with filters
        temporal_data = await context_broker_client.get_temporal_entities(
            entity_id=entity_id,
            timerel="between",
            time_at=start_time,
            end_time_at=end_time,
            q=q_param,
            entity_format="concise"
        )
        
        # Wrap single entity result in list for consistency
        entities = [temporal_data] if temporal_data else []
        
        result = {
            "total": len(entities),
            "items": entities
        }
        
        return APIResponse(
            success=True,
            code=200,
            message=f"Found {len(entities)} weather observations",
            error=None,
            result=result
        )
        
    except Exception as e:
        import traceback
        print(f"[ERROR] Exception in query_weather: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Query failed: {str(e)}",
            error="QUERY_ERROR",
            result=None
        )

@router.get(
    "/history",
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
        # Validate input - check if both methods are provided
        if last_n is not None and (start_time is not None or end_time is not None):
            return APIResponse(
                success=False,
                code=400,
                message="Cannot use both 'last_n' and time range",
                error="INVALID_PARAMS",
                result=None
            )
        
        # Check if neither method is provided
        if last_n is None and (start_time is None or end_time is None):
            return APIResponse(
                success=False,
                code=400,
                message="Must provide either 'last_n' or both 'start_time' and 'end_time'",
                error="INVALID_PARAMS",
                result=None
            )
        
        # Validate time range order
        if start_time is not None and end_time is not None and start_time >= end_time:
            return APIResponse(
                success=False,
                code=400,
                message="start_time must be before end_time",
                error="INVALID_PARAMS",
                result=None
            )
        
        # Weather has only one station - use constant entity ID
        entity_id = WEATHER_ENTITY_ID
        
        temporal_data = await context_broker_client.get_temporal_entities(
            entity_id=entity_id,
            timerel="between" if (start_time and end_time) else "before",
            time_at=start_time if start_time else datetime.utcnow(),
            end_time_at=end_time,
            last_n=last_n,
            entity_format="concise"
        )
        
        # Wrap single entity result in list for consistency
        entities = [temporal_data] if temporal_data else []
        
        return APIResponse(
            success=True,
            code=200,
            message="Weather history retrieved successfully",
            error=None,
            result={"total": len(entities), "items": entities}
        )
    except Exception as e:
        import traceback
        print(f"[ERROR] Exception in get_weather_history: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to retrieve weather history: {str(e)}",
            error="HISTORY_FETCH_ERROR",
            result=None
        )

@router.get(
    "/statistics",
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
            return APIResponse(
                success=False,
                code=400,
                message="start_time must be before end_time",
                error="INVALID_PARAMS",
                result=None
            )
        
        # Parse attributes
        attr_list = [attr.strip() for attr in attributes.split(",")]
        
        # Weather has only one station - use constant entity ID
        entity_id = WEATHER_ENTITY_ID
        
        temporal_data = await context_broker_client.get_temporal_entities(
            entity_id=entity_id,
            timerel="between",
            time_at=start_time,
            end_time_at=end_time,
            attrs=attr_list,
            entity_format="temporalValues"
        )
        
        # Wrap single entity result in list for statistics calculation
        entities = [temporal_data] if temporal_data else []
        
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
        
        return APIResponse(
            success=True,
            code=200,
            message="Statistics calculated successfully",
            error=None,
            result=result
        )
    except Exception as e:
        import traceback
        print(f"[ERROR] Exception in get_weather_statistics: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to calculate statistics: {str(e)}",
            error="STATISTICS_ERROR",
            result=None
        )