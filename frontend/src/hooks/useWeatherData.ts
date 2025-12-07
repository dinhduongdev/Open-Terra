/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { useState, useEffect } from 'react';
import { WeatherData, WeatherAPIResponse, NGSILDWeatherData, WeatherResult } from '@/types/weather';

interface UseWeatherDataReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Decode Unicode escape sequences to readable text
 */
function decodeUnicode(str: string): string {
  try {
    return str.replace(/\\u([\dA-F]{4})/gi, (match, grp) => {
      return String.fromCharCode(parseInt(grp, 16));
    });
  } catch (e) {
    return str;
  }
}

/**
 * Transform NGSI-LD formatted weather data to simplified structure
 */
function transformNGSILDToWeather(ngsiData: NGSILDWeatherData): WeatherResult {
  return {
    id: ngsiData.id,
    type: ngsiData.type,
    location: {
      type: ngsiData.location.value.type,
      coordinates: ngsiData.location.value.coordinates,
    },
    dateObserved: ngsiData['https://smartdatamodels.org/dateObserved'].value,
    address: ngsiData['https://smartdatamodels.org/address'].value,
    areaServed: ngsiData['https://smartdatamodels.org/areaServed'].value,
    name: ngsiData['https://smartdatamodels.org/name'].value,
    temperature: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].unitCode,
    },
    feelsLikeTemperature: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/feelsLikeTemperature'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/feelsLikeTemperature'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/feelsLikeTemperature'].unitCode,
    },
    relativeHumidity: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'].observedAt,
    },
    dewPoint: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/dewPoint'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/dewPoint'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/dewPoint'].unitCode,
    },
    windSpeed: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/windSpeed'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/windSpeed'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/windSpeed'].unitCode,
    },
    windDirection: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/windDirection'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/windDirection'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/windDirection'].unitCode,
    },
    precipitation: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/precipitation'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/precipitation'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/precipitation'].unitCode,
    },
    atmosphericPressure: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/atmosphericPressure'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/atmosphericPressure'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/atmosphericPressure'].unitCode,
    },
    visibility: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/visibility'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/visibility'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/visibility'].unitCode,
    },
    uVIndexMax: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/uVIndexMax'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/uVIndexMax'].observedAt,
    },
    weatherType: {
      value: decodeUnicode(ngsiData['https://smartdatamodels.org/dataModel.Weather/weatherType'].value),
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/weatherType'].observedAt,
    },
    source: ngsiData['https://smartdatamodels.org/source'].value,
    description: ngsiData.description.value,
  };
}

export const useWeatherData = (): UseWeatherDataReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/weather/latest`
        );
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const apiData: WeatherAPIResponse = await response.json();
        
        // Transform NGSI-LD data to simplified structure
        const transformedData: WeatherData = {
          success: apiData.success,
          code: apiData.code,
          message: apiData.message,
          error: apiData.error,
          result: transformNGSILDToWeather(apiData.result),
        };
        
        setWeatherData(transformedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching weather data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  return { weatherData, loading, error };
};
