/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

export type AirQualityLevel = 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous';

export interface AirQualityValue {
  value: number;
  observedAt: string;
  unitCode: string;
}

export interface AirQualityAddress {
  addressCountry: string;
  addressLocality: string;
}

export interface AirQualityLocation {
  coordinates: [number, number]; // [longitude, latitude]
  type: 'Point';
}

export interface AirQualityStation {
  id: string;
  type: string;
  '@context': string;
  location: AirQualityLocation;
  dateObserved: {
    '@type': string;
    '@value': string;
  };
  address: AirQualityAddress;
  airQualityIndex: AirQualityValue;
  airQualityLevel: AirQualityLevel;
  areaServed: string;
  name: string;
  pm1?: AirQualityValue;
  pm10?: AirQualityValue;
  pm25?: AirQualityValue;
  relativeHumidity?: AirQualityValue;
  source: string;
  temperature?: AirQualityValue;
  co?: AirQualityValue;
  no2?: AirQualityValue;
  o3?: AirQualityValue;
  so2?: AirQualityValue;
}

export interface AirQualityAPIResponse {
  success: boolean;
  code: number;
  message: string;
  error: null | string;
  result: {
    total: number;
    items: AirQualityStation[];
  };
}

// Utility function to get AQI level from value
export function getAQILevel(aqi: number): AirQualityLevel {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy_sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'very_unhealthy';
  return 'hazardous';
}

// Utility function to get AQI color
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00e400';
  if (aqi <= 100) return '#ffff00';
  if (aqi <= 150) return '#ff7e00';
  if (aqi <= 200) return '#ff0000';
  if (aqi <= 300) return '#8f3f97';
  return '#7e0023';
}

// Utility function to get AQI label
export function getAQILabel(aqi: number): string {
  if (aqi <= 50) return 'Tốt';
  if (aqi <= 100) return 'Trung bình';
  if (aqi <= 150) return 'Kém (Nhạy cảm)';
  if (aqi <= 200) return 'Kém';
  if (aqi <= 300) return 'Rất kém';
  return 'Nguy hại';
}
