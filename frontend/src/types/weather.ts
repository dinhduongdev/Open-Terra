export interface WeatherProperty {
  value: number | string;
  observedAt?: string;
  unitCode?: string;
}

export interface WeatherLocation {
  coordinates: [number, number];
  type: string;
}

export interface WeatherAddress {
  addressCountry: string;
  addressLocality: string;
}

// NGSI-LD formatted response from API
export interface NGSILDWeatherData {
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
    value: WeatherAddress;
  };
  'https://smartdatamodels.org/areaServed': {
    type: string;
    value: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/atmosphericPressure': {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  description: {
    type: string;
    value: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/dewPoint': {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/feelsLikeTemperature': {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/name': {
    type: string;
    value: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/precipitation': {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/relativeHumidity': {
    type: string;
    value: number;
    observedAt: string;
  };
  'https://smartdatamodels.org/source': {
    type: string;
    value: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/temperature': {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/uVIndexMax': {
    type: string;
    value: number;
    observedAt: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/visibility': {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/weatherType': {
    type: string;
    value: string;
    observedAt: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/windDirection': {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
  'https://smartdatamodels.org/dataModel.Weather/windSpeed': {
    type: string;
    value: number;
    observedAt: string;
    unitCode: string;
  };
}

// Simplified structure for internal use
export interface WeatherResult {
  id: string;
  type: string;
  location: WeatherLocation;
  name: string;
  address: WeatherAddress;
  areaServed: string;
  dateObserved: { '@type': string; '@value': string };
  temperature: WeatherProperty;
  feelsLikeTemperature: WeatherProperty;
  relativeHumidity: WeatherProperty;
  dewPoint: WeatherProperty;
  windSpeed: WeatherProperty;
  windDirection: WeatherProperty;
  precipitation: WeatherProperty;
  atmosphericPressure: WeatherProperty;
  visibility: WeatherProperty;
  uVIndexMax: WeatherProperty;
  weatherType: WeatherProperty;
  source: string;
  description: string;
}

export interface WeatherAPIResponse {
  success: boolean;
  code: number;
  message: string;
  error: null | string;
  result: NGSILDWeatherData;
}

export interface WeatherData {
  success: boolean;
  code: number;
  message: string;
  error: null | string;
  result: WeatherResult;
}

export interface AttributeStatistics {
  min: number;
  max: number;
  avg: number;
  count: number;
}

export interface WeatherStatisticsData {
  success: boolean;
  code: number;
  message: string;
  error: null | string;
  result: {
    period: {
      start: string;
      end: string;
      duration_hours: number;
    };
    statistics: {
      temperature: AttributeStatistics;
      relativeHumidity: AttributeStatistics;
      windSpeed: AttributeStatistics;
      atmosphericPressure: AttributeStatistics;
    };
  };
}
