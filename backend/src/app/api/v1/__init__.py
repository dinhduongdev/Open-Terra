"""API v1 router configuration."""

from fastapi import APIRouter

from app.api.v1 import air_quality, health, login, logout, rate_limits, tasks, tiers, users, weather
from app.api.v1 import flood_reports, traffic_reports

router = APIRouter(prefix="/v1")
router.include_router(air_quality.router)
router.include_router(flood_reports.router)
router.include_router(health.router)
router.include_router(login.router)
router.include_router(logout.router)
router.include_router(rate_limits.router)
router.include_router(tasks.router)
router.include_router(tiers.router)
router.include_router(traffic_reports.router)
router.include_router(users.router)
router.include_router(weather.router)
