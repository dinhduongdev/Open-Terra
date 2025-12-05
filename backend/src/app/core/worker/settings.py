"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

from arq.connections import RedisSettings
from arq.cron import cron

from ...core.config import settings
from .functions import crawl_air_quality_data, crawl_weather_data, sample_background_task, shutdown, startup

REDIS_QUEUE_HOST = settings.REDIS_QUEUE_HOST
REDIS_QUEUE_PORT = settings.REDIS_QUEUE_PORT


class WorkerSettings:
    pass
    # functions = [sample_background_task]
    # redis_settings = RedisSettings(host=REDIS_QUEUE_HOST, port=REDIS_QUEUE_PORT)
    # on_startup = startup
    # on_shutdown = shutdown
    # handle_signals = False

    # Cron jobs
    # - Weather: every 5 minutes
    # - Air quality: every 15 minutes
    # cron_jobs = [
    #     # cron(crawl_weather_data, minute={0, 15, 30, 45}),
    #     cron(crawl_air_quality_data, second={0, 15, 30, 45}),
    # ]
