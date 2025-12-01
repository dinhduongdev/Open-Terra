from arq.connections import RedisSettings
from arq.cron import cron

from ...core.config import settings
from .functions import crawl_weather_data, sample_background_task, shutdown, startup

REDIS_QUEUE_HOST = settings.REDIS_QUEUE_HOST
REDIS_QUEUE_PORT = settings.REDIS_QUEUE_PORT


class WorkerSettings:
    functions = [sample_background_task, crawl_weather_data]
    redis_settings = RedisSettings(host=REDIS_QUEUE_HOST, port=REDIS_QUEUE_PORT)
    on_startup = startup
    on_shutdown = shutdown
    handle_signals = False

    # Cron jobs - run weather crawler every 5 minutes
    cron_jobs = [cron(crawl_weather_data, second={30, 60})]
