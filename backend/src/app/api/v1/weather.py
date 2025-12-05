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
from app.schemas.api_response import APIResponse
from app.schemas.smart_data.weather_observed import WeatherObserved, WeatherObservedResponse, WeatherListResponse
from app.services.context_broker_client import ContextBrokerClient
from app.core.config import settings
from app.core.constants import WEATHER_ENTITY_ID, WEATHER_ID_PATTERN

router = APIRouter(prefix="/v1/weather", tags=["weather"])

# ==== BUG_FIXING: THIS API IS CURRENTLY UNAVAILABLE DUE TO ISSUES WITH CONTEXT BROKER INTERACTIONS. ====


async def get_context_broker() -> ContextBrokerClient:
    client = ContextBrokerClient(broker_url=settings.ORION_LD_BASE_URL, context_url=settings.ORION_LD_CONTEXT)
    try:
        yield client
    finally:
        await client.close()


@router.get(
    "/latest",
    summary="Get latest weather observation",
    description="Retrieve the most recent weather data from the station",
)
async def get_latest_weather(context_broker_client: ContextBrokerClient = Depends(get_context_broker)):
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
        weather = await context_broker_client.get_entity(entity_id=WEATHER_ENTITY_ID, entity_format="concise")

        if not weather:
            return APIResponse(
                success=False, code=404, message="No weather data available", error="NO_DATA", result=None
            )

        weather_data = weather

        return APIResponse(
            success=True,
            code=200,
            message="Latest weather data retrieved successfully",
            error=None,
            result=weather_data,
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
            result=None,
        )


