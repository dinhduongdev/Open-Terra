"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import csv
import json
import io
from typing import Dict, List, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


def flatten_temporal_data(entity_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Flatten NGSI-LD temporal data into tabular rows.

    Temporal data from Mintaka comes in format:
    {
        "id": "urn:ngsi-ld:AirQualityObserved:...",
        "type": "AirQualityObserved",
        "pm25": [
            {"value": 25.5, "observedAt": "2025-12-01T00:00:00Z"},
            {"value": 26.1, "observedAt": "2025-12-01T01:00:00Z"}
        ],
        "temperature": [
            {"value": 28.3, "observedAt": "2025-12-01T00:00:00Z"},
            {"value": 28.5, "observedAt": "2025-12-01T01:00:00Z"}
        ]
    }

    This function converts it to rows where each row represents one timestamp:
    [
        {"id": "...", "type": "...", "observedAt": "2025-12-01T00:00:00Z", "pm25": 25.5, "temperature": 28.3},
        {"id": "...", "type": "...", "observedAt": "2025-12-01T01:00:00Z", "pm25": 26.1, "temperature": 28.5}
    ]

    Args:
        entity_data: Temporal entity data from Mintaka

    Returns:
        List of flattened row dictionaries
    """
    if not entity_data:
        return []

    entity_id = entity_data.get("id", "")
    entity_type = entity_data.get("type", "")

    # Collect all unique timestamps and their values across attributes
    timestamp_data = {}  # {observedAt: {attr_name: value, ...}}

    for attr_name, attr_values in entity_data.items():
        # Skip special keys
        if attr_name in ["id", "type", "@context"]:
            continue

        # Handle temporal attributes (list of observations)
        if isinstance(attr_values, list):
            for item in attr_values:
                if isinstance(item, dict) and "observedAt" in item:
                    timestamp = item["observedAt"]
                    value = item.get("value")

                    if timestamp not in timestamp_data:
                        timestamp_data[timestamp] = {}

                    timestamp_data[timestamp][attr_name] = value

        # Handle single observation format (dict with observedAt)
        # This is the format returned by Mintaka temporal queries
        elif isinstance(attr_values, dict):
            if "observedAt" in attr_values and "value" in attr_values:
                # Temporal attribute with single observation
                timestamp = attr_values["observedAt"]
                value = attr_values["value"]

                if timestamp not in timestamp_data:
                    timestamp_data[timestamp] = {}

                timestamp_data[timestamp][attr_name] = value
            # Handle non-temporal attributes (no observedAt)
            elif "value" in attr_values and "observedAt" not in attr_values:
                # Non-temporal attribute - could be added to all rows if needed
                pass

    # Convert to list of rows, sorted by timestamp
    rows = []
    for timestamp in sorted(timestamp_data.keys()):
        row = {"id": entity_id, "type": entity_type, "observedAt": timestamp}
        row.update(timestamp_data[timestamp])
        rows.append(row)

    logger.info(f"Flattened {len(timestamp_data)} timestamps into {len(rows)} rows")
    return rows


def temporal_entity_to_json(entity_data: Dict[str, Any], pretty: bool = True) -> str:
    """
    Convert temporal entity data to JSON string.

    Args:
        entity_data: Temporal entity data from Mintaka
        pretty: If True, format with indentation

    Returns:
        JSON string
    """
    if pretty:
        return json.dumps(entity_data, indent=2, ensure_ascii=False)
    else:
        return json.dumps(entity_data, ensure_ascii=False)


def temporal_entities_to_json(entities: List[Dict[str, Any]], pretty: bool = True) -> str:
    """
    Convert list of temporal entities to JSON string.

    Args:
        entities: List of temporal entity data from Mintaka
        pretty: If True, format with indentation

    Returns:
        JSON string
    """
    if pretty:
        return json.dumps(entities, indent=2, ensure_ascii=False)
    else:
        return json.dumps(entities, ensure_ascii=False)


def temporal_entity_to_csv(entity_data: Dict[str, Any]) -> str:
    """
    Convert temporal entity data to CSV format.

    Args:
        entity_data: Temporal entity data from Mintaka

    Returns:
        CSV string
    """
    rows = flatten_temporal_data(entity_data)

    if not rows:
        return ""

    # Get all unique column names
    columns = set()
    for row in rows:
        columns.update(row.keys())

    # Sort columns: id, type, observedAt first, then alphabetically
    priority_cols = ["id", "type", "observedAt"]
    other_cols = sorted([col for col in columns if col not in priority_cols])
    ordered_columns = priority_cols + other_cols

    # Write CSV to string buffer
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=ordered_columns, extrasaction="ignore")

    writer.writeheader()
    writer.writerows(rows)

    csv_content = output.getvalue()
    output.close()

    return csv_content


def temporal_entities_to_csv(entities: List[Dict[str, Any]]) -> str:
    """
    Convert multiple temporal entities to CSV format.

    All entities will be combined into a single CSV with all observations.

    Args:
        entities: List of temporal entity data from Mintaka

    Returns:
        CSV string
    """
    # Flatten all entities
    all_rows = []
    for entity in entities:
        rows = flatten_temporal_data(entity)
        all_rows.extend(rows)

    if not all_rows:
        return ""

    # Get all unique column names across all entities
    columns = set()
    for row in all_rows:
        columns.update(row.keys())

    # Sort columns: id, type, observedAt first, then alphabetically
    priority_cols = ["id", "type", "observedAt"]
    other_cols = sorted([col for col in columns if col not in priority_cols])
    ordered_columns = priority_cols + other_cols

    # Write CSV to string buffer
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=ordered_columns, extrasaction="ignore")

    writer.writeheader()
    writer.writerows(all_rows)

    csv_content = output.getvalue()
    output.close()

    logger.info(f"Converted {len(entities)} entities with {len(all_rows)} total observations to CSV")
    return csv_content


def get_export_filename(entity_type: str, format: str, entity_id: Optional[str] = None) -> str:
    """
    Generate a filename for exported data.

    Args:
        entity_type: Entity type name
        format: Export format (json, csv, etc.)
        entity_id: Optional specific entity ID

    Returns:
        Filename string
    """
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")

    if entity_id:
        # Extract simple identifier from URN
        # e.g., urn:ngsi-ld:AirQualityObserved:airquality:3276359 -> airquality_3276359
        parts = entity_id.split(":")
        if len(parts) >= 4:
            simple_id = "_".join(parts[3:])
        else:
            simple_id = entity_id.replace(":", "_")

        return f"{entity_type}_{simple_id}_{timestamp}.{format}"
    else:
        return f"{entity_type}_history_{timestamp}.{format}"
