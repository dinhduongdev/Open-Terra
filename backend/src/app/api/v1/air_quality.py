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
from app.schemas.smart_data.air_quality_observed import (
    AirQualityObserved,
    AirQualityObservedResponse,
    AirQualityListResponse,
    LocationInfo,
    ParticulateMatterData,
    GaseousPollutantsData,
    HeavyMetalsData,
    VolatileCompoundsData,
    AirQualityIndexData,
    EnvironmentalConditions,
)
from app.services.context_broker_client import ContextBrokerClient
from app.core.config import settings
from app.core.constants import AIR_QUALITY_STATION_IDS, get_air_quality_entity_id
import logging

router = APIRouter(prefix="/v1/air-quality", tags=["air-quality"])
logger = logging.getLogger(__name__)


async def get_context_broker() -> ContextBrokerClient:
    client = ContextBrokerClient(broker_url=settings.ORION_LD_BASE_URL, context_url=settings.ORION_LD_CONTEXT)
    try:
        yield client
    finally:
        await client.close()


@router.get(
    "/latest",
    summary="Get latest air quality observations",
    description="Retrieve the most recent air quality data from all stations",
)
async def get_latest_air_quality(context_broker_client: ContextBrokerClient = Depends(get_context_broker)):
    """
    Get the latest air quality observations from all stations.

    **Example Request:**
    ```
    GET /v1/air-quality/latest
    ```

    **Context Broker Query:**
    ```
    GET /ngsi-ld/v1/entities/urn:ngsi-ld:AirQualityObserved:airquality:3276359:latest?format=concise
    GET /ngsi-ld/v1/entities/urn:ngsi-ld:AirQualityObserved:airquality:6068138:latest?format=concise
    ```
    """
    try:
        # Query all known stations
        entities = []

        for station_id in AIR_QUALITY_STATION_IDS:
            entity_id = get_air_quality_entity_id(station_id)
            try:
                entity = await context_broker_client.get_entity(entity_id=entity_id, entity_format="concise")
                if entity:
                    # Data is already normalized by context_broker_client
                    entities.append(entity)
            except Exception as e:
                # Log but continue with other stations
                logger.error(f"Error fetching station {station_id}: {e}")
                continue

        if not entities:
            return APIResponse(
                success=False, code=404, message="No air quality data available", error="NO_DATA", result=None
            )

        result = {"total": len(entities), "items": entities}

        return APIResponse(
            success=True,
            code=200,
            message=f"Retrieved {len(entities)} air quality station(s)",
            error=None,
            result=result,
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in get_latest_air_quality: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to retrieve air quality data: {str(e)}",
            error="AIR_QUALITY_FETCH_ERROR",
            result=None,
        )


@router.get(
    "/station/{station_id}",
    summary="Get air quality observation by station ID",
    description="Retrieve air quality data for a specific station",
)
async def get_air_quality_by_id(
    station_id: str = Path(..., description="Station ID (e.g., '3276359' or '6068138')"),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker),
):
    """
    Get air quality observation by station ID.

    **Example Request:**
    ```
    GET /v1/air-quality/station/3276359
    ```

    **Context Broker Query:**
    ```
    GET /ngsi-ld/v1/entities/urn:ngsi-ld:AirQualityObserved:airquality:3276359:latest?format=concise
    ```
    """
    try:
        # Convert short station ID to full URN
        full_entity_id = get_air_quality_entity_id(station_id)

        air_quality = await context_broker_client.get_entity(entity_id=full_entity_id, entity_format="concise")

        if not air_quality:
            return APIResponse(
                success=False,
                code=404,
                message=f"Air quality data for station '{station_id}' not found",
                error="NOT_FOUND",
                result=None,
            )

        # Data is already normalized by context_broker_client
        return APIResponse(
            success=True,
            code=200,
            message="Air quality observation retrieved successfully",
            error=None,
            result=air_quality,
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in get_air_quality_by_id: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to retrieve air quality: {str(e)}",
            error="FETCH_ERROR",
            result=None,
        )


