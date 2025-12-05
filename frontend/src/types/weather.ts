export interface WeatherProperty {
  value: number | string;
  observedAt: string;
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

export interface WeatherData {
  success: boolean;
  code: number;
  message: string;
  error: null | string;
  result: {
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
  };
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
