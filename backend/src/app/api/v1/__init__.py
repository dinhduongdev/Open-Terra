"""API v1 router configuration."""

from fastapi import APIRouter

from .weather import router as weather_router
from .air_quality import router as air_quality_router

router = APIRouter()
router.include_router(weather_router, tags=["weather"])
router.include_router(air_quality_router, tags=["air-quality"])