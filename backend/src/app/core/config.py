"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

"""Configuration settings for Open-Terra Backend."""

import os
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    # Application
    APP_NAME: str = Field(default="Open-Terra Backend", description="Application name")
    ENVIRONMENT: str = Field(default="development", description="Environment: development/production")
    DEBUG: bool = Field(default=True, description="Debug mode")
    
    # CORS
    CORS_ORIGINS: List[str] = Field(default=["*"], description="Allowed CORS origins")
    
    # FIWARE Orion-LD Context Broker
    ORION_LD_BASE_URL: str = Field(
        default="http://localhost:1026/",
        description="Base URL for Orion-LD Context Broker"
    )
    
    # Mintaka Temporal API (for temporal operations)
    MINTAKA_BASE_URL: str = Field(
        default="http://localhost:8080/",
        description="Base URL for Mintaka temporal API"
    )
    
    ORION_LD_CONTEXT: str = Field(
        default="<http://context/open-terra-context.jsonld>; rel='http://www.w3.org/ns/json-ld#context'; type='application/ld+json'",
        description="Default @context URLs for NGSI-LD entities"
    )
    
    # External APIs (Optional)
    OPENWEATHERMAP_BASE_URL: str = Field(
        default="https://api.openweathermap.org/data/2.5",
        description="OpenWeatherMap API base URL"
    )
    OPENWEATHERMAP_API_KEY: str = Field(default="", description="OpenWeatherMap API Key")
    
    OPEN_AQ_API_KEY: str = Field(default="", description="OpenAQ API Key")
    
    # Crawler locations
    WEATHER_LOCATIONS: str = Field(
        default="hcm:Ho Chi Minh City:10.8231:106.6297:Vietnam",
        description="Weather crawler locations (semicolon-separated, format: id:name:lat:lon:country)"
    )
    
    AIR_QUALITY_BBOX: str = Field(
        default="106.358004,10.376182,106.977358,11.164050",
        description="Air quality bbox for location search (format: min_lon,min_lat,max_lon,max_lat)"
    )
    
    def get_weather_locations(self) -> list[dict[str, str | float]]:
        """Parse weather locations from config string."""
        locations = []
        for loc in self.WEATHER_LOCATIONS.split(";"):
            parts = loc.strip().split(":")
            if len(parts) >= 4:
                location = {
                    "id": parts[0],
                    "name": parts[1],
                    "latitude": float(parts[2]),
                    "longitude": float(parts[3]),
                    "country": parts[4] if len(parts) >= 5 else "Vietnam"
                }
                locations.append(location)
        return locations
    
    def get_air_quality_bbox(self) -> str:
        """Get air quality bounding box."""
        return self.AIR_QUALITY_BBOX


settings = Settings()
