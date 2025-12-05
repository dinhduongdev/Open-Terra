from arq.connections import RedisSettings
from arq.cron import cron

from app.core.config import settings
from .functions import crawl_air_quality_data, crawl_weather_data, sample_background_task, shutdown, startup

REDIS_QUEUE_HOST = settings.REDIS_QUEUE_HOST
REDIS_QUEUE_PORT = settings.REDIS_QUEUE_PORT


class WorkerSettings:
    functions = [sample_background_task, crawl_weather_data, crawl_air_quality_data]
    redis_settings = RedisSettings(host=REDIS_QUEUE_HOST, port=REDIS_QUEUE_PORT)
    on_startup = startup
    on_shutdown = shutdown
    handle_signals = False

    # Cron jobs
    # - Weather: every 5 minutes
    # - Air quality: every 15 minutes
    cron_jobs = [
        cron(crawl_weather_data, minute={0, 15, 30, 45}),
        cron(crawl_air_quality_data, minute={0, 15, 30, 45}),
    ]
