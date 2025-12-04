export interface TrafficOverviewData {
  totalVehicles: number;
  averageSpeed: number;
  congestionLevel: string;
  lastUpdate: string;
}

export interface TrafficHotspot {
  id: number;
  location: string;
  status: string;
  avgSpeed: number;
  vehicleCount: number;
  coordinates: [number, number];
}

export interface TrafficIncident {
  id: number;
  type: string;
  location: string;
  description: string;
  time: string;
  severity: 'minor' | 'moderate' | 'high';
}

export interface TrafficStatByTime {
  time: string;
  vehicles: number;
  status: string;
}

export interface RouteStatistic {
  route: string;
  avgSpeed: number;
  congestion: number;
}

export interface PopularLocation {
  name: string;
  lat: number;
  lng: number;
}

export type TrafficStatus = 'smooth' | 'moderate' | 'congested' | 'heavy';
export type IncidentSeverity = 'minor' | 'moderate' | 'high';
