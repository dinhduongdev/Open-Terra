/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

// Mock data for Weather page

export interface WeatherCurrent {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: string;
  cloudCover: number;
  visibility: number;
  uvIndex: number;
  condition: string;
  icon: string;
  lastUpdated: string;
}

export interface WeatherForecast {
  date: string;
  dayOfWeek: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: string;
  icon: string;
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  startTime: string;
  endTime: string;
  affectedAreas: string[];
}

export interface WeatherStation {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  rainfall: number;
  status: 'active' | 'inactive' | 'maintenance';
}

// Current weather data
export const currentWeather: WeatherCurrent = {
  temperature: 28,
  feelsLike: 32,
  humidity: 75,
  pressure: 1013,
  windSpeed: 12,
  windDirection: 'Đông Nam',
  cloudCover: 40,
  visibility: 10,
  uvIndex: 7,
  condition: 'Có mây',
  icon: '⛅',
  lastUpdated: '2025-12-04T14:30:00',
};

// 7-day forecast
export const weeklyForecast: WeatherForecast[] = [
  {
    date: '2025-12-04',
    dayOfWeek: 'Thứ 4',
    tempMax: 30,
    tempMin: 24,
    humidity: 75,
    precipitation: 20,
    windSpeed: 12,
    condition: 'Có mây',
    icon: '⛅',
  },
  {
    date: '2025-12-05',
    dayOfWeek: 'Thứ 5',
    tempMax: 29,
    tempMin: 23,
    humidity: 80,
    precipitation: 60,
    windSpeed: 15,
    condition: 'Mưa rào',
    icon: '',
  },
  {
    date: '2025-12-06',
    dayOfWeek: 'Thứ 6',
    tempMax: 31,
    tempMin: 25,
    humidity: 70,
    precipitation: 10,
    windSpeed: 10,
    condition: 'Nắng',
    icon: '☀️',
  },
  {
    date: '2025-12-07',
    dayOfWeek: 'Thứ 7',
    tempMax: 32,
    tempMin: 26,
    humidity: 65,
    precipitation: 5,
    windSpeed: 8,
    condition: 'Nắng',
    icon: '☀️',
  },
  {
    date: '2025-12-08',
    dayOfWeek: 'CN',
    tempMax: 33,
    tempMin: 27,
    humidity: 68,
    precipitation: 15,
    windSpeed: 9,
    condition: 'Nắng ráo',
    icon: '🌤️',
  },
  {
    date: '2025-12-09',
    dayOfWeek: 'Thứ 2',
    tempMax: 31,
    tempMin: 25,
    humidity: 75,
    precipitation: 40,
    windSpeed: 14,
    condition: 'Mưa nhỏ',
    icon: '🌦️',
  },
  {
    date: '2025-12-10',
    dayOfWeek: 'Thứ 3',
    tempMax: 29,
    tempMin: 24,
    humidity: 82,
    precipitation: 70,
    windSpeed: 16,
    condition: 'Mưa',
    icon: '',
  },
];

// Hourly forecast (24 hours)
export const hourlyForecast: HourlyForecast[] = [
  { time: '00:00', temperature: 24, humidity: 78, precipitation: 10, windSpeed: 8, condition: 'Có mây', icon: '⛅' },
  { time: '03:00', temperature: 23, humidity: 82, precipitation: 5, windSpeed: 7, condition: 'Có mây', icon: '⛅' },
  { time: '06:00', temperature: 23, humidity: 85, precipitation: 0, windSpeed: 6, condition: 'Có mây', icon: '⛅' },
  { time: '09:00', temperature: 26, humidity: 75, precipitation: 0, windSpeed: 9, condition: 'Nắng ráo', icon: '🌤️' },
  { time: '12:00', temperature: 29, humidity: 68, precipitation: 5, windSpeed: 12, condition: 'Nắng', icon: '☀️' },
  { time: '15:00', temperature: 30, humidity: 65, precipitation: 10, windSpeed: 14, condition: 'Nắng', icon: '☀️' },
  { time: '18:00', temperature: 27, humidity: 72, precipitation: 20, windSpeed: 11, condition: 'Có mây', icon: '⛅' },
  { time: '21:00', temperature: 25, humidity: 76, precipitation: 15, windSpeed: 9, condition: 'Có mây', icon: '⛅' },
];

