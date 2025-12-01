#!/usr/bin/env python3
"""
Test script for weather crawler without publishing to Orion.
This script fetches and normalizes weather data, then prints the entity ID and normalized data.
"""

import asyncio
import json
import logging

from src.app.core.config import settings
from src.app.normalizers.weather_normalizer import weather_normalizer
from src.app.publishers.orion_ld_publisher import orion_ld_publisher
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
            raw_weather_data = open_weather_map_client.get_current_weather(
                lat=latitude, lon=longitude, units="metric", lang="vi"
            )

            # 2. Normalize the weather data
            logger.info(f"Normalizing weather data for {location_name}")
            normalized_entity = weather_normalizer.normalize(
                raw_data=raw_weather_data, location_name=location_name, country=country
            )

            # 3. Generate entity ID (same format as production)
            entity_id = f"weather:{location_id}:current"

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


def main():
    """Main entry point."""
    try:
        asyncio.run(test_weather_crawler())
    except KeyboardInterrupt:
        print("\n⚠️  Test interrupted by user")
        logger.info("Test interrupted by user")
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        print(f"\n❌ Unexpected error: {e}")
        raise


if __name__ == "__main__":
    main()
