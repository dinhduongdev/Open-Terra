"""Base converter for NGSI-LD entities."""

from abc import ABC, abstractmethod
from typing import Any

from pydantic import BaseModel


class NGSILDConverter(ABC):
    """Abstract base class for NGSI-LD converters."""

    @abstractmethod
    def get_entity_type(self) -> str:
        """
        Get the entity type name.

        Returns:
            Entity type string (e.g., 'WeatherObserved')
        """
        pass

    @abstractmethod
    def convert(self, entity: BaseModel, entity_id: str) -> dict[str, Any]:
        """
        Convert entity to NGSI-LD format.

        Args:
            entity: Pydantic entity to convert
            entity_id: Unique ID for the entity

        Returns:
            NGSI-LD formatted dictionary
        """
        pass

    def _build_base_entity(self, entity_type: str, entity_id: str) -> dict[str, Any]:
        """
        Build base NGSI-LD entity structure with id, type, and @context.

        Args:
            entity_type: Entity type
            entity_id: Unique ID

        Returns:
            Base NGSI-LD entity dict
        """
        return {
            "id": f"urn:ngsi-ld:{entity_type}:{entity_id}",
            "type": entity_type,
            "@context": [
                "http://context/open-terra-context.jsonld",
            ],
        }

    def _add_property(self, key: str, value: Any, observed_at: str = None, unit_code: str = None) -> dict[str, Any]:
        """Create a Property object.

        Args:
            key: Property name
            value: Property value
            observed_at: Optional observedAt timestamp (ISO 8601)
            unit_code: Optional unit code (e.g., 'CEL' for Celsius, 'MTS' for meters)

        Returns:
            NGSI-LD Property dict
        """
        prop = {"type": "Property", "value": value}

        if observed_at:
            prop["observedAt"] = observed_at

        if unit_code:
            prop["unitCode"] = unit_code

        return prop

    def _add_geo_property(self, location: dict[str, Any]) -> dict[str, Any]:
        """
        Create a GeoProperty object.

        Args:
            location: GeoJSON location dict

        Returns:
            NGSI-LD GeoProperty dict
        """
        return {"type": "GeoProperty", "value": location}

    def _add_relationship(self, ref: str) -> dict[str, Any]:
        """
        Create a Relationship object.

        Args:
            ref: Reference URN

        Returns:
            NGSI-LD Relationship dict
        """
        return {"type": "Relationship", "object": ref}

    def _add_datetime_property(self, value: Any) -> dict[str, Any]:
        """
        Create a DateTime Property object.

        Args:
            value: DateTime value

        Returns:
            NGSI-LD DateTime Property dict
        """
        return {"type": "Property", "value": {"@type": "string", "@value": str(value)}}
