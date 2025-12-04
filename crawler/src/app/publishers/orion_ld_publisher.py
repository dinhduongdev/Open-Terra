"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

"""Orion-LD Context Broker publisher for NGSI-LD entities."""

import logging
from typing import Any

import requests
from pydantic import BaseModel

from src.app.core.config import settings
from src.app.publishers.converters.air_quality_converter import AirQualityObservedConverter
from src.app.publishers.converters.base import NGSILDConverter
from src.app.publishers.converters.weather_converter import WeatherObservedConverter

logger = logging.getLogger(__name__)


CONVERTERS: dict[str, NGSILDConverter] = {
    "WeatherObserved": WeatherObservedConverter(),
    "AirQualityObserved": AirQualityObservedConverter(),
    # Add more converters here as needed
}


class OrionLDPublisher:
    """Publisher for sending NGSI-LD entities to Orion Context Broker."""

    def __init__(self, base_url: str | None = None):
        """
        Initialize Orion-LD publisher.

        Args:
            base_url: Base URL of Orion-LD Context Broker
        """
        self.base_url = base_url or settings.ORION_LD_BASE_URL
        self.entities_endpoint = f"{self.base_url}/ngsi-ld/v1/entities"
        self.headers = {
            "Content-Type": "application/ld+json",
        }

    def _convert_to_ngsi_ld(self, entity: BaseModel, entity_id: str, entity_type: str | None = None) -> dict[str, Any]:
        """
        Convert Pydantic model to NGSI-LD format using appropriate converter.

        Args:
            entity: Pydantic entity to convert
            entity_id: Unique ID for the entity
            entity_type: Entity type (e.g., 'WeatherObserved'). If None, extracted from entity

        Returns:
            NGSI-LD formatted dictionary

        Raises:
            ValueError: If entity type is not found or no converter is registered
        """
        if entity_type is None:
            entity_type = getattr(entity, "type", None)
            if entity_type is None:
                raise ValueError("Entity type must be provided or entity must have 'type' attribute")
            if hasattr(entity_type, "value"):
                entity_type = entity_type.value

        converter = CONVERTERS.get(entity_type)
        if converter is None:
            raise ValueError(
                f"No converter registered for entity type '{entity_type}'. Available types: {list(CONVERTERS.keys())}"
            )

        # Use converter to transform entity
        return converter.convert(entity, entity_id)

    def _entity_exists(self, entity_urn: str) -> bool:
        """
        Check if entity exists in Orion Context Broker.

        Args:
            entity_urn: URN of the entity to check

        Returns:
            True if entity exists, False otherwise
        """
        try:
            entity_url = f"{self.entities_endpoint}/{entity_urn}"
            response = requests.get(entity_url, headers=self.headers, timeout=10)
            return response.status_code == 200
        except requests.RequestException as e:
            logger.warning(f"Error checking entity existence: {e}")
            return False

    def _create_entity(self, ngsi_ld_data: dict[str, Any]) -> requests.Response:
        """
        Create a new entity in Orion Context Broker.

        Args:
            ngsi_ld_data: NGSI-LD formatted entity data

        Returns:
            Response from the POST request

        Raises:
            requests.RequestException: If creation fails
        """
        entity_urn = ngsi_ld_data["id"]
        logger.info(f"Creating new entity: {entity_urn}")

        response = requests.post(self.entities_endpoint, json=ngsi_ld_data, headers=self.headers, timeout=10)
        response.raise_for_status()
        logger.info(f"Successfully created entity {entity_urn}")
        return response

    def _update_entity(self, entity_urn: str, ngsi_ld_data: dict[str, Any]) -> requests.Response:
        """
        Update an existing entity in Orion Context Broker.

        Args:
            entity_urn: URN of the entity to update
            ngsi_ld_data: NGSI-LD formatted entity data

        Returns:
            Response from the PATCH request

        Raises:
            requests.RequestException: If update fails
        """
        logger.info(f"Updating existing entity: {entity_urn}")

        update_url = f"{self.entities_endpoint}/{entity_urn}/attrs"
        update_data = {k: v for k, v in ngsi_ld_data.items() if k not in ["id", "type"]}

        response = requests.patch(update_url, json=update_data, headers=self.headers, timeout=10)
        response.raise_for_status()
        logger.info(f"Successfully updated entity {entity_urn}")
        return response

    def publish(self, entity: BaseModel, entity_id: str, entity_type: str | None = None) -> dict[str, Any]:
        """
        Publish NGSI-LD entity to Orion Context Broker.

        Checks if entity exists first:
        - If not exists: creates new entity (POST)
        - If exists: updates existing entity (PATCH)

        Args:
            entity: Pydantic entity to publish (e.g., WeatherObserved, AirQualityObserved)
            entity_id: Unique ID for the entity
            entity_type: Optional entity type override

        Returns:
            Response data from Orion-LD

        Raises:
            requests.RequestException: If publish fails
        """
        try:
            ngsi_ld_data = self._convert_to_ngsi_ld(entity, entity_id, entity_type)
            entity_urn = ngsi_ld_data["id"]

            logger.info(f"Publishing entity to Orion-LD: {entity_urn}")

            # Check if entity exists first
            entity_exists = self._entity_exists(entity_urn)

            if entity_exists:
                # Update existing entity
                response = self._update_entity(entity_urn, ngsi_ld_data)
            else:
                # Create new entity
                response = self._create_entity(ngsi_ld_data)

            return {
                "status": "success",
                "entity_id": entity_urn,
                "status_code": response.status_code,
                "operation": "update" if entity_exists else "create",
            }

        except requests.RequestException as e:
            logger.error(f"Failed to publish entity to Orion-LD: {e}", exc_info=True)
            return {"status": "error", "error": str(e)}
        except Exception as e:
            logger.error(f"Unexpected error publishing to Orion-LD: {e}", exc_info=True)
            return {"status": "error", "error": str(e)}


orion_ld_publisher = OrionLDPublisher()
