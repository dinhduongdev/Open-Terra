"""Utilities for data normalization and entity management."""

import re


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
        >>> generate_entity_id('weather', 'hcm', 'current')
        'weather:hcm:current'
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
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'[^a-z0-9-]', '', text)
    text = re.sub(r'-+', '-', text)
    text = text.strip('-')

    return text


def generate_entity_urn(
    entity_type: str,
    entity_id: str,
    namespace: str = "ngsi-ld"
) -> str:
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
        >>> generate_entity_urn('WeatherObserved', 'weather:hcm:current')
        'urn:ngsi-ld:WeatherObserved:weather:hcm:current'
    """
    return f"urn:{namespace}:{entity_type}:{entity_id}"
