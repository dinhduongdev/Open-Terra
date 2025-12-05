/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

// Mock data service for real-time traffic information

export type TrafficStatus = 'smooth' | 'moderate' | 'congested' | 'heavy';

export interface TrafficSegment {
  id: string;
  name: string;
  coordinates: [number, number][];
  status: TrafficStatus;
  speed: number; // km/h
  vehicleCount: number;
  lastUpdate: Date;
}

// Define major traffic routes in Hanoi with their coordinates following actual roads
const trafficRoutes: Omit<TrafficSegment, 'status' | 'speed' | 'vehicleCount' | 'lastUpdate'>[] = [
  {
    id: 'lang-ha',
    name: 'Đường Láng - Láng Hạ',
    coordinates: [
      [21.0289, 105.8045],
      [21.0276, 105.8065],
      [21.0263, 105.8085],
      [21.0250, 105.8105],
      [21.0237, 105.8125],
      [21.0224, 105.8145],
      [21.0211, 105.8165],
      [21.0198, 105.8185],
      [21.0185, 105.8205],
      [21.0172, 105.8225],
    ],
  },
  {
    id: 'nhat-tan-bridge',
    name: 'Cầu Nhật Tân',
    coordinates: [
      [21.0838, 105.7461],
      [21.0852, 105.7478],
      [21.0866, 105.7495],
      [21.0880, 105.7512],
      [21.0894, 105.7529],
      [21.0908, 105.7546],
      [21.0922, 105.7563],
      [21.0936, 105.7580],
      [21.0950, 105.7597],
    ],
  },
  {
    id: 'pho-hue',
    name: 'Phố Huế',
    coordinates: [
      [21.0168, 105.8516],
      [21.0175, 105.8510],
      [21.0182, 105.8504],
      [21.0189, 105.8498],
      [21.0196, 105.8492],
      [21.0203, 105.8486],
      [21.0210, 105.8480],
      [21.0217, 105.8474],
      [21.0224, 105.8468],
    ],
  },
  {
    id: 'nga-tu-so',
    name: 'Đường Ô Chợ Dừa - Ngã Tư Sở',
    coordinates: [
      [21.0122, 105.8268],
      [21.0129, 105.8275],
      [21.0136, 105.8282],
      [21.0143, 105.8289],
      [21.0150, 105.8296],
      [21.0157, 105.8303],
      [21.0164, 105.8310],
      [21.0171, 105.8317],
      [21.0178, 105.8324],
    ],
  },
  {
    id: 'thang-long-avenue',
    name: 'Đại lộ Thăng Long',
    coordinates: [
      [21.0533, 105.7821],
      [21.0520, 105.7805],
      [21.0507, 105.7789],
      [21.0494, 105.7773],
      [21.0481, 105.7757],
      [21.0468, 105.7741],
      [21.0455, 105.7725],
      [21.0442, 105.7709],
      [21.0429, 105.7693],
      [21.0416, 105.7677],
      [21.0403, 105.7661],
    ],
  },
  {
    id: 'giai-phong',
    name: 'Giải Phóng',
    coordinates: [
      [20.9998, 105.8456],
      [21.0006, 105.8467],
      [21.0014, 105.8478],
      [21.0022, 105.8489],
      [21.0030, 105.8500],
      [21.0038, 105.8511],
      [21.0046, 105.8522],
      [21.0054, 105.8533],
      [21.0062, 105.8544],
      [21.0070, 105.8555],
      [21.0078, 105.8566],
    ],
  },
  {
    id: 'nguyen-trai',
    name: 'Nguyễn Trãi',
    coordinates: [
      [20.9989, 105.8234],
      [20.9996, 105.8244],
      [21.0003, 105.8254],
      [21.0010, 105.8264],
      [21.0017, 105.8274],
      [21.0024, 105.8284],
      [21.0031, 105.8294],
      [21.0038, 105.8304],
      [21.0045, 105.8314],
      [21.0052, 105.8324],
      [21.0059, 105.8334],
    ],
  },
  {
    id: 'ring-road-3',
    name: 'Vành đai 3 - Phạm Văn Đồng',
    coordinates: [
      [21.0678, 105.8123],
      [21.0690, 105.8115],
      [21.0702, 105.8107],
      [21.0714, 105.8099],
      [21.0726, 105.8091],
      [21.0738, 105.8083],
      [21.0750, 105.8075],
      [21.0762, 105.8067],
      [21.0774, 105.8059],
      [21.0786, 105.8051],
    ],
  },
  {
    id: 'tran-duy-hung',
    name: 'Trần Duy Hưng',
    coordinates: [
      [21.0045, 105.8123],
      [21.0052, 105.8133],
      [21.0059, 105.8143],
      [21.0066, 105.8153],
      [21.0073, 105.8163],
      [21.0080, 105.8173],
      [21.0087, 105.8183],
      [21.0094, 105.8193],
      [21.0101, 105.8203],
      [21.0108, 105.8213],
    ],
  },
  {
    id: 'kim-ma',
    name: 'Kim Mã - Nguyễn Chí Thanh',
    coordinates: [
      [21.0289, 105.8267],
      [21.0296, 105.8260],
      [21.0303, 105.8253],
      [21.0310, 105.8246],
      [21.0317, 105.8239],
      [21.0324, 105.8232],
      [21.0331, 105.8225],
      [21.0338, 105.8218],
      [21.0345, 105.8211],
    ],
  },
  {
    id: 'cau-giay',
    name: 'Cầu Giấy - Xuân Thủy',
    coordinates: [
      [21.0345, 105.7945],
      [21.0352, 105.7955],
      [21.0359, 105.7965],
      [21.0366, 105.7975],
      [21.0373, 105.7985],
      [21.0380, 105.7995],
      [21.0387, 105.8005],
      [21.0394, 105.8015],
    ],
  },
  {
    id: 'hoang-quoc-viet',
    name: 'Hoàng Quốc Việt',
    coordinates: [
      [21.0456, 105.7889],
      [21.0463, 105.7899],
      [21.0470, 105.7909],
      [21.0477, 105.7919],
      [21.0484, 105.7929],
      [21.0491, 105.7939],
      [21.0498, 105.7949],
      [21.0505, 105.7959],
    ],
  },
];

