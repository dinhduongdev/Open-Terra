/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

export interface FloodZone {
  id: string;
  name: string;
  coordinates: [number, number][];
  level: 'low' | 'medium' | 'high' | 'critical';
  depth: number; // cm
  area: number; // km²
  affectedPopulation: number;
  lastUpdated: string;
}

export interface FloodWarning {
  id: string;
  location: string;
  level: 'warning' | 'danger' | 'critical';
  message: string;
  timestamp: string;
  coordinates: [number, number];
}

export interface FloodStation {
  id: string;
  name: string;
  coordinates: [number, number];
  waterLevel: number; // meters
  alertLevel1: number;
  alertLevel2: number;
  alertLevel3: number;
  status: 'normal' | 'warning' | 'danger' | 'critical';
  lastUpdated: string;
}

export interface FloodOverviewData {
  totalAffectedArea: number; // km²
  totalAffectedPopulation: number;
  averageDepth: number; // cm
  criticalZones: number;
  activeWarnings: number;
}

export interface FloodStatsByTime {
  time: string;
  waterLevel: number;
  rainfall: number;
}

// Mock data for Hanoi flood zones
export const floodZones: FloodZone[] = [
  {
    id: 'zone-1',
    name: 'Khu vực Hồ Tây',
    coordinates: [
      [21.0548, 105.8195],
      [21.0548, 105.8395],
      [21.0648, 105.8395],
      [21.0648, 105.8195],
    ],
    level: 'low',
    depth: 15,
    area: 2.5,
    affectedPopulation: 5000,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'zone-2',
    name: 'Khu vực Hoàn Kiếm',
    coordinates: [
      [21.0278, 105.8492],
      [21.0278, 105.8592],
      [21.0378, 105.8592],
      [21.0378, 105.8492],
    ],
    level: 'medium',
    depth: 35,
    area: 1.8,
    affectedPopulation: 12000,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'zone-3',
    name: 'Khu vực Đông Anh',
    coordinates: [
      [21.1378, 105.8292],
      [21.1378, 105.8492],
      [21.1478, 105.8492],
      [21.1478, 105.8292],
    ],
    level: 'high',
    depth: 55,
    area: 3.2,
    affectedPopulation: 8000,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'zone-4',
    name: 'Khu vực Thanh Trì',
    coordinates: [
      [20.9678, 105.8592],
      [20.9678, 105.8792],
      [20.9778, 105.8792],
      [20.9778, 105.8592],
    ],
    level: 'critical',
    depth: 85,
    area: 4.5,
    affectedPopulation: 15000,
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'zone-5',
    name: 'Khu vực Gia Lâm',
    coordinates: [
      [21.0178, 105.9292],
      [21.0178, 105.9492],
      [21.0278, 105.9492],
      [21.0278, 105.9292],
    ],
    level: 'medium',
    depth: 40,
    area: 2.1,
    affectedPopulation: 7500,
    lastUpdated: '2025-12-04T10:30:00',
  },
];

export const floodWarnings: FloodWarning[] = [
  {
    id: 'warning-1',
    location: 'Khu vực Thanh Trì',
    level: 'critical',
    message: 'Mực nước đang ở mức nguy hiểm. Khuyến cáo di dời khẩn cấp.',
    timestamp: '2025-12-04T10:15:00',
    coordinates: [20.9728, 105.8692],
  },
  {
    id: 'warning-2',
    location: 'Khu vực Đông Anh',
    level: 'danger',
    message: 'Nguy cơ ngập úng cao. Hạn chế di chuyển.',
    timestamp: '2025-12-04T09:45:00',
    coordinates: [21.1428, 105.8392],
  },
  {
    id: 'warning-3',
    location: 'Khu vực Hoàn Kiếm',
    level: 'warning',
    message: 'Mực nước tăng cao. Theo dõi tình hình.',
    timestamp: '2025-12-04T09:30:00',
    coordinates: [21.0328, 105.8542],
  },
  {
    id: 'warning-4',
    location: 'Khu vực Gia Lâm',
    level: 'warning',
    message: 'Có khả năng ngập úng trong vài giờ tới.',
    timestamp: '2025-12-04T10:00:00',
    coordinates: [21.0228, 105.9392],
  },
];

export const floodStations: FloodStation[] = [
  {
    id: 'station-1',
    name: 'Trạm Hồng Hà - Long Biên',
    coordinates: [21.0452, 105.8917],
    waterLevel: 3.2,
    alertLevel1: 3.5,
    alertLevel2: 4.0,
    alertLevel3: 4.5,
    status: 'normal',
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-2',
    name: 'Trạm Tây Hồ',
    coordinates: [21.0598, 105.8295],
    waterLevel: 2.8,
    alertLevel1: 3.0,
    alertLevel2: 3.5,
    alertLevel3: 4.0,
    status: 'warning',
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-3',
    name: 'Trạm Thanh Trì',
    coordinates: [20.9728, 105.8692],
    waterLevel: 4.2,
    alertLevel1: 3.0,
    alertLevel2: 3.5,
    alertLevel3: 4.0,
    status: 'critical',
    lastUpdated: '2025-12-04T10:30:00',
  },
  {
    id: 'station-4',
    name: 'Trạm Đông Anh',
    coordinates: [21.1428, 105.8392],
    waterLevel: 3.8,
    alertLevel1: 3.0,
    alertLevel2: 3.5,
    alertLevel3: 4.0,
    status: 'danger',
    lastUpdated: '2025-12-04T10:30:00',
  },
];

export const floodOverview: FloodOverviewData = {
  totalAffectedArea: 14.1,
  totalAffectedPopulation: 47500,
  averageDepth: 46,
  criticalZones: 1,
  activeWarnings: 4,
};

export const floodStatsByTime: FloodStatsByTime[] = [
  { time: '00:00', waterLevel: 2.5, rainfall: 5 },
  { time: '03:00', waterLevel: 2.8, rainfall: 8 },
  { time: '06:00', waterLevel: 3.2, rainfall: 12 },
  { time: '09:00', waterLevel: 3.6, rainfall: 15 },
  { time: '12:00', waterLevel: 3.9, rainfall: 10 },
  { time: '15:00', waterLevel: 3.5, rainfall: 7 },
  { time: '18:00', waterLevel: 3.2, rainfall: 4 },
  { time: '21:00', waterLevel: 2.9, rainfall: 3 },
];
