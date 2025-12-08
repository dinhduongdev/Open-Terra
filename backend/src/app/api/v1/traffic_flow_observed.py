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

router = APIRouter(prefix="/traffic-flow-observed", tags=["traffic-flow-observed"])


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


def extract_sensor_id(entity_id: str) -> str:
    """
    Extract sensor ID from entity ID.

    Examples:
        'urn:ngsi-ld:TrafficFlowObserved:001' -> '001'
        'urn:ngsi-ld:TrafficFlowObserved:sensor-123' -> 'sensor-123'

    Args:
        entity_id: The full entity ID

    Returns:
        The extracted sensor ID (last part after the last colon)
    """
    if ":" in entity_id:
        return entity_id.split(":")[-1]
    return entity_id


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
    summary="Get latest traffic flow observations",
    description=(
        "Retrieve the most recent traffic flow data from all sensors across both tenants (default and openiot)"
    ),
)
async def get_latest_traffic_flow():
    """
    Get the latest traffic flow observations from all sensors.

    This endpoint queries both the default tenant and the openiot tenant to gather
    all available traffic flow data.

    **Example Request:**
    ```
    GET /v1/traffic-flow-observed/latest
    ```

    **Context Broker Query:**
    ```
    # Default tenant
    GET /ngsi-ld/v1/entities?type=TrafficFlowObserved&limit=100&format=concise

    # OpenIoT tenant
    GET /ngsi-ld/v1/entities?type=TrafficFlowObserved&limit=100&format=concise
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
                entity_type="TrafficFlowObserved", entity_format="concise", limit=100
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
                entity_type="TrafficFlowObserved", entity_format="concise", limit=100
            )
            if openiot_entities:
                all_entities.extend(openiot_entities)
        finally:
            await client_openiot.close()

        if not all_entities:
            return APIResponse(
                success=False, code=404, message="No traffic flow data available", error="NO_DATA", result=None
            )

        return APIResponse(
            success=True,
            code=200,
            message=f"Latest traffic flow data retrieved successfully ({len(all_entities)} sensors)",
            error=None,
            result={"total": len(all_entities), "items": all_entities},
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in get_latest_traffic_flow: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to retrieve traffic flow data: {str(e)}",
            error="TRAFFIC_FLOW_FETCH_ERROR",
            result=None,
        )


@router.get(
    "/query",
    summary="Query traffic flow data with filters",
    description="Filter traffic flow observations by various conditions",
)
async def query_traffic_flow(
    # Traffic metrics filters
    min_intensity: float | None = Query(None, description="Minimum vehicle count"),
    max_intensity: float | None = Query(None, description="Maximum vehicle count"),
    min_average_speed: float | None = Query(None, description="Minimum average vehicle speed"),
    max_average_speed: float | None = Query(None, description="Maximum average vehicle speed"),
    min_occupancy: float | None = Query(None, ge=0.0, le=1.0, description="Minimum lane occupancy (0.0-1.0)"),
    max_occupancy: float | None = Query(None, ge=0.0, le=1.0, description="Maximum lane occupancy (0.0-1.0)"),
    # Status filters
    congested: bool | None = Query(None, description="Filter by congestion status"),
    sensor_id: str | None = Query(None, description="Filter by specific sensor ID (e.g., '001', '002')"),
    lane_direction: str | None = Query(None, description="Lane direction ('forward' or 'backward')"),
    vehicle_type: str | None = Query(None, description="Filter by vehicle type"),
    # Time filter (optional - defaults to last 24 hours if not provided)
    start_time: datetime | None = Query(None, description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"),
    end_time: datetime | None = Query(None, description="End time (ISO 8601 format)"),
    # Limit results
    last_n: int | None = Query(None, ge=1, le=1000, description="Limit to last N observations per sensor"),
):
    """
    Query traffic flow observations with multiple filters from historical data.

    **Note:** This endpoint queries temporal data (Timescale DB via Mintaka) from both tenants.

    **Example Requests:**

    1. Get high traffic intensity in last 24 hours:
    ```
    GET /traffic-flow-observed/query?min_intensity=50&start_time=2025-12-03T00:00:00Z&end_time=2025-12-04T00:00:00Z
    ```

    2. Get congested lanes:
    ```
    GET /traffic-flow-observed/query?congested=true&start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z
    ```

    **Context Broker Temporal Query:**
    ```
    GET /temporal/entities/
        ?type=TrafficFlowObserved
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

        if min_intensity is not None:
            conditions.append(("intensity", ">=", min_intensity))
        if max_intensity is not None:
            conditions.append(("intensity", "<=", max_intensity))
        if min_average_speed is not None:
            conditions.append(("averageVehicleSpeed", ">=", min_average_speed))
        if max_average_speed is not None:
            conditions.append(("averageVehicleSpeed", "<=", max_average_speed))
        if min_occupancy is not None:
            conditions.append(("occupancy", ">=", min_occupancy))
        if max_occupancy is not None:
            conditions.append(("occupancy", "<=", max_occupancy))
        if congested is not None:
            conditions.append(("congested", "==", congested))
        if lane_direction:
            conditions.append(("laneDirection", "==", lane_direction))
        if vehicle_type:
            conditions.append(("vehicleType", "==", vehicle_type))

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
                # First get all entities of type TrafficFlowObserved
                entities = await client.get_entities(
                    entity_type="TrafficFlowObserved", entity_format="concise", limit=100
                )

                if not entities:
                    continue

                # Filter by sensor_id if provided
                if sensor_id:
                    entities = [e for e in entities if extract_sensor_id(e.get("id", "")) == sensor_id]

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
            message=f"Found {len(all_entities)} traffic flow observations",
            error=None,
            result=result,
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in query_traffic_flow: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(success=False, code=500, message=f"Query failed: {str(e)}", error="QUERY_ERROR", result=None)


@router.get(
    "/history",
    summary="Get traffic flow history",
    description="Retrieve historical traffic flow data for a time period",
)
async def get_traffic_flow_history(
    start_time: datetime | None = Query(None, description="Start time (ISO 8601 format, e.g., 2025-12-01T00:00:00Z)"),
    end_time: datetime | None = Query(None, description="End time (ISO 8601 format)"),
    last_n: int | None = Query(
        None, ge=1, le=1000, description="Get last N observations per sensor (alternative to time range)"
    ),
    sensor_id: str | None = Query(None, description="Filter by specific sensor ID (e.g., '001', '002')"),
):
    """
    Get historical traffic flow data from both tenants.

    You can either:
    - Use time range: `start_time` and `end_time`
    - Or use `last_n` to get last N observations per sensor

    **Example Requests:**

    1. Get last 24 observations per sensor:
    ```
    GET /traffic-flow-observed/history?last_n=24
    ```

    2. Get specific time range:
    ```
    GET /traffic-flow-observed/history?start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z
    ```

    **Context Broker Temporal Query:**
    ```
    GET /temporal/entities/
        ?type=TrafficFlowObserved
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
                # Get all TrafficFlowObserved entities
                entities = await client.get_entities(
                    entity_type="TrafficFlowObserved", entity_format="concise", limit=100
                )

                if not entities:
                    continue

                # Filter by sensor_id if provided
                if sensor_id:
                    entities = [e for e in entities if extract_sensor_id(e.get("id", "")) == sensor_id]

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
            message="Traffic flow history retrieved successfully",
            error=None,
            result={"total": len(all_entities), "items": all_entities},
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in get_traffic_flow_history: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to retrieve traffic flow history: {str(e)}",
            error="HISTORY_FETCH_ERROR",
            result=None,
        )


