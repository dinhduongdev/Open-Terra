import { 
  TrafficOverviewData, 
  TrafficHotspot, 
  TrafficIncident, 
  TrafficStatByTime, 
  RouteStatistic,
  PopularLocation 
} from '@/types/traffic';

export const trafficOverview: TrafficOverviewData = {
  totalVehicles: 12847,
  averageSpeed: 32,
  congestionLevel: 'Medium',
  lastUpdate: new Date().toLocaleTimeString('vi-VN'),
};

export const trafficHotspots: TrafficHotspot[] = [
  {
    id: 1,
    location: 'Đường Láng - Đống Đa',
    status: 'Congested',
    avgSpeed: 15,
    vehicleCount: 342,
    coordinates: [21.0245, 105.8189],
  },
  {
    id: 2,
    location: 'Cầu Nhật Tân',
    status: 'Moderate',
    avgSpeed: 45,
    vehicleCount: 198,
    coordinates: [21.0838, 105.7461],
  },
  {
    id: 3,
    location: 'Phố Huế - Hai Bà Trưng',
    status: 'Heavy',
    avgSpeed: 10,
    vehicleCount: 456,
    coordinates: [21.0168, 105.8516],
  },
  {
    id: 4,
    location: 'Ngã Tư Sở',
    status: 'Congested',
    avgSpeed: 18,
    vehicleCount: 389,
    coordinates: [21.0122, 105.8268],
  },
  {
    id: 5,
    location: 'Đại lộ Thăng Long',
    status: 'Smooth',
    avgSpeed: 65,
    vehicleCount: 167,
    coordinates: [21.0533, 105.7821],
  },
];

export const trafficIncidents: TrafficIncident[] = [
  {
    id: 1,
    type: 'Accident',
    location: 'Cầu Vượt Láng Hạ',
    description: 'Va chạm nhẹ giữa 2 xe ô tô',
    time: '15 phút trước',
    severity: 'minor',
  },
  {
    id: 2,
    type: 'Road Work',
    location: 'Đường Nguyễn Trãi',
    description: 'Thi công mở rộng đường',
    time: '2 giờ trước',
    severity: 'moderate',
  },
  {
    id: 3,
    type: 'Heavy Traffic',
    location: 'Trần Duy Hưng',
    description: 'Ùn tắc do giờ cao điểm',
    time: '5 phút trước',
    severity: 'high',
  },
];

export const trafficStatsByTime: TrafficStatByTime[] = [
  { time: '06:00 - 09:00', vehicles: 8234, status: 'heavy' },
  { time: '09:00 - 12:00', vehicles: 5621, status: 'moderate' },
  { time: '12:00 - 15:00', vehicles: 4892, status: 'smooth' },
  { time: '15:00 - 18:00', vehicles: 9456, status: 'heavy' },
  { time: '18:00 - 21:00', vehicles: 6743, status: 'congested' },
];

export const routeStatistics: RouteStatistic[] = [
  { route: 'Vành đai 3', avgSpeed: 55, congestion: 25 },
  { route: 'Đại lộ Thăng Long', avgSpeed: 62, congestion: 15 },
  { route: 'Giải Phóng', avgSpeed: 28, congestion: 68 },
  { route: 'Nguyễn Trãi', avgSpeed: 22, congestion: 75 },
  { route: 'Láng - Hòa Lạc', avgSpeed: 48, congestion: 35 },
];

export const popularLocations: PopularLocation[] = [
  { name: 'Hồ Gươm', lat: 21.0285, lng: 105.8542 },
  { name: 'Cầu Nhật Tân', lat: 21.0838, lng: 105.7461 },
  { name: 'Sân bay Nội Bài', lat: 21.2212, lng: 105.8071 },
  { name: 'Mỹ Đình', lat: 21.0285, lng: 105.7653 },
  { name: 'Hồ Tây', lat: 21.0453, lng: 105.8183 },
  { name: 'Láng Hạ', lat: 21.0198, lng: 105.8142 },
];
