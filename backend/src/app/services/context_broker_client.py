"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from typing import Optional, Dict, List, Any
import httpx
from datetime import datetime
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


def normalize_temporal_entity(entity: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize temporal NGSI-LD entity from expanded format to concise format.
    Temporal entities have arrays of values with observedAt timestamps.

    Example input (expanded):
    {
        "id": "urn:ngsi-ld:WeatherObserved:weather:hcm:latest",
        "https://smartdatamodels.org/dataModel.Weather/temperature": [
            {"type": "Property", "value": 29.01, "observedAt": "2025-12-04T09:57:11Z", ...},
            {"type": "Property", "value": 28.5, "observedAt": "2025-12-04T09:55:10Z", ...}
        ]
    }

    Example output (concise):
    {
        "id": "urn:ngsi-ld:WeatherObserved:weather:hcm:latest",
        "temperature": [
            {"type": "Property", "value": 29.01, "observedAt": "2025-12-04T09:57:11Z", ...},
            {"type": "Property", "value": 28.5, "observedAt": "2025-12-04T09:55:10Z", ...}
        ]
    }
    """
    result = {}

    # Keep basic fields
    if "id" in entity:
        result["id"] = entity["id"]
    if "type" in entity:
        result["type"] = entity["type"]
    if "@context" in entity:
        result["@context"] = entity["@context"]

    # Process all properties
    for key, value in entity.items():
        if key in ["id", "type", "@context"]:
            continue

        # Extract short name from URL
        short_key = key.split("/")[-1].split("#")[-1] if ("/" in key or "#" in key) else key

        # Temporal entities have arrays or single objects
        if isinstance(value, list):
            # Keep array structure for temporal data
            result[short_key] = value
        elif isinstance(value, dict):
            # Keep single object (for properties that haven't changed)
            result[short_key] = value
        else:
            # Simple value
            result[short_key] = value

    return result


def normalize_entity(entity: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize NGSI-LD entity from expanded format to concise format.
    Handles both normalized and expanded URL-based property names.

    Example:
    Input:  {"https://smartdatamodels.org/dataModel.Weather/temperature": {"type": "Property", "value": 27.01}}
    Output: {"temperature": 27.01}
    """
    result = {}

    # Keep basic fields
    if "id" in entity:
        result["id"] = entity["id"]
    if "type" in entity:
        result["type"] = entity["type"]
    if "@context" in entity:
        result["@context"] = entity["@context"]

    # Process all properties
    for key, value in entity.items():
        if key in ["id", "type", "@context"]:
            continue

        # Extract short name from URL (e.g., "temperature" from "https://...../temperature")
        short_key = key.split("/")[-1] if "/" in key else key

        # Handle NGSI-LD Property/GeoProperty/Relationship structure
        if isinstance(value, dict):
            prop_type = value.get("type")

            if prop_type == "Property":
                # Extract value from Property
                prop_value = value.get("value")

                # Handle nested @value structure
                if isinstance(prop_value, dict) and "@value" in prop_value:
                    result[short_key] = prop_value["@value"]
                else:
                    result[short_key] = prop_value

            elif prop_type == "GeoProperty":
                # Keep GeoProperty structure
                result[short_key] = value.get("value")

            elif prop_type == "Relationship":
                # Extract object reference
                result[short_key] = value.get("object")
            else:
                # Unknown type, keep as is
                result[short_key] = value
        else:
            # Simple value
            result[short_key] = value

    return result


class ContextBrokerClient:
    def __init__(
        self, broker_url: str = None, temporal_url: str = None, context_url: str = None, tenant: Optional[str] = None
    ):
        """
        Initialize Context Broker client.

        Args:
            broker_url: Base URL of the context broker
            temporal_url: Base URL for temporal API (Mintaka)
            context_url: URL of the @context file
            tenant: NGSILD-Tenant header value (optional)
        """
        self.broker_url = (broker_url or settings.ORION_LD_BASE_URL).rstrip("/")
        self.temporal_url = (temporal_url or settings.MINTAKA_BASE_URL).rstrip("/")
        self.context_url = context_url or settings.ORION_LD_CONTEXT
        self.tenant = tenant
        self.client = httpx.AsyncClient(timeout=30.0)

        # Log configuration with both logger and print
        print(f"[DEBUG] ContextBrokerClient initialized:")
        print(f"[DEBUG]   broker_url: {self.broker_url}")
        print(f"[DEBUG]   temporal_url: {self.temporal_url}")
        print(f"[DEBUG]   context_url: {self.context_url}")
        logger.info(f"ContextBrokerClient initialized:")
        logger.info(f"  broker_url: {self.broker_url}")
        logger.info(f"  temporal_url: {self.temporal_url}")
        logger.info(f"  context_url: {self.context_url}")

    def _get_headers(
        self, content_type: str = "application/json", accept: str = "application/ld+json"
    ) -> Dict[str, str]:
        """Build common headers for requests."""
        headers = {"Accept": accept}

        # Don't add Link header - it causes issues with Orion-LD
        # The @context should be in the request body for POST/PATCH operations
        # For GET operations, Orion-LD returns full URIs by default

        if self.tenant:
            headers["NGSILD-Tenant"] = self.tenant

        return headers

    async def close(self):
        await self.client.aclose()

    async def get_entity(
        self, entity_id: str, entity_format: str = "concise", attrs: Optional[List[str]] = None
    ) -> Optional[Dict[str, Any]]:
        """
        Get a single entity by ID.

        Based on tutorial: Normalized CRUD Operations
        Request: GET /ngsi-ld/v1/entities/{entity-id}?format=concise

        Args:
            entity_id: Entity URN (e.g., urn:ngsi-ld:WeatherObserved:Station-001)
            entity_format: Response format (normalized/concise/simplified)
            attrs: List of attributes to retrieve

        Returns:
            Entity data or None if not found
        """
        try:
            url = f"{self.broker_url}/ngsi-ld/v1/entities/{entity_id}"
            params = {"format": entity_format}

            if attrs:
                params["pick"] = ",".join(attrs)

            headers = self._get_headers()

            # Log request details with both logger and print
            print(f"[DEBUG] GET Entity Request:")
            print(f"[DEBUG]   URL: {url}")
            print(f"[DEBUG]   Params: {params}")
            logger.info(f"GET Entity Request:")
            logger.info(f"  URL: {url}")
            logger.info(f"  Params: {params}")
            logger.info(f"  Headers: {headers}")

            response = await self.client.get(url, headers=headers, params=params)

            print(f"[DEBUG] Response status: {response.status_code}")
            logger.info(f"Response: {response.status_code}")
            if response.status_code != 200:
                logger.error(f"Response body: {response.text}")

            if response.status_code == 200:
                entity = response.json()
                print(f"[DEBUG] Raw entity keys: {list(entity.keys())[:10]}...")  # First 10 keys
                # Normalize expanded format to concise
                normalized = normalize_entity(entity)
                print(f"[DEBUG] Normalized entity keys: {list(normalized.keys())}")
                logger.info(f"Normalized entity keys: {list(normalized.keys())}")
                return normalized
            elif response.status_code == 404:
                logger.warning(f"Entity {entity_id} not found")
                return None
            else:
                logger.error(f"Error getting entity: {response.status_code} - {response.text}")
                response.raise_for_status()

        except Exception as e:
            print(f"[DEBUG] Exception getting entity {entity_id}: {str(e)}")
            import traceback

            print(f"[DEBUG] Traceback: {traceback.format_exc()}")
            logger.error(f"Exception getting entity {entity_id}: {str(e)}")
            logger.exception("Full traceback:")
            raise

    async def get_entities(
        self,
        entity_type: str,
        entity_format: str = "concise",
        limit: int = 10,
        offset: int = 0,
        attrs: Optional[List[str]] = None,
        q: Optional[str] = None,
        georel: Optional[str] = None,
        geometry: Optional[str] = None,
        coordinates: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Query multiple entities.

        Based on tutorial: Normalized CRUD Operations
        Request: GET /ngsi-ld/v1/entities/?type=WeatherObserved&format=concise

        Args:
            entity_type: Type of entities to query
            entity_format: Response format
            limit: Maximum number of results
            offset: Pagination offset
            attrs: List of attributes to retrieve
            q: Query filter (e.g., "temperature>=20;temperature<=30")
            georel: Geo-relationship (e.g., "near;maxDistance==5000")
            geometry: Geometry type (e.g., "Point")
            coordinates: Coordinates (e.g., "[13.404,52.47]")

        Returns:
            List of entities
        """
        try:
            url = f"{self.broker_url}/ngsi-ld/v1/entities/"
            params = {"type": entity_type, "format": entity_format, "limit": limit, "offset": offset}

            if attrs:
                params["pick"] = ",".join(attrs)
            if q:
                params["q"] = q
            if georel:
                params["georel"] = georel
            if geometry:
                params["geometry"] = geometry
            if coordinates:
                params["coordinates"] = coordinates

            headers = self._get_headers()

            # Log request details
            logger.info(f"GET Entities Request:")
            logger.info(f"  URL: {url}")
            logger.info(f"  Params: {params}")
            logger.info(f"  Headers: {headers}")

            response = await self.client.get(url, headers=headers, params=params)

            logger.info(f"Response: {response.status_code}")
            if response.status_code != 200:
                logger.error(f"Response body: {response.text}")

            if response.status_code == 200:
                entities = response.json()
                # Normalize all entities
                normalized = [normalize_entity(entity) for entity in entities]
                logger.info(f"Retrieved {len(normalized)} entities")
                return normalized
            else:
                logger.error(f"Error querying entities: {response.status_code} - {response.text}")
                response.raise_for_status()

        except Exception as e:
            logger.error(f"Exception querying entities: {str(e)}")
            logger.exception("Full traceback:")
            raise

    async def get_temporal_entity(
        self,
        entity_id: str,
        timerel: str = "before",
        time_at: Optional[datetime] = None,
        end_time_at: Optional[datetime] = None,
        last_n: Optional[int] = None,
        attrs: Optional[List[str]] = None,
        entity_format: str = "concise",
    ) -> Optional[Dict[str, Any]]:
        """
        Get temporal data for a single entity.

        Based on tutorial: Temporal Operations
        Request: GET /temporal/entities/{entity-id}?lastN=10

        Args:
            entity_id: Entity URN
            timerel: Time relationship (before/after/between)
            time_at: Start time
            end_time_at: End time (for timerel=between)
            last_n: Get last N observations
            attrs: List of attributes
            entity_format: Response format (concise/temporalValues)

        Returns:
            Temporal entity data
        """
        try:
            url = f"{self.broker_url}/temporal/entities/{entity_id}"
            params = {"format": entity_format, "timerel": timerel}

            if time_at:
                params["timeAt"] = time_at.isoformat() + "Z"
            if end_time_at:
                params["endTimeAt"] = end_time_at.isoformat() + "Z"
            if last_n:
                params["lastN"] = last_n
            if attrs:
                params["attrs"] = ",".join(attrs)

            response = await self.client.get(url, headers=self._get_headers(), params=params)

            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                logger.warning(f"Temporal entity {entity_id} not found")
                return None
            else:
                logger.error(f"Error getting temporal entity: {response.status_code}")
                response.raise_for_status()

        except Exception as e:
            logger.error(f"Exception getting temporal entity {entity_id}: {str(e)}")
            raise

    async def get_temporal_entities(
        self,
        entity_id: str,
        timerel: str = "before",
        time_at: Optional[datetime] = None,
        end_time_at: Optional[datetime] = None,
        last_n: Optional[int] = None,
        attrs: Optional[List[str]] = None,
        entity_format: str = "temporalValues"
    ) -> Dict[str, Any]:
        """
        Query temporal data for a single entity.

        Based on Mintaka API: GET /temporal/entities/{entityId}
        Example: GET /temporal/entities/urn:ngsi-ld:AirQualityObserved:airquality:3276359:latest/?timerel=before&timeAt=2025-12-04T10:23:40Z&lastN=5
        
        Note: Mintaka doesn't support 'q' parameter for filtering.
        Filtering must be done client-side after retrieving temporal data.
        
        Args:
            entity_id: Full entity URN (e.g., urn:ngsi-ld:AirQualityObserved:airquality:3276359:latest)
            timerel: Time relationship (before/after/between)
            time_at: Start time
            end_time_at: End time (required for timerel=between)
            last_n: Get last N observations
            attrs: List of attributes to retrieve
            entity_format: Response format (not used by Mintaka)
            
        Returns:
            Single temporal entity as dict
        """
        try:
            # Mintaka expects entity ID in the path, not as a query parameter
            url = f"{self.temporal_url}/temporal/entities/{entity_id}/"
            params = {}

            # Note: Mintaka doesn't support 'format', 'limit', or 'type' parameters
            # It returns temporal format by default

            # timerel and timeAt are required by Mintaka
            if not time_at:
                time_at = datetime.utcnow()

            params["timerel"] = timerel

            # Convert to UTC and format as ISO 8601 with Z suffix
            # Remove timezone info to avoid +00:00Z format
            utc_time = time_at.replace(tzinfo=None) if time_at.tzinfo else time_at
            params["timeAt"] = utc_time.strftime("%Y-%m-%dT%H:%M:%SZ")

            if end_time_at:
                utc_end = end_time_at.replace(tzinfo=None) if end_time_at.tzinfo else end_time_at
                params["endTimeAt"] = utc_end.strftime("%Y-%m-%dT%H:%M:%SZ")

            if last_n:
                params["lastN"] = last_n

            if attrs:
                params["attrs"] = ",".join(attrs)
            
            # Debug logging
            print(f"[DEBUG] Temporal Query Request:")
            print(f"[DEBUG]   URL: {url}")
            print(f"[DEBUG]   Params: {params}")
            print(f"[DEBUG]   Headers: {self._get_headers()}")
            logger.info(f"Temporal query to {url} with params: {params}")

            response = await self.client.get(url, headers=self._get_headers(), params=params)

            print(f"[DEBUG] Temporal Response Status: {response.status_code}")
            logger.info(f"Temporal response status: {response.status_code}")

            # HTTP 200 OK: Full response
            # HTTP 206 Partial Content: Partial response (e.g., with lastN parameter)
            if response.status_code in [200, 206]:
                data = response.json()
                print(f"[DEBUG] Temporal Response Type: {type(data)}")
                print(f"[DEBUG] Entity keys: {list(data.keys())[:10] if isinstance(data, dict) else 'Not a dict'}")
                logger.info(f"Temporal response data type: {type(data)}")

                # Mintaka returns expanded format for a single entity
                # Normalize to concise format
                try:
                    normalized = normalize_temporal_entity(data)
                    print(f"[DEBUG] Normalized entity keys: {list(normalized.keys())[:10] if normalized else 'None'}")
                    return normalized
                except Exception as norm_error:
                    logger.error(f"Error normalizing temporal entity: {str(norm_error)}")
                    print(f"[ERROR] Normalization failed: {str(norm_error)}")
                    import traceback

                    print(f"[ERROR] Normalization traceback: {traceback.format_exc()}")
                    # Return raw data if normalization fails
                    return data
            elif response.status_code == 404:
                logger.warning(f"Temporal entity {entity_id} not found")
                print(f"[DEBUG] Entity not found: {entity_id}")
                return None
            else:
                logger.error(f"Error querying temporal entity: {response.status_code}")
                logger.error(f"Response body: {response.text}")
                print(f"[ERROR] Temporal query failed with status {response.status_code}")
                print(f"[ERROR] URL: {url}")
                print(f"[ERROR] Params: {params}")
                print(f"[ERROR] Response: {response.text}")
                response.raise_for_status()
                return None

        except Exception as e:
            logger.error(f"Exception querying temporal entity: {str(e)}")
            raise
