"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

"""Weather data normalizer for converting OpenWeatherMap data to NGSI-LD WeatherObserved format."""

import logging
from typing import Any

from app.schemas.smart_data.weather_observed import WeatherObserved

logger = logging.getLogger(__name__)


class WeatherNormalizer:
    """Normalize weather data from OpenWeatherMap to WeatherObserved schema."""

    @staticmethod
    def normalize(
        raw_data: dict[str, Any], location_name: str = "Ho Chi Minh City", country: str = "Vietnam"
    ) -> WeatherObserved:
        """
        Normalize OpenWeatherMap parsed data to WeatherObserved format.

        Args:
            raw_data: Parsed weather data from OpenWeatherMap client
            location_name: Name of the location (default: Ho Chi Minh City)
            country: Country name (default: Vietnam)

        Returns:
            WeatherObserved object with normalized data
        """
        try:
            # OpenWeatherMapClient already parses the data, use it directly
            # Convert humidity from percentage (0-100) to ratio (0-1)
            humidity = raw_data.get("humidity")
            relative_humidity = humidity / 100.0 if humidity is not None else None

            normalized_data = {
                "type": "WeatherObserved",
                "name": location_name,
                "dateObserved": raw_data.get("dateObserved"),
                "location": raw_data.get("location"),
                "temperature": raw_data.get("temperature"),
                "feelsLikeTemperature": raw_data.get("feelsLike"),
                "dewPoint": raw_data.get("dewPoint"),
                "relativeHumidity": relative_humidity,
                "atmosphericPressure": raw_data.get("pressure"),
                "windSpeed": raw_data.get("windSpeed"),
                "windDirection": raw_data.get("windDirection"),
                "gustSpeed": raw_data.get("windGust"),
                "weatherType": raw_data.get("weatherType"),
                "visibility": raw_data.get("visibility"),
                "precipitation": raw_data.get("precipitation"),
                "uVIndexMax": raw_data.get("uvi"),
                "source": raw_data.get("source", "OpenWeatherMap"),
                "areaServed": location_name,
                "description": raw_data.get("weatherDescription", ""),
                "address": {
                    "addressCountry": country,
                    "addressLocality": location_name,
                },
            }

            logger.info(f"Successfully normalized weather data for {location_name}")
            return WeatherObserved(**normalized_data)

        except Exception as e:
            logger.error(f"Error normalizing weather data: {e}", exc_info=True)
            raise


weather_normalizer = WeatherNormalizer()