// Weather alerts
export const weatherAlerts: WeatherAlert[] = [
  {
    id: 'alert-1',
    type: 'warning',
    title: 'Cảnh báo mưa lớn',
    description: 'Dự báo có mưa vừa đến mưa to trong khoảng thời gian từ 14:00 đến 18:00 ngày mai. Lượng mưa có thể đạt 50-100mm.',
    severity: 'high',
    startTime: '2025-12-05T14:00:00',
    endTime: '2025-12-05T18:00:00',
    affectedAreas: ['Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Đống Đa', 'Quận Hai Bà Trưng'],
  },
  {
    id: 'alert-2',
    type: 'advisory',
    title: 'Cảnh báo nhiệt độ cao',
    description: 'Nhiệt độ có thể lên đến 35-37°C trong các ngày tới. Khuyến cáo hạn chế hoạt động ngoài trời vào giữa trưa.',
    severity: 'medium',
    startTime: '2025-12-06T11:00:00',
    endTime: '2025-12-08T16:00:00',
    affectedAreas: ['Toàn thành phố'],
  },
];

// Weather stations
export const weatherStations: WeatherStation[] = [
  {
    id: 'station-1',
    name: 'Trạm Ba Đình',
    location: 'Quận Ba Đình',
    coordinates: { lat: 21.0285, lng: 105.8355 },
    temperature: 28,
    humidity: 75,
    pressure: 1013,
    windSpeed: 12,
    rainfall: 0,
    status: 'active',
  },
  {
    id: 'station-2',
    name: 'Trạm Hoàn Kiếm',
    location: 'Quận Hoàn Kiếm',
    coordinates: { lat: 21.0285, lng: 105.8542 },
    temperature: 29,
    humidity: 73,
    pressure: 1012,
    windSpeed: 11,
    rainfall: 0,
    status: 'active',
  },
  {
    id: 'station-3',
    name: 'Trạm Cầu Giấy',
    location: 'Quận Cầu Giấy',
    coordinates: { lat: 21.0333, lng: 105.8000 },
    temperature: 27,
    humidity: 77,
    pressure: 1014,
    windSpeed: 10,
    rainfall: 2,
    status: 'active',
  },
  {
    id: 'station-4',
    name: 'Trạm Đống Đa',
    location: 'Quận Đống Đa',
    coordinates: { lat: 21.0144, lng: 105.8294 },
    temperature: 28,
    humidity: 74,
    pressure: 1013,
    windSpeed: 13,
    rainfall: 0,
    status: 'active',
  },
  {
    id: 'station-5',
    name: 'Trạm Hai Bà Trưng',
    location: 'Quận Hai Bà Trưng',
    coordinates: { lat: 21.0067, lng: 105.8478 },
    temperature: 29,
    humidity: 72,
    pressure: 1012,
    windSpeed: 14,
    rainfall: 0,
    status: 'active',
  },
  {
    id: 'station-6',
    name: 'Trạm Tây Hồ',
    location: 'Quận Tây Hồ',
    coordinates: { lat: 21.0583, lng: 105.8194 },
    temperature: 27,
    humidity: 78,
    pressure: 1014,
    windSpeed: 9,
    rainfall: 1,
    status: 'active',
  },
];

// Weather statistics for charts
export const temperatureStats = [
  { time: '00:00', temp: 24, avgTemp: 23 },
  { time: '03:00', temp: 23, avgTemp: 22 },
  { time: '06:00', temp: 23, avgTemp: 23 },
  { time: '09:00', temp: 26, avgTemp: 25 },
  { time: '12:00', temp: 29, avgTemp: 28 },
  { time: '15:00', temp: 30, avgTemp: 30 },
  { time: '18:00', temp: 27, avgTemp: 28 },
  { time: '21:00', temp: 25, avgTemp: 25 },
];

export const humidityStats = [
  { time: '00:00', humidity: 78 },
  { time: '03:00', humidity: 82 },
  { time: '06:00', humidity: 85 },
  { time: '09:00', humidity: 75 },
  { time: '12:00', humidity: 68 },
  { time: '15:00', humidity: 65 },
  { time: '18:00', humidity: 72 },
  { time: '21:00', humidity: 76 },
];

export const rainfallStats = [
  { day: 'T2', rainfall: 15 },
  { day: 'T3', rainfall: 30 },
  { day: 'T4', rainfall: 5 },
  { day: 'T5', rainfall: 45 },
  { day: 'T6', rainfall: 2 },
  { day: 'T7', rainfall: 8 },
  { day: 'CN', rainfall: 20 },
];
