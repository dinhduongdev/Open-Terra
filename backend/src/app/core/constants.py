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

# Air Quality Entity ID Templates
AIR_QUALITY_ENTITY_ID_TEMPLATE = "urn:ngsi-ld:AirQualityObserved:airquality:{station_id}:latest"
AIR_QUALITY_ID_PATTERN_TEMPLATE = "urn:ngsi-ld:AirQualityObserved:airquality:{station_id}:.*"

# Pre-built patterns for all stations
AIR_QUALITY_ENTITY_IDS = {
    station_id: AIR_QUALITY_ENTITY_ID_TEMPLATE.format(station_id=station_id)
    for station_id in AIR_QUALITY_STATION_IDS
}

AIR_QUALITY_ID_PATTERNS = {
    station_id: AIR_QUALITY_ID_PATTERN_TEMPLATE.format(station_id=station_id)
    for station_id in AIR_QUALITY_STATION_IDS
}

# Combined pattern for querying all stations at once
AIR_QUALITY_ALL_STATIONS_PATTERN = f"urn:ngsi-ld:AirQualityObserved:airquality:({'|'.join(AIR_QUALITY_STATION_IDS)}):.*"

# ===== Helper Functions =====
def get_air_quality_entity_id(station_id: str) -> str:
    """Get the full entity ID for an air quality station."""
    return AIR_QUALITY_ENTITY_ID_TEMPLATE.format(station_id=station_id)

def get_air_quality_id_pattern(station_id: str) -> str:
    """Get the ID pattern for querying temporal data of a specific station."""
    return AIR_QUALITY_ID_PATTERN_TEMPLATE.format(station_id=station_id)
