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

from src.app.core.config import settings
from src.app.normalizers.air_quality_normalizer import air_quality_normalizer
from src.app.normalizers.weather_normalizer import weather_normalizer
from src.app.publishers.orion_ld_publisher import orion_ld_publisher
from src.app.services.openaq_client import OpenAQClient
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
            raw_weather_data = open_weather_map_client.get_latest_weather(
                lat=latitude, lon=longitude, units="metric", lang="vi"
            )

            # 2. Normalize the weather data
            normalized_entity = weather_normalizer.normalize(
                raw_data=raw_weather_data, location_name=location_name, country=country
            )

            # 3. Publish to Orion-LD Context Broker
            # Entity ID format: domain:location_id:entity_type
            entity_id = f"weather:{location_id}:latest"

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


async def crawl_air_quality_data(ctx: Worker) -> dict:
    """
    Crawl air quality data from OpenAQ and publish to Orion-LD.

    This task:
    1. Fetches locations within configured bounding box
    2. Gets latest measurements for each location
    3. Normalizes data to AirQualityObserved format
    4. Publishes to Orion Context Broker

    Returns:
        Dictionary with task result status
    """
    logger.info("Starting air quality data crawl task")

    results = []
    openaq_client = OpenAQClient()

    try:
        # Get bounding box from config
        bbox = settings.get_air_quality_bbox()
        logger.info(f"Fetching air quality locations within bbox: {bbox}")

        # 1. Fetch all locations within bbox
        locations_response = await openaq_client.get_locations_by_bbox(bbox=bbox, limit=1000)

        locations = locations_response.get("results", [])

        if not locations:
            logger.warning(f"No air quality locations found in bbox: {bbox}")
            return {"status": "warning", "message": "No air quality locations found", "results": []}

        logger.info(f"Found {len(locations)} air quality locations")

        active_locations = []
        for location in locations:
            if air_quality_normalizer._is_location_active(location):
                active_locations.append(location)
            else:
                datetime_last = location.get('datetimeLast')
                last_update = datetime_last.get('utc', 'N/A') if datetime_last else 'N/A'
                logger.info(
                    f"Skipping inactive location: {location.get('name', 'Unknown')} "
                    f"(last update: {last_update})"
                )

        if not active_locations:
            logger.warning("No active air quality locations found (all locations have stale data)")
            return {"status": "warning", "message": "No active air quality locations found", "results": []}

        logger.info(
            f"Processing {len(active_locations)} active locations "
            f"(filtered {len(locations) - len(active_locations)} inactive)"
        )

        # 2. Process each location
        for location in active_locations:
            try:
                location_id = location.get("id")
                location_name = location.get("name", "Unknown")
                country = location.get("country", {}).get("name", "Unknown")

                logger.info(f"Processing air quality for location: {location_name} (ID: {location_id})")

                # 3. Fetch latest measurements for this location
                latest_response = await openaq_client.get_latest_measurements(location_id=location_id, limit=100)

                measurements = latest_response.get("results", [])

                if not measurements:
                    logger.warning(f"No measurements found for location {location_id}")
                    continue

                # 3a. Get location details to map sensors to parameters
                location_details_response = await openaq_client.get_location_by_id(location_id)
                if "results" in location_details_response:
                    location_details = location_details_response.get("results", [{}])[0]
                else:
                    location_details = location_details_response

                # Map sensor IDs to parameter info
                sensor_map = {}
                for sensor in location_details.get("sensors", []):
                    sensor_id = sensor.get("id")
                    parameter = sensor.get("parameter", {})
                    if sensor_id and parameter:
                        sensor_map[sensor_id] = parameter

                # Enrich measurements with parameter info
                enriched_measurements = []
                for measurement in measurements:
                    sensor_id = measurement.get("sensorsId")
                    if sensor_id in sensor_map:
                        measurement["parameter"] = sensor_map[sensor_id]
                        measurement["date"] = measurement.get("datetime")
                        enriched_measurements.append(measurement)

                if not enriched_measurements:
                    logger.warning(f"Sensor mapping failed for location {location_id}")
                    continue

                # 4. Normalize measurements to AirQualityObserved
                normalized_entity = air_quality_normalizer.normalize_multiple(
                    measurements=enriched_measurements,
                    location_name=location_name,
                    country=country,
                    location_data=location_details,
                )

                # 5. Publish to Orion-LD Context Broker
                entity_id = f"airquality:{location_id}:latest"

                publish_result = orion_ld_publisher.publish(
                    entity=normalized_entity, entity_id=entity_id, entity_type="AirQualityObserved"
                )

                if publish_result.get("status") == "success":
                    logger.info(f"Successfully processed {location_name}: {publish_result.get('entity_id')}")
                    results.append(
                        {
                            "location": location_name,
                            "location_id": location_id,
                            "status": "success",
                            "entity_id": publish_result.get("entity_id"),
                            "timestamp": normalized_entity.dateObserved,
                            "aqi": normalized_entity.airQualityIndex,
                        }
                    )
                else:
                    logger.error(f"Failed to publish air quality data for {location_name}: {publish_result}")
                    results.append(
                        {
                            "location": location_name,
                            "location_id": location_id,
                            "status": "error",
                            "error": publish_result.get("error"),
                        }
                    )

            except Exception as e:
                logger.error(f"Error processing location {location.get('name', 'Unknown')}: {e}", exc_info=True)
                results.append(
                    {
                        "location": location.get("name", "Unknown"),
                        "location_id": location.get("id"),
                        "status": "error",
                        "error": str(e),
                    }
                )

    except Exception as e:
        logger.error(f"Fatal error in air quality crawl task: {e}", exc_info=True)
        return {"status": "error", "message": str(e), "results": results}

    success_count = sum(1 for r in results if r["status"] == "success")
    total_count = len(results)

    logger.info(f"Air quality crawl task completed: {success_count}/{total_count} successful")

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
