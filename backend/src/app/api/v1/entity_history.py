"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import logging
from datetime import datetime
from enum import Enum

from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import Response

from app.core.config import settings
from app.schemas.api_response import APIResponse
from app.services.context_broker_client import ContextBrokerClient
from app.utils.export_utils import (
    temporal_entity_to_json,
    temporal_entities_to_json,
    temporal_entity_to_csv,
    temporal_entities_to_csv,
    get_export_filename,
)

router = APIRouter(prefix="/entity-history", tags=["entity-history"])
logger = logging.getLogger(__name__)


class ExportFormat(str, Enum):
    """Supported export formats."""

    JSON = "json"
    CSV = "csv"


async def get_context_broker():
    """Get Context Broker client dependency."""
    client = ContextBrokerClient(
        broker_url=settings.ORION_LD_BASE_URL,
        mintaka_url=settings.MINTAKA_BASE_URL,
        context_url=settings.ORION_LD_CONTEXT,
    )
    try:
        yield client
    finally:
        await client.close()


@router.get(
    "/export",
    summary="Export entity history data",
    description="Query temporal history data for entities and export in various formats (JSON, CSV)",
)
async def export_entity_history(
    entity_type: str = Query(
        ...,
        description="Entity type to query (e.g., 'AirQualityObserved', 'WeatherObserved', 'TrafficFlowObserved', 'FloodMonitoring')",
    ),
    format: ExportFormat = Query(
        ...,
        description="Export format (json or csv)",
    ),
    entity_id: str | None = Query(
        None,
        description="Specific entity ID to query. If omitted, queries all entities of the specified type.",
    ),
    start_time: datetime | None = Query(
        None,
        description="Start time for temporal query (ISO 8601 format)",
    ),
    end_time: datetime | None = Query(
        None,
        description="End time for temporal query (ISO 8601 format)",
    ),
    last_n: int | None = Query(
        None,
        ge=1,
        le=10000,
        description="Get last N observations (alternative to time range)",
    ),
    attrs: str | None = Query(
        None,
        description="Comma-separated list of attributes to include in export",
    ),
    tenant: str | None = Query(
        None,
        description="NGSILD-Tenant for multi-tenant support",
    ),
    context_broker: ContextBrokerClient = Depends(get_context_broker),
):
    """
    Export temporal history data for entities.

    This endpoint provides a unified way to query any entity type's historical data
    from the Orion Context Broker and download it in open formats.

    **Query Methods:**
    - Time range: Specify both `start_time` and `end_time`
    - Last N: Use `last_n` to get the most recent observations

    **Supported Formats:**
    - `json`: Native NGSI-LD temporal format
    - `csv`: Tabular format with flattened observations (one row per timestamp)

    **Example Requests:**

    1. Export last 24 hours of air quality data as CSV:
    ```
    GET /api/v1/entity-history/export?entity_type=AirQualityObserved&last_n=24&format=csv
    ```

    2. Export specific station data in JSON:
    ```
    GET /api/v1/entity-history/export?entity_type=WeatherObserved&entity_id=urn:ngsi-ld:WeatherObserved:Station-001&start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z&format=json
    ```

    3. Export only specific attributes:
    ```
    GET /api/v1/entity-history/export?entity_type=AirQualityObserved&last_n=100&attrs=pm25,pm10,temperature&format=csv
    ```
    """
    try:
        # Validate input parameters
        if last_n is None and (start_time is None or end_time is None):
            raise HTTPException(
                status_code=400,
                detail="Must provide either 'last_n' or both 'start_time' and 'end_time'",
            )

        if start_time is not None and end_time is not None and start_time >= end_time:
            raise HTTPException(
                status_code=400,
                detail="start_time must be before end_time",
            )

        # Parse attributes if provided
        attr_list = None
        if attrs:
            attr_list = [a.strip() for a in attrs.split(",")]

        # Create context broker client with tenant if specified
        if tenant:
            context_broker.tenant = tenant

        # Query temporal data
        logger.info(f"Querying entity history: type={entity_type}, entity_id={entity_id}, format={format}")

        # Determine timerel based on parameters
        if start_time and end_time:
            timerel = "between"
            query_time_at = start_time
            query_end_time_at = end_time
        elif start_time:
            timerel = "after"
            query_time_at = start_time
            query_end_time_at = None
        else:
            # When using only last_n, set timerel to "before" with current time
            timerel = "before"
            query_time_at = datetime.utcnow()
            query_end_time_at = None

        entities = []

        if entity_id:
            # Query specific entity temporal data
            temporal_data = await context_broker.get_temporal_entity(
                entity_id=entity_id,
                timerel=timerel,
                time_at=query_time_at,
                end_time_at=query_end_time_at,
                last_n=last_n,
                attrs=attr_list,
                entity_format="concise",
            )

            if temporal_data is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Entity '{entity_id}' not found or has no temporal data",
                )

            entities = [temporal_data]
        else:
            # Query all entities of type first (to get entity IDs)
            # This works with short names like "FloodMonitoring" even if actual type is full URL
            current_entities = await context_broker.get_entities(
                entity_type=entity_type,
                entity_format="concise",
                limit=100,
            )

            if not current_entities:
                raise HTTPException(
                    status_code=404,
                    detail=f"No entities of type '{entity_type}' found",
                )

            logger.info(f"Found {len(current_entities)} entities of type {entity_type}, querying temporal data")

            # For each entity, get temporal data
            for entity in current_entities:
                entity_id_from_list = entity.get("id")
                if not entity_id_from_list:
                    continue

                try:
                    temporal_data = await context_broker.get_temporal_entity(
                        entity_id=entity_id_from_list,
                        timerel=timerel,
                        time_at=query_time_at,
                        end_time_at=query_end_time_at,
                        last_n=last_n,
                        attrs=attr_list,
                        entity_format="concise",
                    )

                    if temporal_data:
                        entities.append(temporal_data)
                except Exception as e:
                    logger.warning(f"Failed to get temporal data for entity {entity_id_from_list}: {e}")
                    continue

            if not entities:
                raise HTTPException(
                    status_code=404,
                    detail=f"No temporal data found for entities of type '{entity_type}'",
                )

        # Convert to requested format
        logger.info(f"Converting {len(entities)} entities to {format} format")

        if format == ExportFormat.JSON:
            if len(entities) == 1:
                content = temporal_entity_to_json(entities[0], pretty=True)
            else:
                content = temporal_entities_to_json(entities, pretty=True)

            media_type = "application/json"
            content_bytes = content.encode("utf-8")

        elif format == ExportFormat.CSV:
            if len(entities) == 1:
                content = temporal_entity_to_csv(entities[0])
            else:
                content = temporal_entities_to_csv(entities)

            media_type = "text/csv"
            content_bytes = content.encode("utf-8")

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported format: {format}",
            )

        # Generate filename
        filename = get_export_filename(entity_type, format.value, entity_id)

        logger.info(f"Export successful: {filename}, size: {len(content_bytes)} bytes")

        # Return file response
        return Response(
            content=content_bytes,
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Length": str(len(content_bytes)),
            },
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise

    except Exception as e:
        logger.error(f"Error exporting entity history: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to export entity history: {str(e)}",
        )


