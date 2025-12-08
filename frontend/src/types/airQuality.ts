/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

export type AirQualityLevel = 'good' | 'moderate' | 'unhealthyForSensitiveGroups' | 'unhealthy' | 'veryUnhealthy' | 'hazardous';

export interface AirQualityValue {
  value: number;
  observedAt?: string;
  unitCode?: string;
}

export interface AirQualityAddress {
  addressCountry: string;
  addressLocality: string;
}

export interface AirQualityLocation {
  coordinates: [number, number]; // [longitude, latitude]
  type: 'Point';
}

// NGSI-LD formatted response from API
export interface NGSILDAirQualityStation {
  '@context': string;
  id: string;
  type: string;
  location: {
    type: string;
    value: {
      coordinates: [number, number];
      type: string;
    };
  };
  'https://smartdatamodels.org/dateObserved': {
    type: string;
    value: {
      '@type': string;
      '@value': string;
    };
  };
  'https://smartdatamodels.org/address': {
    type: string;
    value: AirQualityAddress;
  };
  'https://smartdatamodels.org/dataModel.Weather/airQualityIndex': {
    type: string;
    value: number;
    observedAt: string;
  };
  'https://smartdatamodels.org/dataModel.Environment/airQualityLevel': {
    type: string;
    value: AirQualityLevel;
  };
  'https://smartdatamodels.org/areaServed': {
    type: string;
    value: string;
  };
  'https://smartdatamodels.org/name': {
    type: string;
    value: string;
  };
  'https://smartdatamodels.org/dataModel.Environment/pm1'?: {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Environment/pm10'?: {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Environment/pm25'?: {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/relativeHumidity'?: {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/source': {
    type: string;
    value: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/temperature'?: {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Environment/co'?: {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Environment/no2'?: {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Environment/o3'?: {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Environment/so2'?: {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
}

// Simplified structure for internal use
export interface AirQualityStation {
  id: string;
  type: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
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
    items: NGSILDAirQualityStation[];
  };
}

// Utility function to get AQI level from value
export function getAQILevel(aqi: number): AirQualityLevel {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthyForSensitiveGroups';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'veryUnhealthy';
  return 'hazardous';
}

// Utility function to get AQI color
export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00e400';
  if (aqi <= 100) return '#f5a623';
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
