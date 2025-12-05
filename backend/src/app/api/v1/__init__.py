"""API v1 router configuration."""

from fastapi import APIRouter

from app.api.v1.weather import router as weather_router
from app.api.v1.air_quality import router as air_quality_router

router = APIRouter()
router.include_router(weather_router, tags=["weather"])
router.include_router(air_quality_router, tags=["air-quality"])