"""
Open-Terra - IoT and Smart City Data Platform
@author Vibe Coders / HCMCOU
@copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
@license MIT License
@see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
"""

import logging
from datetime import datetime

from fastapi import APIRouter

from app.core.config import settings
from app.schemas.api_response import APIResponse
from app.services.context_broker_client import ContextBrokerClient
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/ai-advisor", tags=["ai-advisor"])
logger = logging.getLogger(__name__)


import asyncio
from app.utils.location import get_street_name


async def format_data_summary(data: dict, data_type: str) -> str:
    """
    Format data into a human-readable summary for the prompt.

    Args:
        data: The data dictionary
        data_type: Type of data (traffic, flood, air_quality, weather)

    Returns:
        Formatted string summary
    """
    if not data or not isinstance(data, dict):
        return f"No {data_type} data available."

    try:
        if data_type == "traffic":
            items = data.get("items", [])
            if not items:
                return "No traffic data available."

            summary_parts = []
            for item in items[:3]:  # Limit to first 3 sensors
                sensor_id = item.get("id", "Unknown")
                intensity = item.get("intensity", {}).get("value", "N/A")
                speed = item.get("averageVehicleSpeed", {}).get("value", "N/A")
                congested = item.get("congested", {}).get("value", False)
                # Get lat/lon
                coords = item.get("location", {}).get("value", {}).get("coordinates")
                street = ""
                if coords and isinstance(coords, list) and len(coords) == 2:
                    lat, lon = coords[1], coords[0]
                    street = await asyncio.to_thread(get_street_name, lat, lon)
                street_info = f" at {street}" if street else ""
                summary_parts.append(
                    f"Sensor {sensor_id}{street_info}: {intensity} vehicles, avg speed {speed} km/h"
                    + (" (congested)" if congested else "")
                )

            return "Traffic: " + "; ".join(summary_parts)

        elif data_type == "flood":
            items = data.get("items", [])
            if not items:
                return "No flood monitoring data available."

            summary_parts = []
            for item in items[:3]:  # Limit to first 3 stations
                station_id = item.get("stationID", {}).get("value", "Unknown")
                current_level = item.get("currentLevel", {}).get("value", "N/A")
                status = item.get("floodLevelStatus", {}).get("value", "Normal")
                coords = item.get("location", {}).get("value", {}).get("coordinates")
                street = ""
                if coords and isinstance(coords, list) and len(coords) == 2:
                    lat, lon = coords[1], coords[0]
                    street = await asyncio.to_thread(get_street_name, lat, lon)
                street_info = f" at {street}" if street else ""
                summary_parts.append(f"Station {station_id}{street_info}: {current_level}m ({status})")

            return "Flood Monitoring: " + "; ".join(summary_parts)

        elif data_type == "air_quality":
            items = data.get("items", [])
            if not items:
                return "No air quality data available."

            summary_parts = []
            for item in items[:2]:  # Limit to first 2 stations
                station_id = item.get("id", "Unknown")
                aqi = item.get("https://smartdatamodels.org/dataModel.Weather/airQualityIndex", {}).get(
                    "value"
                ) or item.get("airQualityIndex", {}).get("value", "N/A")
                pm25 = item.get("https://smartdatamodels.org/dataModel.Environment/pm25", {}).get("value") or item.get(
                    "pm25", {}
                ).get("value", "N/A")
                level = item.get("https://smartdatamodels.org/dataModel.Environment/airQualityLevel", {}).get(
                    "value"
                ) or item.get("airQualityLevel", {}).get("value", "Unknown")
                coords = item.get("location", {}).get("value", {}).get("coordinates")
                street = ""
                if coords and isinstance(coords, list) and len(coords) == 2:
                    lat, lon = coords[1], coords[0]
                    street = await asyncio.to_thread(get_street_name, lat, lon)
                street_info = f" at {street}" if street else ""
                summary_parts.append(f"Station {station_id}{street_info}: AQI {aqi}, PM2.5 {pm25} μg/m³ ({level})")

            return "Air Quality: " + "; ".join(summary_parts)

        elif data_type == "weather":
            # Handle both concise format (with full URIs) and normalized format
            temp = data.get("https://smartdatamodels.org/dataModel.Weather/temperature", {}).get("value") or data.get(
                "temperature", {}
            ).get("value", "N/A")
            humidity = data.get("https://smartdatamodels.org/dataModel.Weather/relativeHumidity", {}).get(
                "value"
            ) or data.get("relativeHumidity", {}).get("value", "N/A")
            pressure = data.get("https://smartdatamodels.org/dataModel.Weather/atmosphericPressure", {}).get(
                "value"
            ) or data.get("atmosphericPressure", {}).get("value", "N/A")
            weather_type = data.get("https://smartdatamodels.org/dataModel.Weather/weatherType", {}).get(
                "value"
            ) or data.get("weatherType", {}).get("value", "Unknown")

            # Convert humidity from 0-1 to percentage if needed
            if isinstance(humidity, (int, float)) and humidity <= 1:
                humidity = f"{humidity * 100:.0f}%"

            return f"Weather: {temp}°C, Humidity {humidity}, Pressure {pressure} hPa, Condition: {weather_type}"

        else:
            return f"Unknown data type: {data_type}"

    except Exception as e:
        logger.error(f"Error formatting {data_type} data: {str(e)}")
        return f"Error processing {data_type} data."


