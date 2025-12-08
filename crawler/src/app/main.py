"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import asyncio
import os
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI

from .admin.initialize import create_admin_interface
from .api import router
from .core.config import settings
from .core.setup import create_application, lifespan_factory

admin = create_admin_interface()


@asynccontextmanager
async def lifespan_with_admin(app: FastAPI) -> AsyncGenerator[None, None]:
    """Custom lifespan that includes admin initialization."""
    # Get the default lifespan
    default_lifespan = lifespan_factory(settings)

    # Run the default lifespan initialization and our admin initialization
    async with default_lifespan(app):
        # Initialize admin interface if it exists
        if admin:
            # Use a file lock to prevent race conditions with multiple workers
            lock_file = Path("/tmp/admin_init.lock")
            max_retries = 30
            retry_count = 0
            
            while retry_count < max_retries:
                try:
                    # Try to create the lock file exclusively
                    fd = os.open(lock_file, os.O_CREAT | os.O_EXCL | os.O_WRONLY)
                    try:
                        # This worker got the lock, initialize admin
                        await admin.initialize()
                    finally:
                        # Close and remove the lock file
                        os.close(fd)
                        lock_file.unlink(missing_ok=True)
                    break
                except FileExistsError:
                    # Another worker is initializing, wait a bit
                    retry_count += 1
                    await asyncio.sleep(0.5)
                    
                    # Check if lock file is stale (older than 30 seconds)
                    if lock_file.exists():
                        try:
                            if (asyncio.get_event_loop().time() - lock_file.stat().st_mtime) > 30:
                                # Stale lock, remove it
                                lock_file.unlink(missing_ok=True)
                        except (OSError, FileNotFoundError):
                            pass
            
            # If we couldn't get the lock after retries, assume initialization is done
            if retry_count >= max_retries:
                # Just wait a bit more to ensure initialization is complete
                await asyncio.sleep(2)

        yield


app = create_application(router=router, settings=settings, lifespan=lifespan_with_admin)

# Mount admin interface if enabled
if admin:
    app.mount(settings.CRUD_ADMIN_MOUNT_PATH, admin.app)
