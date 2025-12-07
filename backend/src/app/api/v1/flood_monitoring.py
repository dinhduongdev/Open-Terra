"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from datetime import datetime, timedelta

from fastapi import APIRouter, Query

from app.core.config import settings
from app.schemas.api_response import APIResponse
from app.services.context_broker_client import ContextBrokerClient

router = APIRouter(prefix="/flood-monitoring", tags=["flood-monitoring"])


def get_property_value(entity: dict, property_name: str):
    """
    Extract property value from an entity in concise format.

    In concise format, properties are objects with a 'value' key.
    This helper handles both direct values and property objects.

    Args:
        entity: The entity dict
        property_name: Name of the property to extract

    Returns:
        The property value, or None if not found
    """
    prop = entity.get(property_name)
    if prop is None:
        return None
    # In concise format, it's a dict with 'value' key
    if isinstance(prop, dict):
        return prop.get("value")
    # Fallback for direct values
    return prop


async def get_context_broker_default() -> ContextBrokerClient:
    """Get context broker client for default tenant."""
    client = ContextBrokerClient(
        broker_url=settings.ORION_LD_BASE_URL,
        mintaka_url=settings.MINTAKA_BASE_URL,
        context_url=settings.ORION_LD_CONTEXT,
    )
    try:
        yield client
    finally:
        await client.close()


async def get_context_broker_openiot() -> ContextBrokerClient:
    """Get context broker client for openiot tenant."""
    client = ContextBrokerClient(
        broker_url=settings.ORION_LD_BASE_URL,
        mintaka_url=settings.MINTAKA_BASE_URL,
        context_url=settings.ORION_LD_CONTEXT,
        tenant="openiot",
    )
    try:
        yield client
    finally:
        await client.close()


@router.get(
    "/latest",
    summary="Get latest flood monitoring observations",
    description=(
        "Retrieve the most recent flood monitoring data from all stations across both tenants (default and openiot)"
    ),
)
async def get_latest_flood_monitoring():
    """
    Get the latest flood monitoring observations from all stations.

    This endpoint queries both the default tenant and the openiot tenant to gather
    all available flood monitoring data.

    **Example Request:**
    ```
    GET /v1/flood-monitoring/latest
    ```

    **Context Broker Query:**
    ```
    # Default tenant
    GET /ngsi-ld/v1/entities?type=FloodMonitoring&limit=100&format=concise

    # OpenIoT tenant
    GET /ngsi-ld/v1/entities?type=FloodMonitoring&limit=100&format=concise
    Headers: NGSILD-Tenant: openiot, NGSILD-Path: /
    ```
    """
    try:
        all_entities = []

        # Query default tenant
        client_default = ContextBrokerClient(
            broker_url=settings.ORION_LD_BASE_URL,
            mintaka_url=settings.MINTAKA_BASE_URL,
            context_url=settings.ORION_LD_CONTEXT,
        )
        try:
            default_entities = await client_default.get_entities(
                entity_type="FloodMonitoring", entity_format="concise", limit=100
            )
            if default_entities:
                all_entities.extend(default_entities)
        finally:
            await client_default.close()

        # Query openiot tenant
        client_openiot = ContextBrokerClient(
            broker_url=settings.ORION_LD_BASE_URL,
            mintaka_url=settings.MINTAKA_BASE_URL,
            context_url=settings.ORION_LD_CONTEXT,
            tenant="openiot",
        )
        try:
            openiot_entities = await client_openiot.get_entities(
                entity_type="FloodMonitoring", entity_format="concise", limit=100
            )
            if openiot_entities:
                all_entities.extend(openiot_entities)
        finally:
            await client_openiot.close()

        if not all_entities:
            return APIResponse(
                success=False, code=404, message="No flood monitoring data available", error="NO_DATA", result=None
            )

        return APIResponse(
            success=True,
            code=200,
            message=f"Latest flood monitoring data retrieved successfully ({len(all_entities)} stations)",
            error=None,
            result={"total": len(all_entities), "items": all_entities},
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in get_latest_flood_monitoring: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to retrieve flood monitoring data: {str(e)}",
            error="FLOOD_MONITORING_FETCH_ERROR",
            result=None,
        )