async def fetch_latest_data() -> dict:
    """
    Fetch latest data from all sources.

    Returns:
        Dictionary with data from all sources and availability flags
    """
    data_sources = {"traffic": False, "flood": False, "air_quality": False, "weather": False}

    result = {"traffic": None, "flood": None, "air_quality": None, "weather": None, "sources": data_sources}

    # Fetch Traffic Data
    try:
        client_default = ContextBrokerClient(
            broker_url=settings.ORION_LD_BASE_URL,
            mintaka_url=settings.MINTAKA_BASE_URL,
            context_url=settings.ORION_LD_CONTEXT,
        )
        try:
            default_entities = await client_default.get_entities(
                entity_type="TrafficFlowObserved", entity_format="concise", limit=10
            )
            if default_entities:
                result["traffic"] = {"total": len(default_entities), "items": default_entities}
                data_sources["traffic"] = True
        finally:
            await client_default.close()

        # Also try openiot tenant
        client_openiot = ContextBrokerClient(
            broker_url=settings.ORION_LD_BASE_URL,
            mintaka_url=settings.MINTAKA_BASE_URL,
            context_url=settings.ORION_LD_CONTEXT,
            tenant="openiot",
        )
        try:
            openiot_entities = await client_openiot.get_entities(
                entity_type="TrafficFlowObserved", entity_format="concise", limit=10
            )
            if openiot_entities:
                if result["traffic"]:
                    result["traffic"]["items"].extend(openiot_entities)
                    result["traffic"]["total"] += len(openiot_entities)
                else:
                    result["traffic"] = {"total": len(openiot_entities), "items": openiot_entities}
                    data_sources["traffic"] = True
        finally:
            await client_openiot.close()

    except Exception as e:
        logger.warning(f"Failed to fetch traffic data: {str(e)}")

    # Fetch Flood Monitoring Data
    try:
        client_default = ContextBrokerClient(
            broker_url=settings.ORION_LD_BASE_URL,
            mintaka_url=settings.MINTAKA_BASE_URL,
            context_url=settings.ORION_LD_CONTEXT,
        )
        try:
            default_entities = await client_default.get_entities(
                entity_type="FloodMonitoring", entity_format="concise", limit=10
            )
            if default_entities:
                result["flood"] = {"total": len(default_entities), "items": default_entities}
                data_sources["flood"] = True
        finally:
            await client_default.close()

        # Also try openiot tenant
        client_openiot = ContextBrokerClient(
            broker_url=settings.ORION_LD_BASE_URL,
            mintaka_url=settings.MINTAKA_BASE_URL,
            context_url=settings.ORION_LD_CONTEXT,
            tenant="openiot",
        )
        try:
            openiot_entities = await client_openiot.get_entities(
                entity_type="FloodMonitoring", entity_format="concise", limit=10
            )
            if openiot_entities:
                if result["flood"]:
                    result["flood"]["items"].extend(openiot_entities)
                    result["flood"]["total"] += len(openiot_entities)
                else:
                    result["flood"] = {"total": len(openiot_entities), "items": openiot_entities}
                    data_sources["flood"] = True
        finally:
            await client_openiot.close()

    except Exception as e:
        logger.warning(f"Failed to fetch flood monitoring data: {str(e)}")

    # Fetch Air Quality Data
    try:
        from app.core.constants import AIR_QUALITY_STATION_IDS, get_air_quality_entity_id

        client = ContextBrokerClient(
            broker_url=settings.ORION_LD_BASE_URL,
            mintaka_url=settings.MINTAKA_BASE_URL,
            context_url=settings.ORION_LD_CONTEXT,
        )
        try:
            entities = []
            for station_id in AIR_QUALITY_STATION_IDS:
                entity_id = get_air_quality_entity_id(station_id)
                try:
                    entity = await client.get_entity(entity_id=entity_id, entity_format="concise")
                    if entity:
                        entities.append(entity)
                except Exception:
                    continue

            if entities:
                result["air_quality"] = {"total": len(entities), "items": entities}
                data_sources["air_quality"] = True
        finally:
            await client.close()

    except Exception as e:
        logger.warning(f"Failed to fetch air quality data: {str(e)}")

    # Fetch Weather Data
    try:
        from app.core.constants import WEATHER_ENTITY_ID

        client = ContextBrokerClient(
            broker_url=settings.ORION_LD_BASE_URL,
            mintaka_url=settings.MINTAKA_BASE_URL,
            context_url=settings.ORION_LD_CONTEXT,
        )
        try:
            weather = await client.get_entity(entity_id=WEATHER_ENTITY_ID, entity_format="concise")
            if weather:
                result["weather"] = weather
                data_sources["weather"] = True
        finally:
            await client.close()

    except Exception as e:
        logger.warning(f"Failed to fetch weather data: {str(e)}")

    return result


