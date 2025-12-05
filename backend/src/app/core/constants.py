"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

"""
Core constants for the application.
Contains entity ID patterns, station IDs, and other configuration values.
"""

# ===== Weather Station Configuration =====
WEATHER_STATION_ID = "hcm"
WEATHER_ENTITY_ID = f"urn:ngsi-ld:WeatherObserved:weather:{WEATHER_STATION_ID}:latest"
WEATHER_ID_PATTERN = f"urn:ngsi-ld:WeatherObserved:weather:{WEATHER_STATION_ID}:.*"

# ===== Air Quality Station Configuration =====
AIR_QUALITY_STATION_IDS = ["3276359", "6068138"]

# Air Quality Entity ID Template
AIR_QUALITY_ENTITY_ID_TEMPLATE = "urn:ngsi-ld:AirQualityObserved:airquality:{station_id}:latest"

# Pre-built entity IDs for all stations
AIR_QUALITY_ENTITY_IDS = {
    station_id: AIR_QUALITY_ENTITY_ID_TEMPLATE.format(station_id=station_id)
    for station_id in AIR_QUALITY_STATION_IDS
}

# ===== Helper Functions =====
def get_air_quality_entity_id(station_id: str) -> str:
    """Get the full entity ID for an air quality station."""
    return AIR_QUALITY_ENTITY_ID_TEMPLATE.format(station_id=station_id)
