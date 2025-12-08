/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { AirQualityAPIResponse, AirQualityStation, NGSILDAirQualityStation } from '@/types/airQuality';

const getApiBaseUrl = () => {
  // Check if we're on the server
  if (typeof window === 'undefined') {
    if (process.env.API_URL) {
      return process.env.API_URL;
    }
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '');
    }
    return 'http://localhost:8000';
  }
  // Client-side
  return process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api$/, '')
    : 'http://localhost:8000';
};

/**
 * Transform NGSI-LD formatted data to simplified structure
 */
function transformNGSILDToStation(ngsiData: NGSILDAirQualityStation): AirQualityStation {
  return {
    id: ngsiData.id,
    type: ngsiData.type,
    location: {
      type: ngsiData.location.value.type,
      coordinates: ngsiData.location.value.coordinates,
    },
    dateObserved: ngsiData['https://smartdatamodels.org/dateObserved'].value,
    address: ngsiData['https://smartdatamodels.org/address'].value,
    airQualityIndex: {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/airQualityIndex'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/airQualityIndex'].observedAt,
    },
    airQualityLevel: ngsiData['https://smartdatamodels.org/dataModel.Environment/airQualityLevel'].value,
    areaServed: ngsiData['https://smartdatamodels.org/areaServed'].value,
    name: ngsiData['https://smartdatamodels.org/name'].value,
    pm1: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm1'] ? {
      value: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm1'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm1'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm1'].unitCode,
    } : undefined,
    pm10: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm10'] ? {
      value: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm10'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm10'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm10'].unitCode,
    } : undefined,
    pm25: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm25'] ? {
      value: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm25'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm25'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Environment/pm25'].unitCode,
    } : undefined,
    co: ngsiData['https://smartdatamodels.org/dataModel.Environment/co'] ? {
      value: ngsiData['https://smartdatamodels.org/dataModel.Environment/co'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/co'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Environment/co'].unitCode,
    } : undefined,
    no2: ngsiData['https://smartdatamodels.org/dataModel.Environment/no2'] ? {
      value: ngsiData['https://smartdatamodels.org/dataModel.Environment/no2'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/no2'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Environment/no2'].unitCode,
    } : undefined,
    o3: ngsiData['https://smartdatamodels.org/dataModel.Environment/o3'] ? {
      value: ngsiData['https://smartdatamodels.org/dataModel.Environment/o3'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/o3'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Environment/o3'].unitCode,
    } : undefined,
    so2: ngsiData['https://smartdatamodels.org/dataModel.Environment/so2'] ? {
      value: ngsiData['https://smartdatamodels.org/dataModel.Environment/so2'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Environment/so2'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Environment/so2'].unitCode,
    } : undefined,
    relativeHumidity: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'] ? {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/relativeHumidity'].unitCode,
    } : undefined,
    temperature: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'] ? {
      value: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].value,
      observedAt: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].observedAt,
      unitCode: ngsiData['https://smartdatamodels.org/dataModel.Weather/temperature'].unitCode,
    } : undefined,
    source: ngsiData['https://smartdatamodels.org/source'].value,
  };
}

/**
 * Fetch latest air quality data from all stations
 */
export async function getLatestAirQuality(): Promise<AirQualityStation[]> {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/v1/air-quality/latest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure we always get fresh data
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: AirQualityAPIResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch air quality data');
    }

    // Transform NGSI-LD data to simplified structure
    return data.result.items.map(transformNGSILDToStation);
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
}

/**
 * Fetch air quality data for a specific station
 */
export async function getStationAirQuality(stationId: string): Promise<AirQualityStation> {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/v1/air-quality/station/${stationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch station data');
    }

    if (!data.result) {
      throw new Error('No data found for this station');
    }

    // The station endpoint returns result as a single object, not an array
    // Transform NGSI-LD data to simplified structure
    return transformNGSILDToStation(data.result);
  } catch (error) {
    console.error('Error fetching station air quality data:', error);
    throw error;
  }
}

/**
 * Calculate overview statistics from stations data
 */
export function calculateAirQualityOverview(stations: AirQualityStation[]) {
  if (!stations || stations.length === 0) {
    return {
      averageAqi: 0,
      goodStations: 0,
      moderateStations: 0,
      unhealthyStations: 0,
      totalStations: 0,
    };
  }

  const totalAqi = stations.reduce((sum, station) => sum + station.airQualityIndex.value, 0);
  const averageAqi = totalAqi / stations.length;

  const goodStations = stations.filter((s) => s.airQualityIndex.value <= 50).length;
  const moderateStations = stations.filter(
    (s) => s.airQualityIndex.value > 50 && s.airQualityIndex.value <= 100
  ).length;
  const unhealthyStations = stations.filter((s) => s.airQualityIndex.value > 100).length;

  return {
    averageAqi,
    goodStations,
    moderateStations,
    unhealthyStations,
    totalStations: stations.length,
  };
}

/**
 * Get main pollutants data from stations
 */
export function extractPollutantsData(stations: AirQualityStation[]) {
  if (!stations || stations.length === 0) {
    return [];
  }

  const pollutants: { [key: string]: { values: number[]; unit: string } } = {
    PM25: { values: [], unit: 'µg/m³' },
    PM10: { values: [], unit: 'µg/m³' },
    PM1: { values: [], unit: 'µg/m³' },
    CO: { values: [], unit: 'ppm' },
    NO2: { values: [], unit: 'ppb' },
    O3: { values: [], unit: 'ppb' },
    SO2: { values: [], unit: 'ppb' },
  };

  stations.forEach((station) => {
    if (station.pm25) pollutants.PM25.values.push(station.pm25.value);
    if (station.pm10) pollutants.PM10.values.push(station.pm10.value);
    if (station.pm1) pollutants.PM1.values.push(station.pm1.value);
    if (station.co) pollutants.CO.values.push(station.co.value);
    if (station.no2) pollutants.NO2.values.push(station.no2.value);
    if (station.o3) pollutants.O3.values.push(station.o3.value);
    if (station.so2) pollutants.SO2.values.push(station.so2.value);
  });

  return Object.entries(pollutants)
    .filter(([_, data]) => data.values.length > 0)
    .map(([name, data]) => {
      const average = data.values.reduce((a, b) => a + b, 0) / data.values.length;
      return {
        name,
        value: Number(average.toFixed(2)),
        unit: data.unit,
        trend: 0, // TODO: Calculate trend if historical data is available
      };
    });
}

/**
 * Format station data for display
 */
export function formatStationForDisplay(station: AirQualityStation) {
  return {
    id: station.id,
    name: station.name,
    areaServed: station.areaServed,
    location: {
      lat: station.location.coordinates[1],
      lng: station.location.coordinates[0],
    },
    aqi: station.airQualityIndex.value,
    level: station.airQualityLevel,
    lastUpdate: new Date(station.dateObserved['@value']),
    pollutants: {
      pm25: station.pm25?.value,
      pm10: station.pm10?.value,
      pm1: station.pm1?.value,
      co: station.co?.value,
      no2: station.no2?.value,
      o3: station.o3?.value,
      so2: station.so2?.value,
    },
    weather: {
      temperature: station.temperature?.value,
      humidity: station.relativeHumidity?.value ? station.relativeHumidity.value * 100 : undefined,
    },
    address: station.address,
    source: station.source,
  };
}
