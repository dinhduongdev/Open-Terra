"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import logging
from datetime import UTC, datetime
from typing import Any, Optional

from app.normalizers.utils import POLLUTANT_MAPPING
from app.schemas.smart_data.air_quality_observed import AirQualityObserved
from app.services.openaq_client import OpenAQClient

logger = logging.getLogger(__name__)


class AirQualityNormalizer:
    """Normalize air quality data from OpenAQ to AirQualityObserved schema."""

    # Maximum age in days for a location to be considered active
    MAX_LOCATION_AGE_DAYS = 7

    def __init__(self):
        self.openaq_client = OpenAQClient()

    @staticmethod
    def _extract_location_info(
        raw_data: dict[str, Any], location_name: Optional[str] = None, country: Optional[str] = None
    ) -> dict[str, str]:
        """
        Extract location metadata from OpenAQ data.

        Args:
            raw_data: Raw data from OpenAQ API
            location_name: Optional override for location name
            country: Optional override for country

        Returns:
            Dict with name, country, city keys
        """
        location_info = raw_data.get("location", {})
        country_info = raw_data.get("country", {})

        return {
            "name": location_name or location_info.get("name") or raw_data.get("name", "Unknown"),
            "country": country or country_info.get("name") or location_info.get("country", "Unknown"),
            "city": raw_data.get("locality") or location_info.get("city", ""),
        }

    @staticmethod
    def _extract_coordinates(raw_data: dict[str, Any]) -> Optional[dict[str, Any]]:
        """
        Extract and build GeoJSON Point from coordinates.

        Args:
            raw_data: Raw data from OpenAQ API

        Returns:
            GeoJSON Point dict or None if coordinates missing
        """
        coordinates = raw_data.get("coordinates", {})
        latitude = coordinates.get("latitude")
        longitude = coordinates.get("longitude")

        if latitude is not None and longitude is not None:
            return {"type": "Point", "coordinates": [longitude, latitude]}

        return None

    @staticmethod
    def _parse_datetime(datetime_obj: Optional[dict[str, str]]) -> Optional[datetime]:
        """
        Parse datetime from OpenAQ format.

        Args:
            datetime_obj: Dict with 'utc' or 'local' keys

        Returns:
            Parsed datetime or None
        """
        if not datetime_obj:
            return None

        utc_time = datetime_obj.get("utc")
        if utc_time:
            return datetime.fromisoformat(utc_time.replace("Z", "+00:00"))

        return None

    @staticmethod
    def _map_pollutant(parameter_name: str, value: Any) -> Optional[tuple[str, float]]:
        """
        Map OpenAQ parameter name to schema field and normalize value.

        Args:
            parameter_name: Parameter name from OpenAQ (e.g., 'pm25', 'o3')
            value: Parameter value

        Returns:
            Tuple of (field_name, float_value) or None if not mappable
        """
        param_name = parameter_name.lower()
        field_name = POLLUTANT_MAPPING.get(param_name)

        if field_name and value is not None:
            try:
                float_value = float(value)

                # Convert relativeHumidity from percentage (0-100) to fraction (0-1)
                if field_name == "relativeHumidity":
                    # OpenAQ returns humidity as percentage (0-100)
                    # Schema expects fraction (0-1)
                    if float_value > 1:
                        float_value = float_value / 100.0

                return (field_name, float_value)
            except (ValueError, TypeError):
                logger.warning(f"Could not convert {param_name} value to float: {value}")
                return None

        return None

    @staticmethod
    def _is_location_active(location_data: dict[str, Any], max_age_days: int = MAX_LOCATION_AGE_DAYS) -> bool:
        """
        Check if a location has recent data.

        Args:
            location_data: Location data from OpenAQ API
            max_age_days: Maximum age in days for location to be considered active

        Returns:
            True if location has recent data, False otherwise
        """
        datetime_last = location_data.get("datetimeLast")
        if not datetime_last:
            return False

        try:
            last_update = AirQualityNormalizer._parse_datetime(datetime_last)
            if not last_update:
                return False

            age = datetime.now(UTC) - last_update
            return age.days <= max_age_days

        except Exception as e:
            logger.warning(f"Error checking location activity: {e}")
            return False

    def normalize(
        self,
        raw_data: dict[str, Any],
        location_name: Optional[str] = None,
        country: Optional[str] = None,
    ) -> AirQualityObserved:
        """
        Normalize OpenAQ measurement data to AirQualityObserved format.

        Args:
            raw_data: Raw measurement data from OpenAQ API (single measurement result)
            location_name: Optional location name override
            country: Optional country name override

        Returns:
            AirQualityObserved object with normalized data
        """
        try:
            # Extract location info
            loc_info = self._extract_location_info(raw_data, location_name, country)

            # Extract coordinates
            location = self._extract_coordinates(raw_data)

            # Extract datetime
            date_observed = self._parse_datetime(raw_data.get("date"))

            # Extract and map pollutant parameter
            parameter = raw_data.get("parameter", {})
            param_name = parameter.get("name", "").lower()
            param_value = raw_data.get("value")

            pollutants = {}
            mapped = self._map_pollutant(param_name, param_value)
            if mapped:
                field_name, value = mapped
                pollutants[field_name] = value

            # Calculate AQI for the parameter if available
            air_quality_index = None
            air_quality_level = None
            if param_name and param_value is not None:
                aqi = self.openaq_client.calculate_aqi_us(param_name, float(param_value))
                if aqi is not None:
                    air_quality_index = float(aqi)
                    air_quality_level = self.openaq_client.get_aqi_level(aqi)

            # Build normalized data
            normalized_data = {
                "type": "AirQualityObserved",
                "name": loc_info["name"],
                "dateObserved": date_observed,
                "location": location,
                "source": "OpenAQ",
                "areaServed": loc_info["city"] or loc_info["name"],
                "address": {
                    "addressCountry": loc_info["country"],
                    "addressLocality": loc_info["city"] or loc_info["name"],
                },
                **pollutants,
            }

            # Add AQI if calculated
            if air_quality_index is not None:
                normalized_data["airQualityIndex"] = air_quality_index
            if air_quality_level is not None:
                normalized_data["airQualityLevel"] = air_quality_level

            logger.info(f"Successfully normalized air quality data for {loc_info['name']} ({param_name})")
            return AirQualityObserved(**normalized_data)

        except Exception as e:
            logger.error(f"Error normalizing air quality data: {e}", exc_info=True)
            raise

    def normalize_multiple(
        self,
        measurements: list[dict[str, Any]],
        location_name: Optional[str] = None,
        country: Optional[str] = None,
        location_data: Optional[dict[str, Any]] = None,
    ) -> AirQualityObserved:
        """
        Normalize multiple measurements from the same location into a single AirQualityObserved entity.

        Args:
            measurements: List of measurement results from OpenAQ API (enriched with parameter info)
            location_name: Optional location name override
            country: Optional country name override
            location_data: Optional full location details from /locations/{id} endpoint

        Returns:
            AirQualityObserved object with all available pollutant data
        """
        try:
            if not measurements:
                raise ValueError("No measurements provided")

            # Use location_data if provided, otherwise use first measurement
            metadata_source = location_data if location_data else measurements[0]
            loc_info = self._extract_location_info(metadata_source, location_name, country)

            # Extract coordinates from location_data or first measurement
            location = self._extract_coordinates(metadata_source)

            # Use the most recent observation time from measurements
            date_observed = self._parse_datetime(measurements[0].get("date"))

            # Aggregate all pollutants
            pollutants = {}
            aqi_values = []

            for measurement in measurements:
                parameter = measurement.get("parameter", {})
                param_name = parameter.get("name", "").lower()
                param_value = measurement.get("value")

                # Map pollutant to schema field
                mapped = self._map_pollutant(param_name, param_value)
                if mapped:
                    field_name, value = mapped
                    pollutants[field_name] = value

                    # Calculate AQI for this parameter
                    aqi = self.openaq_client.calculate_aqi_us(param_name, value)
                    if aqi is not None:
                        aqi_values.append(aqi)

            # Overall AQI is the maximum of all parameter AQIs
            air_quality_index = None
            air_quality_level = None
            if aqi_values:
                air_quality_index = float(max(aqi_values))
                air_quality_level = self.openaq_client.get_aqi_level(air_quality_index)

            # Build normalized data
            normalized_data = {
                "type": "AirQualityObserved",
                "name": loc_info["name"],
                "dateObserved": date_observed,
                "location": location,
                "source": "OpenAQ",
                "areaServed": loc_info["city"] or loc_info["name"],
                "address": {
                    "addressCountry": loc_info["country"],
                    "addressLocality": loc_info["city"] or loc_info["name"],
                },
                **pollutants,
            }

            # Add AQI if calculated
            if air_quality_index is not None:
                normalized_data["airQualityIndex"] = air_quality_index
            if air_quality_level is not None:
                normalized_data["airQualityLevel"] = air_quality_level

            logger.info(
                f"Successfully normalized {len(measurements)} measurements for {loc_info['name']} "
                f"(pollutants: {list(pollutants.keys())})"
            )
            return AirQualityObserved(**normalized_data)

        except Exception as e:
            logger.error(f"Error normalizing multiple measurements: {e}", exc_info=True)
            raise


air_quality_normalizer = AirQualityNormalizer()
