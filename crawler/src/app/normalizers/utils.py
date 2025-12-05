"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import re

# ============================================================================
# Air Quality Parameter Mappings
# ============================================================================

# OpenAQ parameter names to NGSI-LD AirQualityObserved schema field mapping
POLLUTANT_MAPPING: dict[str, str] = {
    "pm1": "pm1",
    "pm25": "pm25",
    "pm10": "pm10",
    "o3": "o3",
    "no": "no",
    "no2": "no2",
    "nox": "nox",
    "so2": "so2",
    "co": "co",
    "c6h6": "c6h6",  # Benzene
    "as": "as_",  # Arsenic (use as_ to avoid Python keyword)
    "cd": "cd",  # Cadmium
    "ni": "ni",  # Nickel
    "pb": "pb",  # Lead
    "sh2": "sh2",  # Hydrogen sulfide
    "co2": "co2",  # Carbon dioxide
    "bc": "volatileOrganicCompoundsTotal",  # Black carbon → VOC total
    # Meteorological parameters that may come from air quality sensors
    "temperature": "temperature",
    "relativehumidity": "relativeHumidity",
    "humidity": "relativeHumidity",
    "pressure": "atmosphericPressure",
}

# OpenAQ units to UN/CEFACT Common Code mapping
# Reference: https://unece.org/trade/uncefact/cl-recommendations
PARAMETER_UNIT_MAPPING: dict[str, str] = {
    "µg/m³": "GQ",  # Microgram per cubic meter
    "ug/m3": "GQ",
    "μg/m³": "GQ",
    "ppm": "59",  # Parts per million
    "ppb": "61",  # Parts per billion
    "%": "P1",  # Percent
    "c": "CEL",  # Celsius
    "celsius": "CEL",
    "°c": "CEL",
    "hpa": "A97",  # Hectopascal
    "pa": "PAL",  # Pascal
    "mbar": "MBR",  # Millibar
    "particles/cm³": "E50",  # Particles per cubic centimeter (custom)
}

# NGSI-LD metadata fields that should NOT have observedAt timestamp
METADATA_FIELDS: set[str] = {
    "type",
    "id",
    "name",
    "source",
    "areaServed",
    "address",
    "description",
    "airQualityLevel",
    "coLevel",
    "typeofLocation",
    "dataProvider",
    "owner",
    "seeAlso",
    "alternateName",
}


def generate_entity_id(domain: str, location_id: str, entity_type: str) -> str:
    """
    Generate a standardized entity ID for Orion-LD.

    Format: {domain}:{location_id}:{entity_type}

    Args:
        domain: The domain/category (e.g., 'weather', 'traffic', 'air-quality')
        location_id: Location identifier (e.g., 'hcm', 'hanoi', 'danang')
        entity_type: Type of entity (e.g., 'current', 'forecast', 'historical')

    Returns:
        Standardized entity ID string

    Examples:
        >>> generate_entity_id('weather', 'hcm', 'latest')
        'weather:hcm:latest'
        >>> generate_entity_id('traffic', 'hanoi', 'realtime')
        'traffic:hanoi:realtime'
    """
    domain = sanitize_id_part(domain)
    location_id = sanitize_id_part(location_id)
    entity_type = sanitize_id_part(entity_type)

    return f"{domain}:{location_id}:{entity_type}"


def sanitize_id_part(text: str) -> str:
    """
    Sanitize a part of an entity ID.

    Converts to lowercase, replaces spaces and special chars with hyphens.

    Args:
        text: Text to sanitize

    Returns:
        Sanitized text suitable for use in entity IDs
    """
    text = text.lower()
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"[^a-z0-9-]", "", text)
    text = re.sub(r"-+", "-", text)
    text = text.strip("-")

    return text


def generate_entity_urn(entity_type: str, entity_id: str, namespace: str = "ngsi-ld") -> str:
    """
    Generate a full URN for an NGSI-LD entity.

    Format: urn:{namespace}:{entity_type}:{entity_id}

    Args:
        entity_type: NGSI-LD entity type (e.g., 'WeatherObserved')
        entity_id: Entity identifier
        namespace: URN namespace (default: 'ngsi-ld')

    Returns:
        Full URN string

    Examples:
        >>> generate_entity_urn('WeatherObserved', 'weather:hcm:latest')
        'urn:ngsi-ld:WeatherObserved:weather:hcm:latest'
    """
    return f"urn:{namespace}:{entity_type}:{entity_id}"
