"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

"""
OpenAQ API Client
Documentation: https://docs.openaq.org/
API v3: https://api.openaq.org/v3/
"""

import logging
from datetime import datetime
from typing import Any, Optional

import httpx

from src.app.core.config import settings

logger = logging.getLogger(__name__)


class OpenAQClient:
    """Client for OpenAQ API v3"""

    def __init__(self, api_key: Optional[str] = None, base_url: Optional[str] = None) -> None:
        """
        Initialize OpenAQ client

        Args:
            api_key: Optional API key for higher rate limits
            base_url: Optional base URL for the API
        """
        self.api_key = api_key or settings.OPEN_AQ_API_KEY
        self.headers = {}
        if self.api_key:
            self.headers["X-API-Key"] = self.api_key
        self.base_url = base_url or settings.OPEN_AQ_BASE_URL

    async def get_latest_measurements(
        self,
        coordinates: Optional[tuple[float, float]] = None,
        radius: int = 12000,  # meters (default 12km)
        country: Optional[str] = None,
        city: Optional[str] = None,
        location_id: Optional[int] = None,
        parameter: Optional[list[str]] = None,  # pm25, pm10, o3, no2, so2, co
        limit: int = 100,
    ) -> dict[str, Any]:
        """
        Get latest air quality measurements

        If location_id is provided, directly fetches from that location.
        Otherwise, uses 2-step process:
        1. Find locations using coordinates/country/city
        2. Get latest measurements for each location

        Args:
            coordinates: Tuple of (latitude, longitude) for geospatial search
            radius: Search radius in meters (max 100000)
            country: ISO 3166-1 alpha-2 country code (e.g., "VN" for Vietnam)
            city: City name
            location_id: Specific location ID (if provided, skips location search)
            parameter: list of parameters to fetch (e.g., ["pm25", "pm10"])
            limit: Number of results (max 1000)

        Returns:
            API response with measurements
        """
        # If location_id is provided, fetch directly
        if location_id is not None:
            url = f"{self.base_url}/locations/{location_id}/latest"

            try:
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.get(url, headers=self.headers)
                    response.raise_for_status()
                    return response.json()
            except httpx.HTTPError as e:
                logger.error(f"OpenAQ API error for location {location_id}: {e}")
                raise

        # Step 1: Find locations
        # OpenAQ v3 has issues with coordinates parameter, fallback to country if provided
        try:
            locations_response = await self.search_locations(
                coordinates=coordinates, radius=radius, country=country, city=city, limit=limit
            )
        except Exception as e:
            logger.warning(f"Coordinates search failed, falling back to country/city: {e}")
            # Fallback: if coordinates fail, try country only
            if country or city:
                locations_response = await self.search_locations(
                    coordinates=None, country=country, city=city, limit=limit
                )
            else:
                raise

        if not locations_response.get("results"):
            return {"meta": {"found": 0}, "results": []}

        # Step 2: Get latest measurements for each location
        all_results = []

        for location in locations_response["results"]:
            loc_id = location["id"]

            try:
                # Get latest for this location
                url = f"{self.base_url}/locations/{loc_id}/latest"

                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.get(url, headers=self.headers)
                    response.raise_for_status()
                    latest_data = response.json()

                    # Add location info to each measurement
                    for measurement in latest_data.get("results", []):
                        measurement["location"] = {
                            "id": location["id"],
                            "name": location.get("name"),
                            "country": location.get("country"),
                            "city": location.get("locality"),
                        }
                        all_results.append(measurement)

            except Exception as e:
                logger.warning(f"Failed to get latest for location {loc_id}: {e}")
                continue

        return {
            "meta": {"found": len(all_results), "locations_found": len(locations_response["results"])},
            "results": all_results,
        }

    async def get_location_by_id(self, location_id: int) -> dict[str, Any]:
        """
        Get specific location details

        Args:
            location_id: OpenAQ location ID

        Returns:
            Location details
        """
        url = f"{self.base_url}/locations/{location_id}"

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, headers=self.headers)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"OpenAQ API error: {e}")
            raise

    async def get_locations_by_bbox(
        self,
        bbox: str,
        limit: int = 1000,
    ) -> dict[str, Any]:
        """
        Get air quality monitoring locations within a bounding box

        Args:
            bbox: Bounding box in format "min_lon,min_lat,max_lon,max_lat"
                  Example: "106.358004,10.376182,106.977358,11.164050"
            limit: Number of results (max 1000)

        Returns:
            API response with locations
        """
        url = f"{self.base_url}/locations"

        params = {
            "bbox": bbox,
            "limit": limit,
        }

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params, headers=self.headers)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"OpenAQ API error: {e}")
            raise

    async def search_locations(
        self,
        coordinates: Optional[tuple[float, float]] = None,
        radius: int = 25000,
        country: Optional[str] = None,
        city: Optional[str] = None,
        limit: int = 100,
    ) -> dict[str, Any]:
        """
        Search for air quality monitoring locations

        Args:
            coordinates: Tuple of (latitude, longitude)
            radius: Search radius in meters
            country: ISO 3166-1 alpha-2 country code
            city: City name
            limit: Number of results

        Returns:
            API response with locations
        """
        url = f"{self.base_url}/locations"

        params = {
            "limit": limit,
        }

        # Priority: coordinates > country/city
        # OpenAQ API doesn't allow mixing coordinates with country
        if coordinates:
            # OpenAQ API v3 expects longitude,latitude (GeoJSON format)
            latitude, longitude = coordinates
            params["coordinates"] = f"{longitude},{latitude}"
            params["radius"] = radius
        else:
            # Only use country/city if no coordinates
            if country:
                params["country"] = country
            if city:
                params["city"] = city

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params, headers=self.headers)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"OpenAQ API error: {e}")
            raise

    async def get_measurements(
        self,
        location_id: int,
        parameter: Optional[list[str]] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None,
        limit: int = 100,
    ) -> dict[str, Any]:
        """
        Get historical measurements for a location

        Args:
            location_id: OpenAQ location ID
            parameter: list of parameters (e.g., ["pm25", "pm10"])
            date_from: Start date
            date_to: End date
            limit: Number of results (max 1000)

        Returns:
            API response with measurements
        """
        url = f"{self.base_url}/measurements"

        params = {"location_id": location_id, "limit": limit, "sort": "desc", "order_by": "datetime"}

        if parameter:
            params["parameter"] = ",".join(parameter)

        if date_from:
            params["date_from"] = date_from.isoformat()

        if date_to:
            params["date_to"] = date_to.isoformat()

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, params=params, headers=self.headers)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            logger.error(f"OpenAQ API error: {e}")
            raise

    def calculate_aqi_us(self, pollutant: str, concentration: float) -> Optional[float]:
        """
        Calculate US EPA Air Quality Index

        Args:
            pollutant: Pollutant name (pm25, pm10, o3, no2, so2, co)
            concentration: Concentration value

        Returns:
            AQI value (0-500)
        """
        # US EPA AQI Breakpoints
        # Format: (C_low, C_high, I_low, I_high)

        if pollutant == "pm25":  # µg/m³, 24-hour average
            breakpoints = [
                (0.0, 12.0, 0, 50),
                (12.1, 35.4, 51, 100),
                (35.5, 55.4, 101, 150),
                (55.5, 150.4, 151, 200),
                (150.5, 250.4, 201, 300),
                (250.5, 500.4, 301, 500),
            ]
        elif pollutant == "pm10":  # µg/m³, 24-hour average
            breakpoints = [
                (0, 54, 0, 50),
                (55, 154, 51, 100),
                (155, 254, 101, 150),
                (255, 354, 151, 200),
                (355, 424, 201, 300),
                (425, 604, 301, 500),
            ]
        elif pollutant == "o3":  # ppm, 8-hour average
            breakpoints = [
                (0.000, 0.054, 0, 50),
                (0.055, 0.070, 51, 100),
                (0.071, 0.085, 101, 150),
                (0.086, 0.105, 151, 200),
                (0.106, 0.200, 201, 300),
            ]
        elif pollutant == "no2":  # ppb, 1-hour average
            breakpoints = [
                (0, 53, 0, 50),
                (54, 100, 51, 100),
                (101, 360, 101, 150),
                (361, 649, 151, 200),
                (650, 1249, 201, 300),
                (1250, 2049, 301, 500),
            ]
        elif pollutant == "so2":  # ppb, 1-hour average
            breakpoints = [
                (0, 35, 0, 50),
                (36, 75, 51, 100),
                (76, 185, 101, 150),
                (186, 304, 151, 200),
                (305, 604, 201, 300),
                (605, 1004, 301, 500),
            ]
        elif pollutant == "co":  # ppm, 8-hour average
            breakpoints = [
                (0.0, 4.4, 0, 50),
                (4.5, 9.4, 51, 100),
                (9.5, 12.4, 101, 150),
                (12.5, 15.4, 151, 200),
                (15.5, 30.4, 201, 300),
                (30.5, 50.4, 301, 500),
            ]
        else:
            return None

        # Find the appropriate breakpoint
        for c_low, c_high, i_low, i_high in breakpoints:
            if c_low <= concentration <= c_high:
                # Linear interpolation formula
                aqi = ((i_high - i_low) / (c_high - c_low)) * (concentration - c_low) + i_low
                return round(aqi)

        # If concentration exceeds all breakpoints
        if concentration > breakpoints[-1][1]:
            return 500  # Hazardous

        return None

    def get_aqi_level(self, aqi: float) -> str:
        """
        Get AQI level description

        Args:
            aqi: AQI value

        Returns:
            Level description
        """
        if aqi <= 50:
            return "good"
        elif aqi <= 100:
            return "moderate"
        elif aqi <= 150:
            return "unhealthyForSensitiveGroups"
        elif aqi <= 200:
            return "unhealthy"
        elif aqi <= 300:
            return "veryUnhealthy"
        else:
            return "hazardous"
