"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

"""
Open-Terra Backend - Simple FastAPI application for NGSI-LD Weather Data
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import router
from app.core.config import settings
from app.core.db.database import Base, async_engine
from app.models import *  # noqa: F403


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context manager."""
    # Database tables are created by the db-init service before this starts
    # No need to create tables here - prevents race conditions with multiple workers

    yield

    # Shutdown: Clean up resources
    await async_engine.dispose()


def create_application() -> FastAPI:
    """Create and configure FastAPI application."""

    app = FastAPI(
        title=settings.APP_NAME,
        description="Weather Data API using FIWARE NGSI-LD Context Broker",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS middleware - Disabled because nginx handles CORS
    # app.add_middleware(
    #     CORSMiddleware,
    #     allow_origins=settings.CORS_ORIGINS,
    #     allow_credentials=True,
    #     allow_methods=["*"],
    #     allow_headers=["*"],
    # )

    # Include API router
    app.include_router(router)

    @app.get("/", tags=["root"])
    async def root():
        """Health check endpoint."""
        return {"status": "ok", "app": settings.APP_NAME, "version": "1.0.0", "docs": "/docs"}

    return app


app = create_application()