async def build_prompt(data: dict) -> str:
    """
    Build the prompt for Gemini AI based on collected data.

    Args:
        data: Dictionary containing all fetched data

    Returns:
        Formatted prompt string
    """
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    current_hour = datetime.utcnow().strftime("%H")

    traffic = await format_data_summary(data.get("traffic"), "traffic")
    flood = await format_data_summary(data.get("flood"), "flood")
    air_quality = await format_data_summary(data.get("air_quality"), "air_quality")
    weather = await format_data_summary(data.get("weather"), "weather")

    prompt = f"""Bạn là trợ lý hữu ích cung cấp tóm tắt thông tin về môi trường và giao thông.

Thời gian hiện tại: {current_hour} giờ UTC
Tóm tắt dữ liệu hiện tại (tính đến {timestamp}):

{traffic}

{flood}

{air_quality}

{weather}

Vui lòng cung cấp bản tóm tắt ngắn gọn, có thông tin (dưới 250 từ) bao gồm:
1. Tổng quan về điều kiện môi trường hiện tại
2. Bất kỳ quan sát đáng chú ý nào từ dữ liệu
3. Gợi ý chung cho các hoạt động hàng ngày dựa trên các điều kiện này

Lưu ý quan trọng:
- KHÔNG đề cập đến số lượng xe cụ thể (ví dụ: "18884 xe")
- Chỉ mô tả tình trạng giao thông một cách chung chung (ví dụ: "tắc nghẽn", "lưu thông tốt")
- Tập trung vào tốc độ trung bình và tình trạng tắc nghẽn
- Đối với flood monitoring, hãy hiểu và đề cập như nó là một cảm biến đo mức ngập nước, không phải lũ lụt thực tế

Hãy giữ phản hồi thực tế, trung lập và hữu ích. **Trả lời HOÀN TOÀN bằng tiếng Việt.**
"""

    return prompt


@router.get(
    "",
    summary="Get AI-powered environmental advice",
    description="Aggregates latest data from traffic, flood, air quality, and weather sources to provide AI-generated recommendations",
)
async def get_ai_advice():
    """
    Get AI-powered advice based on current environmental conditions.

    This endpoint:
    1. Fetches latest data from traffic, flood monitoring, air quality, and weather sources
    2. Aggregates the data into a structured prompt
    3. Sends the prompt to Google Gemini AI
    4. Returns the AI-generated advice to the user

    **Example Request:**
    ```
    GET /v1/ai-advisor
    ```

    **Response Format:**
    ```json
    {
        "success": true,
        "code": 200,
        "message": "AI advice generated successfully",
        "error": null,
        "result": {
            "advice": "Based on current conditions...",
            "data_sources": {
                "traffic": true,
                "flood": true,
                "air_quality": true,
                "weather": true
            },
            "timestamp": "2025-12-07T23:45:00Z"
        }
    }
    ```
    """
    try:
        # Fetch latest data from all sources
        logger.info("Fetching latest data from all sources...")
        data = await fetch_latest_data()

        # Check if we have at least some data
        available_sources = sum(data["sources"].values())
        if available_sources == 0:
            return APIResponse(
                success=False,
                code=503,
                message="No data available from any source. Please try again later.",
                error="NO_DATA_AVAILABLE",
                result=None,
            )

        logger.info(f"Data fetched from {available_sources}/4 sources")

        # Build prompt
        prompt = await build_prompt(data)
        logger.info("=" * 80)
        logger.info("PROMPT BEING SENT TO GEMINI:")
        logger.info("=" * 80)
        logger.info(prompt)
        logger.info("=" * 80)

        # Initialize Gemini service and generate advice
        try:
            gemini_service = GeminiService()
            advice = await gemini_service.generate_advice(prompt)
        except ValueError as e:
            # API key not configured
            return APIResponse(
                success=False,
                code=500,
                message=str(e),
                error="GEMINI_CONFIG_ERROR",
                result=None,
            )
        except Exception as e:
            # Gemini API error
            return APIResponse(
                success=False,
                code=500,
                message=f"Failed to generate AI advice: {str(e)}",
                error="GEMINI_API_ERROR",
                result=None,
            )

        # Return successful response
        return APIResponse(
            success=True,
            code=200,
            message="AI advice generated successfully",
            error=None,
            result={
                "advice": advice,
                "data_sources": data["sources"],
                "timestamp": datetime.utcnow().isoformat() + "Z",
            },
        )

    except Exception as e:
        import traceback

        logger.error(f"[ERROR] Exception in get_ai_advice: {str(e)}")
        logger.error(f"[ERROR] Traceback: {traceback.format_exc()}")
        return APIResponse(
            success=False,
            code=500,
            message=f"Failed to generate advice: {str(e)}",
            error="AI_ADVISOR_ERROR",
            result=None,
        )
