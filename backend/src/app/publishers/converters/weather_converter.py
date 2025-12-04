"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

"""Converter for WeatherObserved entities."""

from typing import Any

from pydantic import BaseModel

from src.app.publishers.converters.base import NGSILDConverter
from src.app.schemas.smart_data.weather_observed import WeatherObserved


class WeatherObservedConverter(NGSILDConverter):
    """Converter for WeatherObserved entities to NGSI-LD format."""

    def get_entity_type(self) -> str:
        """Get entity type name."""
        return "WeatherObserved"

    def get_context_url(self) -> str:
        """Get Weather domain context URL."""
        return "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/refs/heads/master/context.jsonld"

    def convert(self, entity: BaseModel, entity_id: str) -> dict[str, Any]:
        """
        Convert WeatherObserved entity to NGSI-LD format.

        Args:
            entity: WeatherObserved entity
            entity_id: Unique ID for the entity

        Returns:
            NGSI-LD formatted dictionary
        """
        if not isinstance(entity, WeatherObserved):
            raise TypeError(f"Expected WeatherObserved, got {type(entity)}")

        ngsi_ld = self._build_base_entity(self.get_entity_type(), entity_id)

        entity_dict = entity.model_dump(exclude_none=True, mode="json")

        observed_at = str(entity_dict.get("dateObserved", ""))

        if "location" in entity_dict:
            ngsi_ld["location"] = self._add_geo_property(entity_dict.pop("location"))

        relationship_fields = ["refDevice", "refPointOfInterest"]
        for field in relationship_fields:
            if field in entity_dict:
                ngsi_ld[field] = self._add_relationship(entity_dict.pop(field))

        datetime_fields = ["dateObserved"]
        for field in datetime_fields:
            if field in entity_dict:
                ngsi_ld[field] = self._add_datetime_property(entity_dict.pop(field))

        property_units = {
            "temperature": "CEL",  # Celsius
            "feelsLikeTemperature": "CEL",
            "dewPoint": "CEL",
            "atmosphericPressure": "A97",  # Hectopascal (hPa)
            "windSpeed": "MTS",  # Meters per second
            "gustSpeed": "MTS",
            "windDirection": "DD",  # Degree (angle)
            "visibility": "MTR",  # Meters
            "precipitation": "MMT",  # Millimeters
            "snowHeight": "CMT",  # Centimeters
            "streamGauge": "CMT",
            "illuminance": "LUX",  # Lux
            "solarRadiation": "N96",  # W/m²
            "diffuseIrradiation": "N96",
            "directIrradiation": "N96",
        }

        for key, value in entity_dict.items():
            if key not in ["type", "id"]:
                unit_code = property_units.get(key)
                ngsi_ld[key] = self._add_property(
                    key,
                    value,
                    observed_at=observed_at
                    if key not in ["name", "source", "areaServed", "address", "description"]
                    else None,
                    unit_code=unit_code,
                )

        return ngsi_ld
