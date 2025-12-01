import logging
from datetime import UTC, datetime
from typing import Optional

import requests

from src.app.core.config import settings

logger = logging.getLogger(__name__)


class OpenWeatherMapClient:
    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None):
        self.api_key = api_key or settings.OPENWEATHERMAP_API_KEY
        self.base_url = base_url or settings.OPENWEATHERMAP_BASE_URL
        if not self.api_key:
            raise ValueError("OpenWeatherMap API key must be provided.")

    def get_current_weather(
        self,
        lat: float,
        lon: float,
        units: str = "metric",
        lang: str = "vi",
    ) -> dict:
        url = f"{self.base_url}"
        params = {
            "lat": lat,
            "lon": lon,
            "units": units,
            "lang": lang,
            "exclude": "minutely,hourly,daily,alerts",
            "appid": self.api_key,
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            logger.info(f"OpenWeatherMap response data: {data}")
            logger.info(f"Type of response data: {type(data)}")
            logger.info(f"Successfully fetched current weather data for lat: {lat}, lon: {lon}")
            logger.info(f"Response after parsing : {self._parse_current_weather(data)}", extra={"pretty": True})
            return self._parse_current_weather(data)
        except requests.RequestException as e:
            logger.error(f"Error fetching current weather data: {e}")
            raise

    def _parse_current_weather(self, data: dict) -> dict:
        """Parse OpenWeatherMap API response to normalized format.

        Args:
            data: Raw API response from OpenWeatherMap

        Returns:
            Normalized weather data dictionary
        """
        weather_curr = data["current"]
        weather = weather_curr["weather"][0]

        weather_id = weather.get("id", 0)

        return {
            "name": data.get("timezone", "Unknown Location"),
            "location": {"type": "Point", "coordinates": [data.get("lon"), data.get("lat")]},
            "dateObserved": datetime.fromtimestamp(weather_curr.get("dt", 0), tz=UTC).isoformat(),
            "temperature": weather_curr.get("temp"),
            "feelsLike": weather_curr.get("feels_like"),
            "dewPoint": weather_curr.get("dew_point"),
            "humidity": weather_curr.get("humidity"),
            "pressure": weather_curr.get("pressure"),
            "windSpeed": weather_curr.get("wind_speed"),
            "windDirection": weather_curr.get("wind_deg"),
            "windGust": weather_curr.get("wind_gust"),
            "weatherType": weather.get("description", ""),
            "weatherId": weather_id,
            "visibility": weather_curr.get("visibility"),
            "cloudiness": weather_curr.get("clouds"),
            "precipitation": weather_curr.get("rain", {}).get("1h", 0) if "rain" in weather_curr else 0,
            "uvi": weather_curr.get("uvi"),
            "source": "OpenWeatherMap",
        }


open_weather_map_client = OpenWeatherMapClient()
