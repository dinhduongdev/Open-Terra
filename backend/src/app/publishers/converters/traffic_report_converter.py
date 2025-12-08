"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

"""Converter for TrafficFlowObserved entities from user reports."""

from typing import Any

from pydantic import BaseModel

from app.models.report import TrafficReport
from app.publishers.converters.base import NGSILDConverter
from app.schemas.smart_data.traffic_flow_observed import Address


class TrafficReportConverter(NGSILDConverter):
    """Converter for TrafficReport to TrafficFlowObserved NGSI-LD format."""

    def get_entity_type(self) -> str:
        """Get entity type name."""
        return "TrafficFlowObserved"

    def get_context_url(self) -> str:
        """Get Transportation domain context URL."""
        return "https://raw.githubusercontent.com/smart-data-models/dataModel.Transportation/refs/heads/master/context.jsonld"

    def convert(self, entity: BaseModel, entity_id: str) -> dict[str, Any]:
        """
        Convert TrafficReport to TrafficFlowObserved NGSI-LD format.

        Args:
            entity: TrafficReport entity
            entity_id: Unique ID for the entity

        Returns:
            NGSI-LD formatted dictionary
        """
        if not isinstance(entity, TrafficReport):
            raise TypeError(f"Expected TrafficReport, got {type(entity)}")

        ngsi_ld = self._build_base_entity(self.get_entity_type(), entity_id)

        # Create GeoJSON Point for location
        location = {"type": "Point", "coordinates": [entity.longitude, entity.latitude]}
        ngsi_ld["location"] = self._add_geo_property(location)

        # Add address using standard Address schema
        if entity.street_name:
            address_data = Address(streetAddress=entity.street_name)
            ngsi_ld["address"] = self._add_property("address", address_data.model_dump(exclude_none=True))

        # Add temporal information
        # Format datetime to ISO 8601 with timezone
        observed_at = (
            entity.created_at.isoformat() if hasattr(entity.created_at, "isoformat") else str(entity.created_at)
        )
        ngsi_ld["dateObserved"] = self._add_datetime_property(entity.created_at)
        ngsi_ld["dateCreated"] = self._add_datetime_property(entity.created_at)

        if entity.updated_at:
            ngsi_ld["dateModified"] = self._add_datetime_property(entity.updated_at)

        # Add description
        if entity.description:
            ngsi_ld["description"] = self._add_property("description", entity.description, observed_at=observed_at)

        # Map severity to congested flag and description
        # High severity = congested, otherwise not congested
        severity_value = entity.severity.value if hasattr(entity.severity, "value") else entity.severity
        ngsi_ld["congested"] = self._add_property("congested", severity_value == "High", observed_at=observed_at)

        # Add custom properties for user report data
        # Reporter information
        ngsi_ld["reportedBy"] = self._add_property("reportedBy", entity.reporter_username)

        # Severity level
        ngsi_ld["severityLevel"] = self._add_property("severityLevel", severity_value, observed_at=observed_at)

        # Add photo URLs if available
        if entity.photo_urls:
            ngsi_ld["imageUrls"] = self._add_property("imageUrls", entity.photo_urls, observed_at=observed_at)

        # Add metadata
        ngsi_ld["dataProvider"] = self._add_property("dataProvider", "Open-Terra User Reports")
        ngsi_ld["source"] = self._add_property("source", "user-generated-report")

        return ngsi_ld
