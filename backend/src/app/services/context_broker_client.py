from typing import Optional, Dict, List, Any
import httpx
from datetime import datetime
import logging
from src.app.core.config import settings

logger = logging.getLogger(__name__)

class ContextBrokerClient:
    def __init__(
        self,
        broker_url: str = None,
        mintaka_url: str = None,
        context_url: str = None,
        tenant: Optional[str] = None
    ):
        """
        Initialize Context Broker client.
        
        Args:
            broker_url: Base URL of the context broker (Orion-LD)
            mintaka_url: Base URL of Mintaka temporal API
            context_url: URL of the @context file
            tenant: NGSILD-Tenant header value (optional)
        """
        self.broker_url = (broker_url or settings.ORION_LD_BASE_URL).rstrip("/")
        self.mintaka_url = (mintaka_url or settings.MINTAKA_BASE_URL).rstrip("/")
        self.context_url = context_url or settings.ORION_LD_CONTEXT
        self.tenant = tenant
        self.client = httpx.AsyncClient(timeout=30.0)
        
        # Log configuration
        logger.info(f"ContextBrokerClient initialized:")
        logger.info(f"  broker_url: {self.broker_url}")
        logger.info(f"  mintaka_url: {self.mintaka_url}")
        logger.info(f"  context_url: {self.context_url}")
    
    def _get_headers(
    self, 
    content_type: str = "application/json",
    accept: str = "application/ld+json"
) -> Dict[str, str]:
        """Build common headers for requests."""
        headers = {
            "Content-Type": content_type,
            "Accept": accept,
        }
        
        # FIX: DON'T add Link header for GET requests
        # Link header only needed for POST/PATCH with body
        
        # NOTE: Tenant support disabled - using default database
        # if self.tenant:
        #     headers["NGSILD-Tenant"] = self.tenant
            
        return headers

    async def close(self):
        await self.client.aclose()
    
    def _normalize_temporal_response(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalize temporal response from expanded JSON-LD format to short attribute names.
        
        Mintaka returns attributes with full URLs like:
        'https://smart-data-models.github.io/data-models/terms.jsonld#/definitions/pm25'
        
        This function extracts the short name (e.g., 'pm25') from the URL.
        """
        if not isinstance(data, dict):
            return data
        
        normalized = {}
        
        logger.debug(f"Normalizing temporal response with {len(data)} keys")
        
        for key, value in data.items():
            # Keep special keys as-is
            if key in ['id', 'type', '@context']:
                normalized[key] = value
                continue
            
            # Extract short name from URL
            short_name = key
            if '/' in key:
                # Extract last part after last '/'
                short_name = key.split('/')[-1]
            if '#' in short_name:
                # Extract part after '#' if present
                parts = short_name.split('#')
                if len(parts) > 1:
                    short_name = parts[-1]
                    # Handle patterns like "/definitions/pm25"
                    if '/' in short_name:
                        short_name = short_name.split('/')[-1]
            
            logger.debug(f"Normalized key: '{key}' -> '{short_name}'")
            normalized[short_name] = value
        
        logger.info(f"Normalized temporal response keys: {list(normalized.keys())}")
        return normalized
    
    async def get_entity(
        self,
        entity_id: str,
        entity_format: str = "concise",
        attrs: Optional[List[str]] = None
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
            params = {}
            # params = {"format": entity_format}
            
            if attrs:
                params["pick"] = ",".join(attrs)
            
            headers = self._get_headers()
            
            # Log request details
            logger.info(f"GET Entity Request:")
            logger.info(f"  URL: {url}")
            logger.info(f"  Params: {params}")
            logger.info(f"  Headers: {headers}")
            
            response = await self.client.get(
                url,
                headers=headers,
                params=params
            )
            
            logger.info(f"Response: {response.status_code}")
            if response.status_code != 200:
                logger.error(f"Response body: {response.text}")
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                logger.warning(f"Entity {entity_id} not found")
                return None
            else:
                logger.error(f"Error getting entity: {response.status_code} - {response.text}")
                response.raise_for_status()
                
        except Exception as e:
            logger.error(f"Exception getting entity {entity_id}: {str(e)}")
            logger.exception("Full traceback:")
            raise

    async def get_entities(
    self,
    entity_type: str,
    entity_format: str = "normalized",  # normalized, keyValues, concise
    limit: int = 10,
    offset: int = 0,
    attrs: Optional[List[str]] = None,
    q: Optional[str] = None,
    georel: Optional[str] = None,
    geometry: Optional[str] = None,
    coordinates: Optional[str] = None
) -> List[Dict[str, Any]]:
        """Query multiple entities from Context Broker."""
        try:
            url = f"{self.broker_url}/ngsi-ld/v1/entities"
            
            # FIX: Build params correctly - NO format parameter for concise
            params = {
                "type": entity_type,
                "limit": limit,
                "offset": offset
            }
            
            # Optional filters
            if attrs:
                params["attrs"] = ",".join(attrs)
            if q:
                params["q"] = q
            if georel:
                params["georel"] = georel
            if geometry:
                params["geometry"] = geometry
            if coordinates:
                params["coordinates"] = coordinates
            
            # FIX: Build headers without Link for GET requests
            headers = {
                "Accept": "application/json"
            }
            
            # FIX: Only add Link header if context_url is valid
            if self.context_url and self.context_url.startswith("http"):
                headers["Link"] = f'<{self.context_url}>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
            
            if self.tenant:
                headers["NGSILD-Tenant"] = self.tenant
            
            # FIX: Add format as query parameter for specific formats
            # if entity_format in ["concise", "simplified"]:
            #     params["format"] = entity_format
            
            logger.info(f"GET {url}")
            logger.info(f"Params: {params}")
            logger.info(f"Headers: {headers}")
            
            response = await self.client.get(
                url,
                headers=headers,
                params=params
            )
            
            logger.info(f"Response: {response.status_code}")
            
            if response.status_code in [200, 206]:
                data = response.json()
                logger.info(f"Received {len(data) if isinstance(data, list) else 1} entities")
                return data if isinstance(data, list) else [data]
            else:
                logger.error(f"Orion-LD error {response.status_code}: {response.text}")
                return []  # Return empty list instead of raising
                
        except Exception as e:
            logger.error(f"Exception: {str(e)}")
            return []  # Return empty list on error
    
    async def get_temporal_entity(
        self,
        entity_id: str,
        timerel: str = "before",
        time_at: Optional[datetime] = None,
        end_time_at: Optional[datetime] = None,
        last_n: Optional[int] = None,
        attrs: Optional[List[str]] = None,
        entity_format: str = "concise"
    ) -> Optional[Dict[str, Any]]:
        """
        Get temporal data for a single entity.
        
        Based on tutorial: Temporal Operations
        Request: GET /temporal/entities/{entity-id}?lastN=10
        
        Args:
            entity_id: Entity URN
            timerel: Time relationship (before/after/between)
            time_at: Start time (defaults to now if not provided)
            end_time_at: End time (for timerel=between)
            last_n: Get last N observations
            attrs: List of attributes
            entity_format: Response format (concise/temporalValues)
            
        Returns:
            Temporal entity data
        """
        try:
            url = f"{self.mintaka_url}/temporal/entities/{entity_id}"
            params = {
                "timerel": timerel
            }
            
            # If time_at is not provided but timerel requires it, default to now
            if time_at is None and timerel in ["before", "after", "between"]:
                time_at = datetime.utcnow()
            
            if time_at:
                # Convert to UTC and format as ISO8601 with Z suffix
                utc_time = time_at.replace(tzinfo=None) if time_at.tzinfo else time_at
                params["timeAt"] = utc_time.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
            if end_time_at:
                # Convert to UTC and format as ISO8601 with Z suffix
                utc_time = end_time_at.replace(tzinfo=None) if end_time_at.tzinfo else end_time_at
                params["endTimeAt"] = utc_time.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
            if last_n:
                params["lastN"] = last_n
            if attrs:
                params["attrs"] = ",".join(attrs)
            
            logger.info(f"Temporal query URL: {url}")
            logger.info(f"Temporal query params: {params}")
            
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params
            )
            
            logger.info(f"Temporal response status: {response.status_code}")
            if response.status_code in [200, 206]:
                data = response.json()
                logger.info(f"Temporal response keys: {list(data.keys()) if isinstance(data, dict) else 'not a dict'}")
                
                # Normalize expanded JSON-LD to short attribute names
                # Mintaka returns expanded format with full URLs
                normalized_data = self._normalize_temporal_response(data)
                return normalized_data
            elif response.status_code == 404:
                logger.warning(f"Temporal entity {entity_id} not found")
                return None
            else:
                logger.error(f"Error getting temporal entity: {response.status_code}")
                logger.error(f"Response body: {response.text}")
                response.raise_for_status()
                
        except Exception as e:
            logger.error(f"Exception getting temporal entity {entity_id}: {str(e)}")
            raise
    
    async def get_temporal_entities(
        self,
        entity_type: str,
        timerel: str = "before",
        time_at: Optional[datetime] = None,
        end_time_at: Optional[datetime] = None,
        last_n: Optional[int] = None,
        limit: int = 100,
        attrs: Optional[List[str]] = None,
        entity_format: str = "temporalValues",
        q: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Query temporal data for multiple entities.
        
        Based on tutorial: Temporal Operations
        Request: GET /temporal/entities/?type=WeatherObserved&lastN=24
        
        Args:
            entity_type: Type of entities
            timerel: Time relationship
            time_at: Start time
            end_time_at: End time
            last_n: Get last N observations
            limit: Maximum results
            attrs: List of attributes
            entity_format: Response format
            q: Query filter
            
        Returns:
            List of temporal entities
        """
        try:
            url = f"{self.mintaka_url}/temporal/entities/"
            params = {
                "type": entity_type,
                "timerel": timerel,
                "limit": limit
            }
            
            if time_at:
                # Convert to UTC and format as ISO8601 with Z suffix
                utc_time = time_at.replace(tzinfo=None) if time_at.tzinfo else time_at
                params["timeAt"] = utc_time.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
            if end_time_at:
                # Convert to UTC and format as ISO8601 with Z suffix
                utc_time = end_time_at.replace(tzinfo=None) if end_time_at.tzinfo else end_time_at
                params["endTimeAt"] = utc_time.strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
            if last_n:
                params["lastN"] = last_n
            if attrs:
                params["attrs"] = ",".join(attrs)
            if q:
                params["q"] = q
            
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params
            )
            
            logger.info(f"Temporal entities response status: {response.status_code}")
            if response.status_code in [200, 206]:
                data = response.json()
                logger.info(f"Retrieved {len(data) if isinstance(data, list) else 1} temporal entities")
                
                # Normalize each entity in the list
                if isinstance(data, list):
                    normalized_data = [self._normalize_temporal_response(entity) for entity in data]
                    return normalized_data
                else:
                    # Single entity returned
                    return [self._normalize_temporal_response(data)]
            else:
                logger.error(f"Error querying temporal entities: {response.status_code}")
                logger.error(f"Response body: {response.text}")
                response.raise_for_status()
                
        except Exception as e:
            logger.error(f"Exception querying temporal entities: {str(e)}")
            raise

    
    