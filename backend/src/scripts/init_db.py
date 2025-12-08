"""
Open-Terra - IoT and Smart City Data Platform
Database initialization script
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import asyncio
import sys

from app.core.db.database import Base, async_engine
from app.models import *  # noqa: F403


async def init_db():
    """Initialize database by creating all tables."""
    print("Starting database initialization...")

    try:
        async with async_engine.begin() as conn:
            print("Creating tables...")
            await conn.run_sync(Base.metadata.create_all)
            print("✓ All tables created successfully!")
    except Exception as e:
        print(f"✗ Error creating tables: {e}")
        sys.exit(1)
    finally:
        await async_engine.dispose()
        print("Database connection closed.")


if __name__ == "__main__":
    asyncio.run(init_db())
