import asyncio
import logging

import uvloop
from arq.worker import Worker

from src.app.core.config import settings
from src.app.normalizers.weather_normalizer import weather_normalizer
from src.app.publishers.orion_ld_publisher import orion_ld_publisher
from src.app.services.openweather_map_client import open_weather_map_client

asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


# -------- background tasks --------
async def sample_background_task(ctx: Worker, name: str) -> str:
    await asyncio.sleep(5)
    return f"Task {name} is complete!"


async def crawl_weather_data(ctx: Worker) -> dict:
    """
    Crawl weather data from OpenWeatherMap and publish to Orion-LD.

    This task:
    1. Fetches current weather data for all configured locations
    2. Normalizes the data to WeatherObserved format
    3. Publishes to Orion Context Broker

    Returns:
        Dictionary with task result status
    """
    logger.info("Starting weather data crawl task")

    results = []
    locations = settings.get_weather_locations()

    if not locations:
        logger.warning("No weather locations configured")
        return {"status": "warning", "message": "No weather locations configured", "results": []}

    for location in locations:
        try:
            location_id = location["id"]
            location_name = location["name"]
            latitude = location["latitude"]
            longitude = location["longitude"]
            country = location.get("country", "Unknown")

            logger.info(f"Processing weather for {location_name} (lat: {latitude}, lon: {longitude})")

            # 1. Fetch weather data from OpenWeatherMap
            raw_weather_data = open_weather_map_client.get_current_weather(
                lat=latitude, lon=longitude, units="metric", lang="vi"
            )

            # 2. Normalize the weather data
            normalized_entity = weather_normalizer.normalize(
                raw_data=raw_weather_data, location_name=location_name, country=country
            )

            # 3. Publish to Orion-LD Context Broker
            # Entity ID format: domain:location_id:entity_type
            entity_id = f"weather:{location_id}:current"

            publish_result = orion_ld_publisher.publish(
                entity=normalized_entity, entity_id=entity_id, entity_type="WeatherObserved"
            )

            if publish_result.get("status") == "success":
                logger.info(f"Successfully processed {location_name}: {publish_result.get('entity_id')}")
                results.append(
                    {
                        "location": location_name,
                        "status": "success",
                        "entity_id": publish_result.get("entity_id"),
                        "timestamp": normalized_entity.dateObserved,
                    }
                )
            else:
                logger.error(f"Failed to publish weather data for {location_name}: {publish_result}")
                results.append({"location": location_name, "status": "error", "error": publish_result.get("error")})

        except Exception as e:
            logger.error(f"Error processing location {location.get('name', 'Unknown')}: {e}", exc_info=True)
            results.append({"location": location.get("name", "Unknown"), "status": "error", "error": str(e)})

    success_count = sum(1 for r in results if r["status"] == "success")
    total_count = len(results)

    logger.info(f"Weather crawl task completed: {success_count}/{total_count} successful")

    return {
        "status": "success" if success_count == total_count else "partial",
        "message": f"Processed {success_count}/{total_count} locations",
        "results": results,
    }


# -------- base functions --------
async def startup(ctx: Worker) -> None:
    logging.info("Worker Started")


async def shutdown(ctx: Worker) -> None:
    logging.info("Worker end")