@router.get(
    "/statistics", summary="Get traffic flow statistics", description="Calculate statistical aggregations over time"
)
async def get_traffic_flow_statistics(
    start_time: datetime = Query(..., description="Start time (ISO 8601 format)"),
    end_time: datetime = Query(..., description="End time (ISO 8601 format)"),
    attributes: str = Query(
        "intensity,averageVehicleSpeed,occupancy,averageHeadwayTime",
        description="Comma-separated list of attributes to calculate stats for",
    ),
    sensor_id: str | None = Query(None, description="Filter by specific sensor ID (e.g., '001', '002')"),
):
    """
    Get statistical aggregations for traffic flow data across both
    tenants.

    Returns min, max, avg, count for each requested attribute.

    **Example Request:**
    ```
    GET /traffic-flow-observed/statistics?start_time=2025-12-01T00:00:00Z&
        end_time=2025-12-02T00:00:00Z&attributes=intensity,averageVehicleSpeed
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
            "sensors": {
                "sensor-001": {
                    "intensity": {
                        "min": 10.0,
                        "max": 150.0,
                        "avg": 75.5,
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
        sensors_stats = {}

        # Query both tenants
        for tenant_name, tenant_value in [("default", None), ("openiot", "openiot")]:
            client = ContextBrokerClient(
                broker_url=settings.ORION_LD_BASE_URL,
                mintaka_url=settings.MINTAKA_BASE_URL,
                context_url=settings.ORION_LD_CONTEXT,
                tenant=tenant_value,
            )

            try:
                # Get all TrafficFlowObserved entities
                entities = await client.get_entities(
                    entity_type="TrafficFlowObserved", entity_format="concise", limit=100
                )

                if not entities:
                    continue

                # Filter by sensor_id if provided
                if sensor_id:
                    entities = [e for e in entities if extract_sensor_id(e.get("id", "")) == sensor_id]

                # For each entity, get temporal data and calculate stats
                for entity in entities:
                    entity_id = entity.get("id")

                    if not entity_id:
                        continue

                    entity_sensor_id = extract_sensor_id(entity_id)

                    temporal_data = await client.get_temporal_entity(
                        entity_id=entity_id,
                        timerel="between",
                        time_at=start_time,
                        end_time_at=end_time,
                        entity_format="concise",
                    )

                    if not temporal_data:
                        continue

                    # Debug: Print available attributes
                    print(f"[DEBUG] Temporal data keys for {entity_sensor_id}: {list(temporal_data.keys())}")

                    # Calculate statistics for this sensor
                    sensor_statistics = {}

                    for attr in attr_list:
                        if attr not in temporal_data:
                            sensor_statistics[attr] = {
                                "min": None,
                                "max": None,
                                "avg": None,
                                "count": 0,
                                "error": f"Attribute '{attr}' not found in temporal data",
                            }
                            continue

                        attr_data = temporal_data[attr]

                        if not isinstance(attr_data, list):
                            sensor_statistics[attr] = {
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
                            sensor_statistics[attr] = {
                                "min": round(min(values), 4),
                                "max": round(max(values), 4),
                                "avg": round(sum(values) / len(values), 4),
                                "count": len(values),
                            }
                        else:
                            sensor_statistics[attr] = {
                                "min": None,
                                "max": None,
                                "avg": None,
                                "count": 0,
                                "error": "No numeric values found",
                            }

                    sensors_stats[entity_sensor_id] = sensor_statistics

            finally:
                await client.close()

        if not sensors_stats:
            return APIResponse(
                success=False,
                code=404,
                message="No temporal data found in the specified time range. Try a more recent time period.",
                error="NO_DATA",
                result=None,
            )

        result = {
            "period": {"start": start_time.isoformat(), "end": end_time.isoformat(), "duration_hours": duration_hours},
            "sensors": sensors_stats,
        }

        return APIResponse(
            success=True, code=200, message="Statistics calculated successfully", error=None, result=result
        )

    except Exception as e:
        import traceback

        print(f"[ERROR] Exception in get_traffic_flow_statistics: {str(e)}")
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to calculate statistics: {str(e)}",
            error="STATISTICS_ERROR",
            result=None,
        )
