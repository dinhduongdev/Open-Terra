from typing import Any

from pydantic import BaseModel

from app.normalizers.utils import METADATA_FIELDS
from app.publishers.converters.base import NGSILDConverter
from app.schemas.smart_data.air_quality_observed import AirQualityObserved


class AirQualityObservedConverter(NGSILDConverter):
    """Converter for AirQualityObserved entities to NGSI-LD format."""

    # Additional unit mappings for specific air quality fields
    # These complement the PARAMETER_UNIT_MAPPING from utils
    FIELD_UNIT_MAPPING = {
        # Particulate matter (µg/m³)
        "pm1": "GQ",
        "pm25": "GQ",
        "pm10": "GQ",
        # Gases (µg/m³)
        "no": "GQ",
        "no2": "GQ",
        "nox": "GQ",
        "o3": "GQ",
        "so2": "GQ",
        "co": "GQ",
        "c6h6": "GQ",
        "as_": "GQ",
        "cd": "GQ",
        "ni": "GQ",
        "pb": "GQ",
        "sh2": "GQ",
        "co2": "GQ",
        "volatileOrganicCompoundsTotal": "GQ",
        # Meteorological
        "temperature": "CEL",
        "relativeHumidity": "P1",
        "windSpeed": "MTS",
        "windDirection": "DD",
        "precipitation": "MMT",
    }

    def _get_unit_code(self, field_name: str) -> str | None:
        """Get unit code for a field.

        Args:
            field_name: Name of the field

        Returns:
            Unit code or None if not found
        """
        return self.FIELD_UNIT_MAPPING.get(field_name)

    def _should_add_observed_at(self, field_name: str) -> bool:
        """Check if field should have observedAt timestamp.

        Args:
            field_name: Name of the field

        Returns:
            True if field should have observedAt, False otherwise
        """
        return field_name not in METADATA_FIELDS

    def get_entity_type(self) -> str:
        """Get entity type name."""
        return "AirQualityObserved"

    def convert(self, entity: BaseModel, entity_id: str) -> dict[str, Any]:
        """
        Convert AirQualityObserved entity to NGSI-LD format.

        Args:
            entity: AirQualityObserved entity
            entity_id: Unique ID for the entity

        Returns:
            NGSI-LD formatted dictionary
        """
        if not isinstance(entity, AirQualityObserved):
            raise TypeError(f"Expected AirQualityObserved, got {type(entity)}")

        ngsi_ld = self._build_base_entity(self.get_entity_type(), entity_id)

        entity_dict = entity.model_dump(exclude_none=True, mode="json")

        observed_at = str(entity_dict.get("dateObserved", ""))

        # Handle location as GeoProperty
        if "location" in entity_dict:
            ngsi_ld["location"] = self._add_geo_property(entity_dict.pop("location"))

        # Handle relationships
        relationship_fields = ["refDevice", "refPointOfInterest", "refWeatherObserved"]
        for field in relationship_fields:
            if field in entity_dict:
                ngsi_ld[field] = self._add_relationship(entity_dict.pop(field))

        # Handle datetime fields
        datetime_fields = ["dateObserved"]
        for field in datetime_fields:
            if field in entity_dict:
                ngsi_ld[field] = self._add_datetime_property(entity_dict.pop(field))

        # Convert remaining fields to NGSI-LD properties
        for key, value in entity_dict.items():
            if key not in ["type", "id"]:
                unit_code = self._get_unit_code(key)
                should_observe = self._should_add_observed_at(key)

                ngsi_ld[key] = self._add_property(
                    key, value, observed_at=observed_at if should_observe else None, unit_code=unit_code
                )

        return ngsi_ld
