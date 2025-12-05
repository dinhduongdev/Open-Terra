#!/usr/bin/env python3
"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

"""
Test script for weather and air quality crawlers without publishing to Orion.
This script fetches and normalizes data, then prints the entity ID and normalized data.
"""

import asyncio
import json
import logging

from src.app.core.config import settings
from src.app.normalizers.air_quality_normalizer import air_quality_normalizer
from src.app.normalizers.weather_normalizer import weather_normalizer
from src.app.publishers.orion_ld_publisher import orion_ld_publisher
from src.app.services.openaq_client import OpenAQClient
from src.app.services.openweather_map_client import open_weather_map_client

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)


def print_separator():
    """Print a separator line."""
    print("=" * 80)


def print_entity_info(entity_id: str, normalized_data, location_name: str):
    """
    Print entity ID and normalized data in NGSI-LD format.

    Args:
        entity_id: The entity ID
        normalized_data: The normalized WeatherObserved data
        location_name: Name of the location
    """
    print_separator()
    print(f"📍 Location: {location_name}")
    print(f"🆔 Entity ID: urn:ngsi-ld:WeatherObserved:{entity_id}")
    print_separator()

    # Convert to NGSI-LD format (same as what will be published to Orion)
    ngsi_ld_data = orion_ld_publisher._convert_to_ngsi_ld(normalized_data, entity_id)

    # Pretty print the NGSI-LD data
    print("📊 NGSI-LD Format (will be published to Orion):")
    print(json.dumps(ngsi_ld_data, indent=2, ensure_ascii=False, default=str))
    print()


async def test_weather_crawler():
    """
    Test weather crawler without publishing to Orion.

    This function:
    1. Fetches current weather data for all configured locations
    2. Normalizes the data to WeatherObserved format
    3. Prints the entity ID and normalized data (NO publishing to Orion)
    """
    logger.info("Starting weather crawler test (without Orion publishing)")
    print_separator()
    print("🚀 Weather Crawler Test - No Publishing Mode")
    print_separator()
    print()

    locations = settings.get_weather_locations()

    if not locations:
        logger.warning("No weather locations configured")
        print("⚠️  No weather locations configured in settings")
        return

    print(f"📋 Testing {len(locations)} location(s)")
    print()

    results = []

    for idx, location in enumerate(locations, 1):
        try:
            location_id = location["id"]
            location_name = location["name"]
            latitude = location["latitude"]
            longitude = location["longitude"]
            country = location.get("country", "Unknown")

            print(f"[{idx}/{len(locations)}] Processing: {location_name} (lat: {latitude}, lon: {longitude})")

            # 1. Fetch weather data from OpenWeatherMap
            logger.info(f"Fetching weather data for {location_name}")
            raw_weather_data = open_weather_map_client.get_latest_weather(
                lat=latitude, lon=longitude, units="metric", lang="vi"
            )

            # 2. Normalize the weather data
            logger.info(f"Normalizing weather data for {location_name}")
            normalized_entity = weather_normalizer.normalize(
                raw_data=raw_weather_data, location_name=location_name, country=country
            )

            # 3. Generate entity ID (same format as production)
            entity_id = f"weather:{location_id}:latest"

            # 4. Print the results (instead of publishing)
            print_entity_info(entity_id, normalized_entity, location_name)

            results.append(
                {
                    "location": location_name,
                    "status": "success",
                    "entity_id": f"urn:ngsi-ld:WeatherObserved:{entity_id}",
                    "timestamp": normalized_entity.dateObserved,
                }
            )

        except Exception as e:
            logger.error(f"Error processing location {location.get('name', 'Unknown')}: {e}", exc_info=True)
            print(f"❌ Error processing {location.get('name', 'Unknown')}: {e}")
            print()
            results.append({"location": location.get("name", "Unknown"), "status": "error", "error": str(e)})

    # Print summary
    print_separator()
    print("📈 Test Summary")
    print_separator()

    success_count = sum(1 for r in results if r["status"] == "success")
    total_count = len(results)

    print(f"Total locations: {total_count}")
    print(f"Successful: {success_count}")
    print(f"Failed: {total_count - success_count}")
    print()

    if results:
        print("Results:")
        for result in results:
            status_icon = "✅" if result["status"] == "success" else "❌"
            print(f"{status_icon} {result['location']}: {result.get('entity_id', result.get('error'))}")

    print_separator()
    logger.info(f"Test completed: {success_count}/{total_count} successful")


