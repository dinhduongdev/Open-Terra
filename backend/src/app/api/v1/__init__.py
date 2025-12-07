"""API v1 router configuration."""

from fastapi import APIRouter

from app.api.v1 import (
    air_quality,
    flood_monitoring,
    flood_reports,
    health,
    login,
    logout,
    rate_limits,
    tasks,
    tiers,
    traffic_flow_observed,
    traffic_reports,
    users,
    weather,
)

router = APIRouter()
router.include_router(air_quality.router)
router.include_router(flood_monitoring.router)
router.include_router(flood_reports.router)
router.include_router(health.router)
router.include_router(login.router)
router.include_router(logout.router)
router.include_router(rate_limits.router)
router.include_router(tasks.router)
router.include_router(tiers.router)
router.include_router(traffic_flow_observed.router)
router.include_router(traffic_reports.router)
router.include_router(users.router)
router.include_router(weather.router)
