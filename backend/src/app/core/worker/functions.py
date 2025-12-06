"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import asyncio
import logging

import uvloop
from arq.worker import Worker

from app.core.config import settings
from app.publishers.orion_ld_publisher import orion_ld_publisher

asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


# -------- background tasks --------
async def sample_background_task(ctx: Worker, name: str = "scheduled") -> str:
    await asyncio.sleep(5)
    return f"Task {name} is complete!"


# -------- base functions --------
async def startup(ctx: Worker) -> None:
    logging.info("Worker Started")


async def shutdown(ctx: Worker) -> None:
    logging.info("Worker end")