@router.get(
    "/query",
    summary="Query air quality data with filters",
    description="Filter air quality observations by various pollutant levels",
)
async def query_air_quality(
    # Station filter
    station_id: Optional[str] = Query(
        None, description="Station ID to query (e.g., '3276359' or '6068138'). If not provided, queries all stations."
    ),
    # Air Quality Index filters
    min_aqi: Optional[float] = Query(None, ge=0, description="Minimum Air Quality Index"),
    max_aqi: Optional[float] = Query(None, ge=0, description="Maximum Air Quality Index"),
    # Particulate Matter filters
    min_pm25: Optional[float] = Query(None, ge=0, description="Minimum PM2.5 level (μg/m³)"),
    max_pm25: Optional[float] = Query(None, ge=0, description="Maximum PM2.5 level (μg/m³)"),
    min_pm10: Optional[float] = Query(None, ge=0, description="Minimum PM10 level (μg/m³)"),
    max_pm10: Optional[float] = Query(None, ge=0, description="Maximum PM10 level (μg/m³)"),
    # Gas pollutant filters
    min_co: Optional[float] = Query(None, ge=0, description="Minimum CO level (mg/m³)"),
    max_co: Optional[float] = Query(None, ge=0, description="Maximum CO level (mg/m³)"),
    min_no2: Optional[float] = Query(None, ge=0, description="Minimum NO2 level (μg/m³)"),
    max_no2: Optional[float] = Query(None, ge=0, description="Maximum NO2 level (μg/m³)"),
    min_o3: Optional[float] = Query(None, ge=0, description="Minimum O3 level (μg/m³)"),
    max_o3: Optional[float] = Query(None, ge=0, description="Maximum O3 level (μg/m³)"),
    min_so2: Optional[float] = Query(None, ge=0, description="Minimum SO2 level (μg/m³)"),
    max_so2: Optional[float] = Query(None, ge=0, description="Maximum SO2 level (μg/m³)"),
    # Air quality level filter
    air_quality_level: Optional[str] = Query(
        None, description="Air quality level (e.g., 'good', 'moderate', 'unhealthy')"
    ),
    # Time filter (optional - defaults to last 24 hours if not provided)
    start_time: Optional[datetime] = Query(
        None, description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"
    ),
    end_time: Optional[datetime] = Query(None, description="End time (ISO 8601 format)"),
    # Pagination
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of results"),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker),
):
    """
    Query air quality observations with multiple filters from historical data.

    **Note:** This endpoint queries temporal data (Timescale DB via Mintaka).
    MongoDB only stores the latest record. For current data, use `/latest`.

    **Example Requests:**

    1. Get all stations' data with high AQI:
    ```
    GET /air-quality/query?min_aqi=100&start_time=2025-12-03T00:00:00Z&end_time=2025-12-04T00:00:00Z
    ```

    2. Get specific station's high PM2.5 readings:
    ```
    GET /air-quality/query?station_id=3276359&min_pm25=35&start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z
    ```

    **Context Broker Temporal Query:**
    ```
    GET /temporal/entities/
        ?type=AirQualityObserved
        &timerel=between
        &timeAt=2025-12-01T00:00:00Z
        &endTimeAt=2025-12-02T00:00:00Z
        &q=airQualityIndex>=100;pm25>=35
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

        # Build NGSI-LD query string
        conditions = []

        if min_aqi is not None:
            conditions.append(f"airQualityIndex>={min_aqi}")
        if max_aqi is not None:
            conditions.append(f"airQualityIndex<={max_aqi}")
        if min_pm25 is not None:
            conditions.append(f"pm25>={min_pm25}")
        if max_pm25 is not None:
            conditions.append(f"pm25<={max_pm25}")
        if min_pm10 is not None:
            conditions.append(f"pm10>={min_pm10}")
        if max_pm10 is not None:
            conditions.append(f"pm10<={max_pm10}")
        if min_co is not None:
            conditions.append(f"co>={min_co}")
        if max_co is not None:
            conditions.append(f"co<={max_co}")
        if min_no2 is not None:
            conditions.append(f"no2>={min_no2}")
        if max_no2 is not None:
            conditions.append(f"no2<={max_no2}")
        if min_o3 is not None:
            conditions.append(f"o3>={min_o3}")
        if max_o3 is not None:
            conditions.append(f"o3<={max_o3}")
        if min_so2 is not None:
            conditions.append(f"so2>={min_so2}")
        if max_so2 is not None:
            conditions.append(f"so2<={max_so2}")
        if air_quality_level:
            conditions.append(f'airQualityLevel=="{air_quality_level}"')

        query_string = ";".join(conditions) if conditions else None

        # Build entity ID for station filtering
        if station_id:
            # Query specific station
            entity_id = get_air_quality_entity_id(station_id)
        else:
            # Cannot query all stations without entity ID - return error
            return APIResponse(
                success=False,
                code=400,
                message="station_id is required for query endpoint",
                error="MISSING_STATION_ID",
                result=None,
            )

        # Query temporal data with filters
        temporal_data = await context_broker_client.get_temporal_entities(
            entity_id=entity_id,
            timerel="between",
            time_at=start_time,
            end_time_at=end_time,
            q=query_string,
            entity_format="concise",
        )

        # Wrap single entity result in list for consistency
        entities = [temporal_data] if temporal_data else []

        result = {"total": len(entities), "items": entities}

        return APIResponse(
            success=True, code=200, message=f"Found {len(entities)} air quality observations", error=None, result=result
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in query_air_quality: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to query air quality data: {str(e)}",
            error="QUERY_ERROR",
            result=None,
        )


@router.get(
    "/history", summary="Get air quality history", description="Retrieve historical air quality data for a time period"
)
async def get_air_quality_history(
    station_id: Optional[str] = Query(
        None, description="Station ID to query (e.g., '3276359' or '6068138'). If not provided, queries all stations."
    ),
    start_time: Optional[datetime] = Query(
        None, description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"
    ),
    end_time: Optional[datetime] = Query(None, description="End time (ISO 8601 format)"),
    last_n: Optional[int] = Query(
        None, ge=1, le=1000, description="Get last N observations (alternative to time range)"
    ),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of results"),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker),
):
    """
    Get historical air quality data.

    You can either:
    - Use time range: `start_time` and `end_time`
    - Or use `last_n` to get last N observations

    **Example Requests:**

    1. Get last 24 hours:
    ```
    GET /air-quality/history?last_n=24
    ```

    2. Get specific time range:
    ```
    GET /air-quality/history?start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z
    ```

    **Context Broker Temporal Query:**
    ```
    GET /temporal/entities/
        ?type=AirQualityObserved
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

        # Build entity ID for station filtering
        if station_id:
            # Query specific station
            entity_id = get_air_quality_entity_id(station_id)
        else:
            # Cannot query all stations without entity ID - return error
            return APIResponse(
                success=False,
                code=400,
                message="station_id is required for history queries",
                error="MISSING_STATION_ID",
                result=None,
            )

        entities = await context_broker_client.get_temporal_entities(
            entity_id=entity_id,
            timerel="between" if (start_time and end_time) else "before",
            time_at=start_time if start_time else datetime.utcnow(),
            end_time_at=end_time,
            last_n=last_n,
            entity_format="concise",
        )

        # Handle None result (entity not found or error)
        if entities is None:
            items = []
        else:
            items = [entities]  # Wrap single entity in list

        return APIResponse(
            success=True,
            code=200,
            message="Air quality history retrieved successfully",
            error=None,
            result={"total": len(items), "items": items},
        )
    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in get_air_quality_history: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to retrieve air quality history: {str(e)}",
            error="HISTORY_FETCH_ERROR",
            result=None,
        )


@router.get(
    "/statistics", summary="Get air quality statistics", description="Calculate statistical aggregations over time"
)
async def get_air_quality_statistics(
    station_id: str = Query(..., description="Station ID (e.g., 3276359)"),
    start_time: datetime = Query(..., description="Start time (ISO 8601 format)"),
    end_time: datetime = Query(..., description="End time (ISO 8601 format)"),
    attributes: str = Query(
        "airQualityIndex,pm25,pm10,co,no2,o3,so2",
        description="Comma-separated list of attributes to calculate stats for",
    ),
    context_broker_client: ContextBrokerClient = Depends(get_context_broker),
):
    """
    Get statistical aggregations for air quality data from a specific station.

    Returns min, max, avg, count for each requested attribute.

    **Example Request:**
    ```
    GET /air-quality/statistics?station_id=3276359&start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z&attributes=pm25,airQualityIndex
    ```

    **Response Format:**
    ```json
    {
        "success": true,
        "code": 200,
        "message": "Statistics calculated successfully",
        "error": null,
        "result": {
            "station_id": "3276359",
            "period": {
                "start": "2025-12-01T00:00:00Z",
                "end": "2025-12-02T00:00:00Z",
                "duration_hours": 24
            },
            "statistics": {
                "airQualityIndex": {
                    "min": 45,
                    "max": 120,
                    "avg": 78.5,
                    "count": 24
                },
                "pm25": {
                    "min": 12.5,
                    "max": 55.3,
                    "avg": 28.7,
                    "count": 24
                }
            }
        }
    }
    ```
    """
    try:
        attr_list = [a.strip() for a in attributes.split(",")]

        # Get entity ID for the specific station
        entity_id = get_air_quality_entity_id(station_id)

        # Get temporal data for the period
        temporal_data = await context_broker_client.get_temporal_entities(
            entity_id=entity_id,
            timerel="between",
            time_at=start_time,
            end_time_at=end_time,
            attrs=attr_list,
            entity_format="temporalValues",
        )

        if not temporal_data:
            return APIResponse(
                success=False,
                code=404,
                message="No data available for the specified period",
                error="NO_DATA",
                result=None,
            )

        # Calculate statistics for each attribute
        # temporal_data is a single entity, not a list
        statistics = {}
        for attr in attr_list:
            if attr in temporal_data:
                values = []
                # Extract values from temporal format (array of {value, observedAt, ...})
                attr_data = temporal_data[attr]
                if isinstance(attr_data, list):
                    # Temporal format: [{type: "Property", value: 29.01, observedAt: "...", ...}, ...]
                    for item in attr_data:
                        if isinstance(item, dict) and "value" in item:
                            val = item["value"]
                            if isinstance(val, (int, float)):
                                values.append(val)
                        elif isinstance(item, (int, float)):
                            values.append(item)
                elif isinstance(attr_data, dict) and "value" in attr_data:
                    # Single value format
                    val = attr_data["value"]
                    if isinstance(val, (int, float)):
                        values.append(val)
                elif isinstance(attr_data, (int, float)):
                    # Direct value
                    values.append(attr_data)

                if values:
                    statistics[attr] = {
                        "min": min(values),
                        "max": max(values),
                        "avg": sum(values) / len(values),
                        "count": len(values),
                    }

        duration_hours = (end_time - start_time).total_seconds() / 3600

        result = {
            "station_id": station_id,
            "period": {"start": start_time.isoformat(), "end": end_time.isoformat(), "duration_hours": duration_hours},
            "statistics": statistics,
        }

        return APIResponse(
            success=True, code=200, message="Statistics calculated successfully", error=None, result=result
        )

    except Exception as e:
        return APIResponse.fail(message=f"Failed to calculate statistics: {str(e)}", error_code="STATS_ERROR", code=500)
    finally:
        await context_broker_client.close()
