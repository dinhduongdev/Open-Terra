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

from sqlalchemy import text

from app.core.db.database import Base, async_engine
from app.models import *  # noqa: F403


async def wait_for_db(max_retries: int = 30, retry_interval: int = 2):
    """Wait for database to be ready."""
    print("Waiting for database to be ready...")

    for attempt in range(max_retries):
        try:
            async with async_engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
                print("✓ Database is ready!")
                return True
        except Exception as e:
            print(f"Database not ready yet (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                await asyncio.sleep(retry_interval)
            else:
                print("✗ Database connection timeout")
                return False

    return False


async def init_db():
    """Initialize database by creating all tables."""
    print("Starting database initialization...")

    # Wait for database to be ready
    if not await wait_for_db():
        print("✗ Failed to connect to database")
        sys.exit(1)

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
