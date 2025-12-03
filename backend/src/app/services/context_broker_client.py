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
        context_url: str = None,
        tenant: Optional[str] = None
    ):
        """
        Initialize Context Broker client.
        
        Args:
            broker_url: Base URL of the context broker
            context_url: URL of the @context file
            tenant: NGSILD-Tenant header value (optional)
        """
        self.broker_url = (broker_url or settings.ORION_LD_BASE_URL).rstrip("/")
        self.context_url = context_url or settings.ORION_LD_CONTEXT
        self.tenant = tenant
        self.client = httpx.AsyncClient(timeout=30.0)
    
    def _get_headers(
        self, 
        content_type: str = "application/json",
        accept: str = "application/json"
    ) -> Dict[str, str]:
        """Build common headers for requests."""
        headers = {
            "Content-Type": content_type,
            "Accept": accept,
            "Link": f'<{self.context_url}>; rel="http://www.w3.org/ns/json-ld#context"; type="application/ld+json"'
        }
        
        if self.tenant:
            headers["NGSILD-Tenant"] = self.tenant
            
        return headers

    async def close(self):
        await self.client.aclose()
    
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
            params = {"format": entity_format}
            
            if attrs:
                params["pick"] = ",".join(attrs)
            
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params
            )
            
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
        coordinates: Optional[str] = None
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
            params = {
                "type": entity_type,
                "format": entity_format,
                "limit": limit,
                "offset": offset
            }
            
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
            
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error querying entities: {response.status_code} - {response.text}")
                response.raise_for_status()
                
        except Exception as e:
            logger.error(f"Exception querying entities: {str(e)}")
            raise
    
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
            params = {
                "format": entity_format,
                "timerel": timerel
            }
            
            if time_at:
                params["timeAt"] = time_at.isoformat() + "Z"
            if end_time_at:
                params["endTimeAt"] = end_time_at.isoformat() + "Z"
            if last_n:
                params["lastN"] = last_n
            if attrs:
                params["attrs"] = ",".join(attrs)
            
            response = await self.client.get(
                url,
                headers=self._get_headers(),
                params=params
            )
            
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
            url = f"{self.broker_url}/temporal/entities/"
            params = {
                "type": entity_type,
                "format": entity_format,
                "timerel": timerel,
                "limit": limit
            }
            
            if time_at:
                params["timeAt"] = time_at.isoformat() + "Z"
            if end_time_at:
                params["endTimeAt"] = end_time_at.isoformat() + "Z"
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
            
            if response.status_code == 200:
                return response.json()
            else:
                logger.error(f"Error querying temporal entities: {response.status_code}")
                response.raise_for_status()
                
        except Exception as e:
            logger.error(f"Exception querying temporal entities: {str(e)}")
            raise

    
    