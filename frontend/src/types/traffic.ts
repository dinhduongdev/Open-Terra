/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

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