@router.get(
    "/info",
    summary="Get export endpoint information",
    description="Get information about supported entity types and export formats",
)
async def get_export_info():
    """
    Get information about the export endpoint.

    Returns details about supported formats, entity types, and usage examples.
    """
    return APIResponse(
        success=True,
        code=200,
        message="Entity history export endpoint information",
        error=None,
        result={
            "endpoint": "/api/v1/entity-history/export",
            "supported_formats": [format.value for format in ExportFormat],
            "common_entity_types": [
                "AirQualityObserved",
                "WeatherObserved",
                "TrafficFlowObserved",
                "FloodMonitoring",
            ],
            "query_methods": {
                "time_range": {
                    "description": "Query data within a specific time range",
                    "parameters": ["start_time", "end_time"],
                    "example": "?start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z",
                },
                "last_n": {
                    "description": "Get the last N observations",
                    "parameters": ["last_n"],
                    "example": "?last_n=24",
                },
            },
            "examples": [
                {
                    "description": "Export last 24 hours of air quality data as CSV",
                    "url": "/api/v1/entity-history/export?entity_type=AirQualityObserved&last_n=24&format=csv",
                },
                {
                    "description": "Export specific weather station data as JSON",
                    "url": "/api/v1/entity-history/export?entity_type=WeatherObserved&entity_id=urn:ngsi-ld:WeatherObserved:Station-001&start_time=2025-12-01T00:00:00Z&end_time=2025-12-02T00:00:00Z&format=json",
                },
                {
                    "description": "Export only PM2.5 and temperature from all air quality stations",
                    "url": "/api/v1/entity-history/export?entity_type=AirQualityObserved&last_n=100&attrs=pm25,temperature&format=csv",
                },
            ],
        },
    )