@router.get(
    "/query", summary="Query weather data with filters", description="Filter weather observations by various conditions"
)
async def query_weather(
    # Temperature filters
    min_temperature: Optional[float] = Query(None, ge=-100, le=100, description="Minimum temperature in Celsius"),
    max_temperature: Optional[float] = Query(None, ge=-100, le=100, description="Maximum temperature in Celsius"),
    # Humidity filters
    min_humidity: Optional[float] = Query(None, ge=0, le=1, description="Minimum relative humidity (0-1)"),
    max_humidity: Optional[float] = Query(None, ge=0, le=1, description="Maximum relative humidity (0-1)"),
    # Wind filters
    min_wind_speed: Optional[float] = Query(None, ge=0, description="Minimum wind speed in m/s"),
    max_wind_speed: Optional[float] = Query(None, ge=0, description="Maximum wind speed in m/s"),
    # Pressure filters
    min_pressure: Optional[float] = Query(None, ge=800, le=1100, description="Minimum atmospheric pressure in hPa"),
    max_pressure: Optional[float] = Query(None, ge=800, le=1100, description="Maximum atmospheric pressure in hPa"),
    # General filters
    weather_type: Optional[str] = Query(None, description="Weather type (e.g., 'Rainy', 'Sunny', 'Cloudy')"),
    # Time filter (optional - defaults to last 24 hours if not provided)
    start_time: Optional[datetime] = Query(
        None, description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"
    ),
    end_time: Optional[datetime] = Query(
        None,
        description="End time (ISO 8601 format)"
    ),
    
    # Limit results
    last_n: Optional[int] = Query(
        None,
        ge=1,
        le=1000,
        description="Limit to last N observations"
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
                result=None,
            )
        
        # Build filter conditions for client-side filtering
        # (Mintaka doesn't support 'q' parameter)
        conditions = []

        if min_temperature is not None:
            conditions.append(("temperature", ">=", min_temperature))
        if max_temperature is not None:
            conditions.append(("temperature", "<=", max_temperature))
        if min_humidity is not None:
            conditions.append(("relativeHumidity", ">=", min_humidity))
        if max_humidity is not None:
            conditions.append(("relativeHumidity", "<=", max_humidity))
        if weather_type:
            conditions.append(("weatherType", "==", weather_type))
        
        # Weather has only one station - use constant entity ID
        entity_id = WEATHER_ENTITY_ID
        
        # Query temporal data (Mintaka doesn't support 'q' parameter)
        temporal_data = await context_broker_client.get_temporal_entities(
            entity_id=entity_id,
            timerel="between",
            time_at=start_time,
            end_time_at=end_time,
            last_n=last_n,
            entity_format="concise"
        )
        
        # Client-side filtering: Filter by timestamp/observedAt
        # If conditions fail for a timestamp, remove that entire observation
        if temporal_data and conditions:
            # Step 1: Collect all unique timestamps and their values across attributes
            timestamp_data = {}  # {observedAt: {attr_name: item, ...}}
            
            for attr_name, attr_values in temporal_data.items():
                if attr_name in ["id", "type", "@context"]:
                    continue
                    
                if isinstance(attr_values, list):
                    for item in attr_values:
                        if isinstance(item, dict) and "observedAt" in item:
                            timestamp = item["observedAt"]
                            if timestamp not in timestamp_data:
                                timestamp_data[timestamp] = {}
                            timestamp_data[timestamp][attr_name] = item
            
            # Step 2: Check which timestamps pass all filter conditions
            valid_timestamps = set()
            for timestamp, attrs in timestamp_data.items():
                passes_all_conditions = True
                
                for cond_attr, operator, threshold in conditions:
                    if cond_attr in attrs:
                        value = attrs[cond_attr].get("value")
                        if value is not None:
                            if operator == ">=" and value < threshold:
                                passes_all_conditions = False
                                break
                            elif operator == "<=" and value > threshold:
                                passes_all_conditions = False
                                break
                            elif operator == "==" and value != threshold:
                                passes_all_conditions = False
                                break
                
                if passes_all_conditions:
                    valid_timestamps.add(timestamp)
            
            # Step 3: Rebuild entity with only valid timestamps
            if not valid_timestamps:
                temporal_data = None
            else:
                filtered_entity = {"id": temporal_data["id"], "type": temporal_data["type"]}
                if "@context" in temporal_data:
                    filtered_entity["@context"] = temporal_data["@context"]
                
                for attr_name, attr_values in temporal_data.items():
                    if attr_name in ["id", "type", "@context"]:
                        continue
                        
                    if isinstance(attr_values, list):
                        # Keep only items with valid timestamps
                        filtered_values = [
                            item for item in attr_values
                            if isinstance(item, dict) and item.get("observedAt") in valid_timestamps
                        ]
                        if filtered_values:
                            filtered_entity[attr_name] = filtered_values
                    else:
                        # Keep non-temporal attributes as-is
                        filtered_entity[attr_name] = attr_values
                
                temporal_data = filtered_entity
        
        # Wrap single entity result in list for consistency
        entities = [temporal_data] if temporal_data else []

        result = {"total": len(entities), "items": entities}

        return APIResponse(
            success=True, code=200, message=f"Found {len(entities)} weather observations", error=None, result=result
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in query_weather: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(success=False, code=500, message=f"Query failed: {str(e)}", error="QUERY_ERROR", result=None)


@router.get("/history", summary="Get weather history", description="Retrieve historical weather data for a time period")
async def get_weather_history(
    start_time: Optional[datetime] = Query(
        None, description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"
    ),
    end_time: Optional[datetime] = Query(None, description="End time (ISO 8601 format)"),
    last_n: Optional[int] = Query(
        None,
        ge=1,
        le=1000,
        description="Get last N observations (alternative to time range)"
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
                result=None,
            )

        # Check if neither method is provided
        if last_n is None and (start_time is None or end_time is None):
            return APIResponse(
                success=False,
                code=400,
                message="Must provide either 'last_n' or both 'start_time' and 'end_time'",
                error="INVALID_PARAMS",
                result=None,
            )

        # Validate time range order
        if start_time is not None and end_time is not None and start_time >= end_time:
            return APIResponse(
                success=False,
                code=400,
                message="start_time must be before end_time",
                error="INVALID_PARAMS",
                result=None,
            )

        # Weather has only one station - use constant entity ID
        entity_id = WEATHER_ENTITY_ID

        temporal_data = await context_broker_client.get_temporal_entities(
            entity_id=entity_id,
            timerel="between" if (start_time and end_time) else "before",
            time_at=start_time if start_time else datetime.utcnow(),
            end_time_at=end_time,
            last_n=last_n,
            entity_format="concise",
        )

        # Wrap single entity result in list for consistency
        entities = [temporal_data] if temporal_data else []

        return APIResponse(
            success=True,
            code=200,
            message="Weather history retrieved successfully",
            error=None,
            result={"total": len(entities), "items": entities},
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
            result=None,
        )


@router.get("/statistics", summary="Get weather statistics", description="Calculate statistical aggregations over time")
async def get_weather_statistics(
    start_time: datetime = Query(..., description="Start time (ISO 8601 format)"),
    end_time: datetime = Query(..., description="End time (ISO 8601 format)"),
    attributes: str = Query(
        "temperature,relativeHumidity,windSpeed,atmosphericPressure",
        description="Comma-separated list of attributes to calculate stats for",
    ),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker),
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
                result=None,
            )

        # Parse attributes
        attr_list = [attr.strip() for attr in attributes.split(",")]

        # Weather has only one station - use constant entity ID
        entity_id = WEATHER_ENTITY_ID
        
        # Get temporal data in concise format (easier to process)
        # Note: Don't pass attrs parameter initially to get all data,
        # then filter by attributes we need
        temporal_data = await context_broker_client.get_temporal_entities(
            entity_id=entity_id,
            timerel="between",
            time_at=start_time,
            end_time_at=end_time,
            entity_format="concise"
        )
        
        if not temporal_data:
            return APIResponse(
                success=False,
                code=404,
                message=f"No temporal data found in the specified time range ({start_time.isoformat()} to {end_time.isoformat()}). Try a more recent time period.",
                error="NO_DATA",
                result=None
            )
        
        # Check if entity has any temporal attributes
        has_temporal_data = False
        for key, value in temporal_data.items():
            if key not in ["id", "type", "@context"] and isinstance(value, list):
                has_temporal_data = True
                break
        
        if not has_temporal_data:
            return APIResponse(
                success=False,
                code=404,
                message=f"Entity exists but has no temporal data in the specified time range. Try a more recent time period (e.g., last 24 hours).",
                error="NO_TEMPORAL_DATA",
                result=None
            )
        
        # Calculate statistics for each requested attribute
        duration_hours = (end_time - start_time).total_seconds() / 3600
        statistics = {}
        
        for attr in attr_list:
            if attr not in temporal_data:
                # Attribute not found in response
                statistics[attr] = {
                    "min": None,
                    "max": None,
                    "avg": None,
                    "count": 0,
                    "error": f"Attribute '{attr}' not found in temporal data"
                }
                continue
            
            attr_data = temporal_data[attr]
            
            if not isinstance(attr_data, list):
                # Not a temporal attribute (single value or non-temporal)
                statistics[attr] = {
                    "min": None,
                    "max": None,
                    "avg": None,
                    "count": 0,
                    "error": "Not a temporal attribute"
                }
                continue
            
            # Extract values from temporal array
            values = []
            for item in attr_data:
                if isinstance(item, dict) and "value" in item:
                    val = item["value"]
                    if isinstance(val, (int, float)):
                        values.append(float(val))
            
            if values:
                statistics[attr] = {
                    "min": round(min(values), 4),
                    "max": round(max(values), 4),
                    "avg": round(sum(values) / len(values), 4),
                    "count": len(values)
                }
            else:
                statistics[attr] = {
                    "min": None,
                    "max": None,
                    "avg": None,
                    "count": 0,
                    "error": "No numeric values found"
                }
        
        result = {
            "period": {
                "start": start_time.isoformat(),
                "end": end_time.isoformat(),
                "duration_hours": duration_hours
            },
            "statistics": statistics
        }

        return APIResponse(
            success=True, code=200, message="Statistics calculated successfully", error=None, result=result
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
            result=None,
        )
