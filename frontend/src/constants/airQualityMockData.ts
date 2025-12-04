// Air Quality Mock Data

export interface AirQualityStation {
  id: string;
  name: string;
  position: [number, number];
  aqi: number;
  level: 'good' | 'moderate' | 'unhealthy-sensitive' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2: number;
    co: number;
  };
  temperature: number;
  humidity: number;
  windSpeed: number;
  lastUpdated: string;
}

export interface AirQualityOverview {
  averageAqi: number;
  level: string;
  totalStations: number;
  goodStations: number;
  moderateStations: number;
  unhealthyStations: number;
  trend: 'improving' | 'worsening' | 'stable';
}

export interface AirQualityStatByTime {
  time: string;
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
}

export interface PollutantInfo {
  name: string;
  value: number;
  unit: string;
  level: string;
  standard: number;
  percentage: number;
}

// Hanoi coordinates
export const airQualityStations: AirQualityStation[] = [
  {
    id: 'station-1',
    name: 'Hoàn Kiếm',
    position: [21.0285, 105.8542],
    aqi: 78,
    level: 'moderate',
    pollutants: {
      pm25: 35,
      pm10: 58,
      o3: 45,
      no2: 28,
      so2: 12,
      co: 0.8,
    },
    temperature: 28,
    humidity: 72,
    windSpeed: 12,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-2',
    name: 'Cầu Giấy',
    position: [21.0333, 105.7942],
    aqi: 125,
    level: 'unhealthy-sensitive',
    pollutants: {
      pm25: 58,
      pm10: 85,
      o3: 62,
      no2: 42,
      so2: 18,
      co: 1.2,
    },
    temperature: 29,
    humidity: 68,
    windSpeed: 8,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-3',
    name: 'Đống Đa',
    position: [21.0145, 105.8267],
    aqi: 95,
    level: 'moderate',
    pollutants: {
      pm25: 42,
      pm10: 68,
      o3: 52,
      no2: 35,
      so2: 15,
      co: 0.9,
    },
    temperature: 27,
    humidity: 75,
    windSpeed: 10,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-4',
    name: 'Hai Bà Trưng',
    position: [21.0068, 105.8511],
    aqi: 68,
    level: 'moderate',
    pollutants: {
      pm25: 28,
      pm10: 48,
      o3: 38,
      no2: 22,
      so2: 10,
      co: 0.6,
    },
    temperature: 28,
    humidity: 70,
    windSpeed: 14,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-5',
    name: 'Tây Hồ',
    position: [21.0583, 105.8250],
    aqi: 52,
    level: 'moderate',
    pollutants: {
      pm25: 22,
      pm10: 38,
      o3: 32,
      no2: 18,
      so2: 8,
      co: 0.5,
    },
    temperature: 27,
    humidity: 78,
    windSpeed: 15,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-6',
    name: 'Long Biên',
    position: [21.0378, 105.8898],
    aqi: 158,
    level: 'unhealthy',
    pollutants: {
      pm25: 72,
      pm10: 105,
      o3: 78,
      no2: 48,
      so2: 22,
      co: 1.5,
    },
    temperature: 29,
    humidity: 65,
    windSpeed: 7,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-7',
    name: 'Thanh Xuân',
    position: [20.9950, 105.8045],
    aqi: 105,
    level: 'unhealthy-sensitive',
    pollutants: {
      pm25: 48,
      pm10: 75,
      o3: 58,
      no2: 38,
      so2: 16,
      co: 1.0,
    },
    temperature: 28,
    humidity: 73,
    windSpeed: 9,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-8',
    name: 'Nam Từ Liêm',
    position: [21.0250, 105.7550],
    aqi: 88,
    level: 'moderate',
    pollutants: {
      pm25: 38,
      pm10: 62,
      o3: 48,
      no2: 32,
      so2: 14,
      co: 0.8,
    },
    temperature: 28,
    humidity: 71,
    windSpeed: 11,
    lastUpdated: '2025-12-04T10:30:00',
  },
];

export const airQualityOverview: AirQualityOverview = {
  averageAqi: 96,
  level: 'Trung bình',
  totalStations: 8,
  goodStations: 0,
  moderateStations: 5,
  unhealthyStations: 3,
  trend: 'stable',
};

export const airQualityStatsByTime: AirQualityStatByTime[] = [
  { time: '00:00', aqi: 82, pm25: 32, pm10: 55, o3: 42 },
  { time: '03:00', aqi: 75, pm25: 28, pm10: 48, o3: 38 },
  { time: '06:00', aqi: 68, pm25: 25, pm10: 42, o3: 35 },
  { time: '09:00', aqi: 85, pm25: 35, pm10: 58, o3: 48 },
  { time: '12:00', aqi: 105, pm25: 48, pm10: 72, o3: 62 },
  { time: '15:00', aqi: 118, pm25: 55, pm10: 82, o3: 68 },
  { time: '18:00', aqi: 125, pm25: 58, pm10: 88, o3: 72 },
  { time: '21:00', aqi: 98, pm25: 42, pm10: 68, o3: 55 },
];