// Generate random traffic status with weighted probabilities
function getRandomTrafficStatus(): TrafficStatus {
  const rand = Math.random();
  if (rand < 0.3) return 'smooth';
  if (rand < 0.6) return 'moderate';
  if (rand < 0.85) return 'congested';
  return 'heavy';
}

// Generate speed based on traffic status
function getSpeedForStatus(status: TrafficStatus): number {
  const baseSpeed = {
    smooth: { min: 50, max: 70 },
    moderate: { min: 30, max: 50 },
    congested: { min: 15, max: 30 },
    heavy: { min: 5, max: 15 },
  };
  
  const range = baseSpeed[status];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

// Generate vehicle count based on traffic status
function getVehicleCountForStatus(status: TrafficStatus): number {
  const baseCount = {
    smooth: { min: 50, max: 150 },
    moderate: { min: 150, max: 300 },
    congested: { min: 300, max: 450 },
    heavy: { min: 450, max: 600 },
  };
  
  const range = baseCount[status];
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

// Generate mock traffic data
function generateTrafficData(): TrafficSegment[] {
  return trafficRoutes.map(route => {
    const status = getRandomTrafficStatus();
    return {
      ...route,
      status,
      speed: getSpeedForStatus(status),
      vehicleCount: getVehicleCountForStatus(status),
      lastUpdate: new Date(),
    };
  });
}

// Simulate real-time traffic data updates
export function useTrafficData(updateInterval: number = 30000) {
  // In a real application, this would fetch from an API
  // For now, we generate mock data
  return generateTrafficData();
}

// Get current traffic data (mock)
export function getCurrentTrafficData(): TrafficSegment[] {
  return generateTrafficData();
}

// Get traffic color based on status
export function getTrafficColor(status: TrafficStatus): string {
  const colors = {
    smooth: '#22c55e',      // Green
    moderate: '#eab308',    // Yellow
    congested: '#f97316',   // Orange
    heavy: '#dc2626',       // Red
  };
  return colors[status];
}

// Get traffic status label
export function getTrafficStatusLabel(status: TrafficStatus): string {
  const labels = {
    smooth: 'Thông thoáng',
    moderate: 'Di chuyển chậm',
    congested: 'Kẹt xe nhẹ',
    heavy: 'Kẹt xe nghiêm trọng',
  };
  return labels[status];
}

// Update traffic data every N seconds (simulated)
export function subscribeToTrafficUpdates(
  callback: (data: TrafficSegment[]) => void,
  interval: number = 30000
): () => void {
  // Initial data
  callback(generateTrafficData());
  
  // Set up interval for updates
  const intervalId = setInterval(() => {
    callback(generateTrafficData());
  }, interval);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}