@router.get(
    "/query",
    summary="Query flood monitoring data with filters",
    description="Filter flood monitoring observations by various conditions",
)
async def query_flood_monitoring(
    # Level filters
    min_current_level: float | None = Query(None, description="Minimum current water level"),
    max_current_level: float | None = Query(None, description="Maximum current water level"),
    min_alert_level: float | None = Query(None, description="Minimum alert level threshold"),
    max_alert_level: float | None = Query(None, description="Maximum alert level threshold"),
    min_danger_level: float | None = Query(None, description="Minimum danger level threshold"),
    max_danger_level: float | None = Query(None, description="Maximum danger level threshold"),
    # Status filters
    flood_level_status: str | None = Query(None, description="Flood level status (e.g., 'Normal', 'Alert', 'Danger')"),
    station_id: str | None = Query(None, description="Filter by specific station ID"),
    # Time filter (optional - defaults to last 24 hours if not provided)
    start_time: datetime | None = Query(None, description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"),
    end_time: datetime | None = Query(None, description="End time (ISO 8601 format)"),
    # Limit results
    last_n: int | None = Query(None, ge=1, le=1000, description="Limit to last N observations per station"),
):
    """
    Query flood monitoring observations with multiple filters from historical data.

    **Note:** This endpoint queries temporal data (Timescale DB via Mintaka) from both tenants.

    **Example Requests:**

    1. Get high water levels in last 24 hours:
    ```
    GET /flood-monitoring/query?min_current_level=2.0&start_time=2025-12-03T00:00:00Z&end_time=2025-12-04T00:00:00Z
    ```

    2. Get danger status alerts:
    ```
    GET /flood-monitoring/query?flood_level_status=Danger&start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z
    ```

    **Context Broker Temporal Query:**
    ```
    GET /temporal/entities/
        ?type=FloodMonitoring
        &timerel=between
        &timeAt=2025-12-01T00:00:00Z
        &endTimeAt=2025-12-02T00:00:00Z
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
        conditions = []

        if min_current_level is not None:
            conditions.append(("currentLevel", ">=", min_current_level))
        if max_current_level is not None:
            conditions.append(("currentLevel", "<=", max_current_level))
        if min_alert_level is not None:
            conditions.append(("alertLevel", ">=", min_alert_level))
        if max_alert_level is not None:
            conditions.append(("alertLevel", "<=", max_alert_level))
        if min_danger_level is not None:
            conditions.append(("dangerLevel", ">=", min_danger_level))
        if max_danger_level is not None:
            conditions.append(("dangerLevel", "<=", max_danger_level))
        if flood_level_status:
            conditions.append(("floodLevelStatus", "==", flood_level_status))
        if station_id:
            conditions.append(("stationID", "==", station_id))

        all_entities = []

        # Query both tenants
        for tenant_name, tenant_value in [("default", None), ("openiot", "openiot")]:
            client = ContextBrokerClient(
                broker_url=settings.ORION_LD_BASE_URL,
                mintaka_url=settings.MINTAKA_BASE_URL,
                context_url=settings.ORION_LD_CONTEXT,
                tenant=tenant_value,
            )

            try:
                # First get all entities of type FloodMonitoring
                entities = await client.get_entities(entity_type="FloodMonitoring", entity_format="concise", limit=100)

                if not entities:
                    continue

                # For each entity, get temporal data
                for entity in entities:
                    entity_id = entity.get("id")
                    if not entity_id:
                        continue

                    temporal_data = await client.get_temporal_entity(
                        entity_id=entity_id,
                        timerel="between",
                        time_at=start_time,
                        end_time_at=end_time,
                        last_n=last_n,
                        entity_format="concise",
                    )

                    # Client-side filtering
                    if temporal_data and conditions:
                        timestamp_data = {}

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

                        # Check which timestamps pass all filter conditions
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

                        # Rebuild entity with only valid timestamps
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
                                    filtered_values = [
                                        item
                                        for item in attr_values
                                        if isinstance(item, dict) and item.get("observedAt") in valid_timestamps
                                    ]
                                    if filtered_values:
                                        filtered_entity[attr_name] = filtered_values
                                else:
                                    filtered_entity[attr_name] = attr_values

                            temporal_data = filtered_entity

                    if temporal_data:
                        all_entities.append(temporal_data)

            finally:
                await client.close()

        result = {"total": len(all_entities), "items": all_entities}

        return APIResponse(
            success=True,
            code=200,
            message=f"Found {len(all_entities)} flood monitoring observations",
            error=None,
            result=result,
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in query_flood_monitoring: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(success=False, code=500, message=f"Query failed: {str(e)}", error="QUERY_ERROR", result=None)


@router.get(
    "/history",
    summary="Get flood monitoring history",
    description="Retrieve historical flood monitoring data for a time period",
)
async def get_flood_monitoring_history(
    start_time: datetime | None = Query(None, description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"),
    end_time: datetime | None = Query(None, description="End time (ISO 8601 format)"),
    last_n: int | None = Query(
        None, ge=1, le=1000, description="Get last N observations per station (alternative to time range)"
    ),
    station_id: str | None = Query(None, description="Filter by specific station ID"),
):
    """
    Get historical flood monitoring data from both tenants.

    You can either:
    - Use time range: `start_time` and `end_time`
    - Or use `last_n` to get last N observations per station

    **Example Requests:**

    1. Get last 24 observations per station:
    ```
    GET /flood-monitoring/history?last_n=24
    ```

    2. Get specific time range:
    ```
    GET /flood-monitoring/history?start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z
    ```

    **Context Broker Temporal Query:**
    ```
    GET /temporal/entities/
        ?type=FloodMonitoring
        &timerel=between
        &timeAt=2025-12-01T00:00:00Z
        &endTimeAt=2025-12-02T00:00:00Z
        &format=concise
    ```
    """
    try:
        # Validate input
        if last_n is not None and (start_time is not None or end_time is not None):
            return APIResponse(
                success=False,
                code=400,
                message="Cannot use both 'last_n' and time range",
                error="INVALID_PARAMS",
                result=None,
            )

        if last_n is None and (start_time is None or end_time is None):
            return APIResponse(
                success=False,
                code=400,
                message="Must provide either 'last_n' or both 'start_time' and 'end_time'",
                error="INVALID_PARAMS",
                result=None,
            )

        if start_time is not None and end_time is not None and start_time >= end_time:
            return APIResponse(
                success=False,
                code=400,
                message="start_time must be before end_time",
                error="INVALID_PARAMS",
                result=None,
            )

        all_entities = []

        # Query both tenants
        for tenant_name, tenant_value in [("default", None), ("openiot", "openiot")]:
            client = ContextBrokerClient(
                broker_url=settings.ORION_LD_BASE_URL,
                mintaka_url=settings.MINTAKA_BASE_URL,
                context_url=settings.ORION_LD_CONTEXT,
                tenant=tenant_value,
            )

            try:
                # Get all FloodMonitoring entities
                entities = await client.get_entities(entity_type="FloodMonitoring", entity_format="concise", limit=100)

                if not entities:
                    continue

                # Filter by station_id if provided
                if station_id:
                    entities = [e for e in entities if get_property_value(e, "stationID") == station_id]

                # For each entity, get temporal data
                for entity in entities:
                    entity_id = entity.get("id")
                    if not entity_id:
                        continue

                    temporal_data = await client.get_temporal_entity(
                        entity_id=entity_id,
                        timerel="between" if (start_time and end_time) else "before",
                        time_at=start_time if start_time else datetime.utcnow(),
                        end_time_at=end_time,
                        last_n=last_n,
                        entity_format="concise",
                    )

                    if temporal_data:
                        all_entities.append(temporal_data)

            finally:
                await client.close()

        return APIResponse(
            success=True,
            code=200,
            message="Flood monitoring history retrieved successfully",
            error=None,
            result={"total": len(all_entities), "items": all_entities},
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in get_flood_monitoring_history: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to retrieve flood monitoring history: {str(e)}",
            error="HISTORY_FETCH_ERROR",
            result=None,
        )


@router.get(
    "/statistics", summary="Get flood monitoring statistics", description="Calculate statistical aggregations over time"
)
async def get_flood_monitoring_statistics(
    start_time: datetime = Query(..., description="Start time (ISO 8601 format)"),
    end_time: datetime = Query(..., description="End time (ISO 8601 format)"),
    attributes: str = Query(
        "currentLevel,alertLevel,dangerLevel,measuredDistance",
        description="Comma-separated list of attributes to calculate stats for",
    ),
    station_id: str | None = Query(None, description="Filter by specific station ID"),
):
    """
    Get statistical aggregations for flood monitoring data across both
    tenants.

    Returns min, max, avg, count for each requested attribute.

    **Example Request:**
    ```
    GET /flood-monitoring/statistics?start_time=2025-12-01T00:00:00Z&
        end_time=2025-12-02T00:00:00Z&attributes=currentLevel,alertLevel
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
            "stations": {
                "station-001": {
                    "currentLevel": {
                        "min": 1.2,
                        "max": 3.5,
                        "avg": 2.3,
                        "count": 24
                    }
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
        attr_list = [a.strip() for a in attributes.split(",")]

        duration_hours = (end_time - start_time).total_seconds() / 3600
        stations_stats = {}

        # Query both tenants
        for tenant_name, tenant_value in [("default", None), ("openiot", "openiot")]:
            client = ContextBrokerClient(
                broker_url=settings.ORION_LD_BASE_URL,
                mintaka_url=settings.MINTAKA_BASE_URL,
                context_url=settings.ORION_LD_CONTEXT,
                tenant=tenant_value,
            )

            try:
                # Get all FloodMonitoring entities
                entities = await client.get_entities(entity_type="FloodMonitoring", entity_format="concise", limit=100)

                if not entities:
                    continue

                # Filter by station_id if provided
                if station_id:
                    entities = [e for e in entities if get_property_value(e, "stationID") == station_id]

                # For each entity, get temporal data and calculate stats
                for entity in entities:
                    entity_id = entity.get("id")
                    entity_station_id = get_property_value(entity, "stationID") or entity_id

                    if not entity_id:
                        continue

                    temporal_data = await client.get_temporal_entity(
                        entity_id=entity_id,
                        timerel="between",
                        time_at=start_time,
                        end_time_at=end_time,
                        entity_format="concise",
                    )

                    if not temporal_data:
                        continue

                    # Calculate statistics for this station
                    station_statistics = {}

                    for attr in attr_list:
                        if attr not in temporal_data:
                            station_statistics[attr] = {
                                "min": None,
                                "max": None,
                                "avg": None,
                                "count": 0,
                                "error": f"Attribute '{attr}' not found in temporal data",
                            }
                            continue

                        attr_data = temporal_data[attr]

                        if not isinstance(attr_data, list):
                            station_statistics[attr] = {
                                "min": None,
                                "max": None,
                                "avg": None,
                                "count": 0,
                                "error": "Not a temporal attribute",
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
                            station_statistics[attr] = {
                                "min": round(min(values), 4),
                                "max": round(max(values), 4),
                                "avg": round(sum(values) / len(values), 4),
                                "count": len(values),
                            }
                        else:
                            station_statistics[attr] = {
                                "min": None,
                                "max": None,
                                "avg": None,
                                "count": 0,
                                "error": "No numeric values found",
                            }

                    stations_stats[entity_station_id] = station_statistics

            finally:
                await client.close()

        if not stations_stats:
            return APIResponse(
                success=False,
                code=404,
                message="No temporal data found in the specified time range. Try a more recent time period.",
                error="NO_DATA",
                result=None,
            )

        result = {
            "period": {"start": start_time.isoformat(), "end": end_time.isoformat(), "duration_hours": duration_hours},
            "stations": stations_stats,
        }

        return APIResponse(
            success=True, code=200, message="Statistics calculated successfully", error=None, result=result
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in get_flood_monitoring_statistics: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to calculate statistics: {str(e)}",
            error="STATISTICS_ERROR",
            result=None,
        )