export const mainPollutants: PollutantInfo[] = [
  {
    name: 'PM2.5',
    value: 45,
    unit: 'µg/m³',
    level: 'Trung bình',
    standard: 25,
    percentage: 180,
  },
  {
    name: 'PM10',
    value: 72,
    unit: 'µg/m³',
    level: 'Trung bình',
    standard: 50,
    percentage: 144,
  },
  {
    name: 'O₃',
    value: 55,
    unit: 'µg/m³',
    level: 'Tốt',
    standard: 100,
    percentage: 55,
  },
  {
    name: 'NO₂',
    value: 35,
    unit: 'µg/m³',
    level: 'Tốt',
    standard: 200,
    percentage: 17.5,
  },
  {
    name: 'SO₂',
    value: 15,
    unit: 'µg/m³',
    level: 'Tốt',
    standard: 125,
    percentage: 12,
  },
  {
    name: 'CO',
    value: 0.9,
    unit: 'mg/m³',
    level: 'Tốt',
    standard: 10,
    percentage: 9,
  },
];

export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#00e400'; // Good - Green
  if (aqi <= 100) return '#ffff00'; // Moderate - Yellow
  if (aqi <= 150) return '#ff7e00'; // Unhealthy for Sensitive Groups - Orange
  if (aqi <= 200) return '#ff0000'; // Unhealthy - Red
  if (aqi <= 300) return '#8f3f97'; // Very Unhealthy - Purple
  return '#7e0023'; // Hazardous - Maroon
}

export function getAqiLevel(aqi: number): string {
  if (aqi <= 50) return 'Tốt';
  if (aqi <= 100) return 'Trung bình';
  if (aqi <= 150) return 'Kém (nhóm nhạy cảm)';
  if (aqi <= 200) return 'Kém';
  if (aqi <= 300) return 'Rất kém';
  return 'Nguy hại';
}

export function getAqiLevelEn(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getHealthRecommendation(aqi: number): {
  general: string;
  sensitive: string;
  children: string;
  elderly: string;
} {
  if (aqi <= 50) {
    return {
      general: 'Chất lượng không khí tốt. Thoải mái hoạt động ngoài trời.',
      sensitive: 'Không có ảnh hưởng đến sức khỏe.',
      children: 'Trẻ em có thể vui chơi ngoài trời bình thường.',
      elderly: 'Người cao tuổi có thể hoạt động bình thường.',
    };
  } else if (aqi <= 100) {
    return {
      general: 'Chất lượng không khí chấp nhận được. Có thể hoạt động ngoài trời.',
      sensitive: 'Nhóm nhạy cảm nên hạn chế hoạt động ngoài trời kéo dài.',
      children: 'Trẻ em có thể hoạt động ngoài trời nhưng cần theo dõi.',
      elderly: 'Người cao tuổi nên hạn chế hoạt động ngoài trời kéo dài.',
    };
  } else if (aqi <= 150) {
    return {
      general: 'Giảm hoạt động ngoài trời kéo dài, đặc biệt khi tập thể dục.',
      sensitive: 'Nhóm nhạy cảm nên tránh hoạt động ngoài trời.',
      children: 'Hạn chế cho trẻ em hoạt động ngoài trời.',
      elderly: 'Người cao tuổi nên ở trong nhà và đóng cửa sổ.',
    };
  } else if (aqi <= 200) {
    return {
      general: 'Mọi người nên hạn chế hoạt động ngoài trời.',
      sensitive: 'Nhóm nhạy cảm nên ở trong nhà.',
      children: 'Không cho trẻ em hoạt động ngoài trời.',
      elderly: 'Người cao tuổi nên ở trong nhà và sử dụng máy lọc không khí.',
    };
  } else if (aqi <= 300) {
    return {
      general: 'Mọi người nên tránh hoạt động ngoài trời.',
      sensitive: 'Nhóm nhạy cảm cần ở trong nhà và sử dụng máy lọc không khí.',
      children: 'Giữ trẻ em trong nhà và đóng kín cửa sổ.',
      elderly: 'Người cao tuổi cần ở trong nhà, sử dụng máy lọc không khí.',
    };
  } else {
    return {
      general: 'Cảnh báo sức khỏe khẩn cấp! Mọi người phải ở trong nhà.',
      sensitive: 'Tuyệt đối không ra ngoài. Sử dụng máy lọc không khí.',
      children: 'Giữ trẻ em trong nhà, đóng kín cửa sổ, sử dụng máy lọc không khí.',
      elderly: 'Người cao tuổi cần ở trong nhà, sử dụng máy lọc không khí, hạn chế hoạt động.',
    };
  }
}
