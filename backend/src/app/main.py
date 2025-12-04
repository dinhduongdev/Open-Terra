"""
Open-Terra Backend - Simple FastAPI application for NGSI-LD Weather Data
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import router
from .core.config import settings

def create_application() -> FastAPI:
    """Create and configure FastAPI application."""
    
    app = FastAPI(
        title=settings.APP_NAME,
        description="Weather Data API using FIWARE NGSI-LD Context Broker",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include API router
    app.include_router(router)
    
    @app.get("/", tags=["root"])
    async def root():
        """Health check endpoint."""
        return {
            "status": "ok",
            "app": settings.APP_NAME,
            "version": "1.0.0",
            "docs": "/docs"
        }
    
    return app

app = create_application()