async def test_air_quality_crawler():
    """
    Test air quality crawler without publishing to Orion.

    This function:
    1. Fetches air quality locations within configured bounding box
    2. Gets latest measurements for each location
    3. Normalizes the data to AirQualityObserved format
    4. Prints the entity ID and normalized data (NO publishing to Orion)
    """
    logger.info("Starting air quality crawler test (without Orion publishing)")
    print_separator()
    print("🚀 Air Quality Crawler Test - No Publishing Mode")
    print_separator()
    print()

    openaq_client = OpenAQClient()

    try:
        # Get bounding box from config
        bbox = settings.get_air_quality_bbox()
        print(f"📍 Bounding Box: {bbox}")
        print()

        # 1. Fetch all locations within bbox
        logger.info(f"Fetching air quality locations within bbox: {bbox}")
        locations_response = await openaq_client.get_locations_by_bbox(bbox=bbox, limit=1000)

        locations = locations_response.get("results", [])

        if not locations:
            print("⚠️  No air quality locations found in bounding box")
            logger.warning(f"No air quality locations found in bbox: {bbox}")
            return

        print(f"📋 Found {len(locations)} location(s) in total")

        # Filter active locations
        active_locations = []
        for location in locations:
            if air_quality_normalizer._is_location_active(location):
                active_locations.append(location)
            else:
                datetime_last = location.get("datetimeLast")
                last_update = datetime_last.get("utc", "N/A") if datetime_last else "N/A"
                logger.info(
                    f"Skipping inactive location: {location.get('name', 'Unknown')} (last update: {last_update})"
                )

        if not active_locations:
            print("⚠️  No active air quality locations found (all have stale data)")
            logger.warning("No active air quality locations found")
            return

        print(
            f"✅ {len(active_locations)} active location(s) (filtered {len(locations) - len(active_locations)} "
            "inactive)"
        )
        print()

        results = []

        for idx, location in enumerate(active_locations, 1):
            try:
                location_id = location.get("id")
                location_name = location.get("name", "Unknown")
                country = location.get("country", {}).get("name", "Unknown")

                print(f"[{idx}/{len(active_locations)}] Processing: {location_name} (ID: {location_id})")

                # 2. Fetch latest measurements for this location
                logger.info(f"Fetching air quality measurements for {location_name}")
                latest_response = await openaq_client.get_latest_measurements(location_id=location_id, limit=100)

                measurements = latest_response.get("results", [])

                if not measurements:
                    print(f"⚠️  No measurements found for location {location_id}")
                    logger.warning(f"No measurements found for location {location_id}")
                    continue

                print(f"  Found {len(measurements)} measurement(s)")

                # 3. Get location details to map sensors to parameters
                logger.info("Fetching location details for sensor mapping")
                location_details_response = await openaq_client.get_location_by_id(location_id)
                location_details = (
                    location_details_response.get("results", [{}])[0]
                    if "results" in location_details_response
                    else location_details_response
                )

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
                        # Use 'datetime' field from latest endpoint
                        measurement["date"] = measurement.get("datetime")
                        enriched_measurements.append(measurement)
                    else:
                        logger.warning(f"No parameter info for sensor {sensor_id}")

                if not enriched_measurements:
                    print("⚠️No enriched measurements (sensor mapping failed)")
                    logger.warning(f"Sensor mapping failed for location {location_id}")
                    continue

                print(f"  Enriched {len(enriched_measurements)} measurement(s) with parameter info")

                # 4. Normalize measurements to AirQualityObserved
                logger.info(f"Normalizing air quality data for {location_name}")
                normalized_entity = air_quality_normalizer.normalize_multiple(
                    measurements=enriched_measurements,
                    location_name=location_name,
                    country=country,
                    location_data=location_details,
                )

                # 4. Generate entity ID (same format as production)
                entity_id = f"airquality:{location_id}:latest"

                # 5. Print the results (instead of publishing)
                print_entity_info(entity_id, normalized_entity, location_name)

                results.append(
                    {
                        "location": location_name,
                        "location_id": location_id,
                        "status": "success",
                        "entity_id": f"urn:ngsi-ld:AirQualityObserved:{entity_id}",
                        "timestamp": normalized_entity.dateObserved,
                        "aqi": normalized_entity.airQualityIndex,
                    }
                )

            except Exception as e:
                logger.error(f"Error processing location {location.get('name', 'Unknown')}: {e}", exc_info=True)
                print(f"❌ Error processing {location.get('name', 'Unknown')}: {e}")
                print()
                results.append(
                    {
                        "location": location.get("name", "Unknown"),
                        "location_id": location.get("id"),
                        "status": "error",
                        "error": str(e),
                    }
                )

        # Print summary
        print_separator()
        print("📈 Test Summary")
        print_separator()

        success_count = sum(1 for r in results if r["status"] == "success")
        total_count = len(results)

        print(f"Total locations: {total_count}")
        print(f"Successful: {success_count}")
        print(f"Failed: {total_count - success_count}")
        print()

        if results:
            print("Results:")
            for result in results:
                status_icon = "✅" if result["status"] == "success" else "❌"
                aqi_info = f" (AQI: {result.get('aqi', 'N/A')})" if result.get("aqi") else ""
                print(f"{status_icon} {result['location']}: {result.get('entity_id', result.get('error'))}{aqi_info}")

        print_separator()
        logger.info(f"Test completed: {success_count}/{total_count} successful")

    except Exception as e:
        logger.error(f"Fatal error in air quality crawler test: {e}", exc_info=True)
        print(f"\n❌ Fatal error: {e}")
        raise


def main():
    """Main entry point."""
    try:
        import sys

        print("Select test mode:")
        print("1. Weather Crawler Test")
        print("2. Air Quality Crawler Test")
        print("3. Both")
        print()

        choice = input("Enter choice (1/2/3) [default: 3]: ").strip() or "3"

        if choice == "1":
            asyncio.run(test_weather_crawler())
        elif choice == "2":
            asyncio.run(test_air_quality_crawler())
        elif choice == "3":
            print("\n" + "=" * 80)
            print("Running Weather Crawler Test")
            print("=" * 80 + "\n")
            asyncio.run(test_weather_crawler())

            print("\n" + "=" * 80)
            print("Running Air Quality Crawler Test")
            print("=" * 80 + "\n")
            asyncio.run(test_air_quality_crawler())
        else:
            print(f"Invalid choice: {choice}")
            sys.exit(1)

    except KeyboardInterrupt:
        print("\n⚠️  Test interrupted by user")
        logger.info("Test interrupted by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        print(f"\n❌ Unexpected error: {e}")
        raise


if __name__ == "__main__":
    main()
