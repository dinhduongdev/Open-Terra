/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

// Routing service for calculating actual road routes using OSRM

export interface RoutePoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteResult {
  distance: number; // in meters
  duration: number; // in seconds
  coordinates: [number, number][]; // route path coordinates
  instructions: RouteInstruction[];
}

export interface RouteInstruction {
  text: string;
  distance: number;
  time: number;
  direction?: string;
}

// OSRM API endpoint (using public OSRM server)
const OSRM_BASE_URL = 'https://router.project-osrm.org';

/**
 * Calculate route between two points using OSRM
 * @param origin Starting point
 * @param destination End point
 * @param profile Transportation profile: 'car', 'bike', or 'foot'
 * @returns Route information including distance, duration, and path
 */
export async function calculateRoute(
  origin: RoutePoint,
  destination: RoutePoint,
  profile: 'car' | 'bike' | 'foot' = 'car'
): Promise<RouteResult | null> {
  try {
    const coordinates = `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`;
    const url = `${OSRM_BASE_URL}/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson&steps=true`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      console.error('No route found');
      return null;
    }

    const route = data.routes[0];
    
    // Extract coordinates from geometry
    const coordinates_path: [number, number][] = route.geometry.coordinates.map(
      (coord: [number, number]) => [coord[1], coord[0]] // Convert [lng, lat] to [lat, lng]
    );

    // Extract turn-by-turn instructions
    const instructions: RouteInstruction[] = [];
    if (route.legs && route.legs[0] && route.legs[0].steps) {
      route.legs[0].steps.forEach((step: any) => {
        instructions.push({
          text: step.maneuver?.modifier 
            ? `${getVietnameseDirection(step.maneuver.type)} ${step.name || ''}`
            : step.name || 'Tiếp tục',
          distance: step.distance,
          time: step.duration,
          direction: step.maneuver?.modifier,
        });
      });
    }

    return {
      distance: route.distance, // meters
      duration: route.duration, // seconds
      coordinates: coordinates_path,
      instructions,
    };
  } catch (error) {
    console.error('Error calculating route:', error);
    return null;
  }
}

/**
 * Calculate route with traffic consideration
 * @param origin Starting point
 * @param destination End point
 * @param trafficMultiplier Traffic delay multiplier (1.0 = no traffic, 2.0 = double time)
 */
export async function calculateRouteWithTraffic(
  origin: RoutePoint,
  destination: RoutePoint,
  trafficMultiplier: number = 1.0
): Promise<RouteResult | null> {
  const route = await calculateRoute(origin, destination, 'car');
  
  if (route) {
    // Adjust duration based on traffic
    route.duration = route.duration * trafficMultiplier;
  }
  
  return route;
}

/**
 * Format distance for display
 * @param meters Distance in meters
 * @returns Formatted string
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/**
 * Format duration for display
 * @param seconds Duration in seconds
 * @returns Formatted string
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  }
  return `${minutes} phút`;
}

/**
 * Calculate estimated arrival time
 * @param durationSeconds Duration in seconds
 * @returns Estimated arrival time
 */
export function calculateArrivalTime(durationSeconds: number): Date {
  const now = new Date();
  return new Date(now.getTime() + durationSeconds * 1000);
}

/**
 * Get Vietnamese direction text
 */
function getVietnameseDirection(maneuverType: string): string {
  const directions: { [key: string]: string } = {
    'turn': 'Rẽ',
    'new name': 'Tiếp tục',
    'depart': 'Xuất phát',
    'arrive': 'Đến nơi',
    'merge': 'Nhập làn',
    'on ramp': 'Lên đường cao tốc',
    'off ramp': 'Xuống đường cao tốc',
    'fork': 'Chọn hướng',
    'end of road': 'Cuối đường',
    'continue': 'Tiếp tục',
    'roundabout': 'Vào vòng xoay',
    'rotary': 'Vào vòng xoay',
    'roundabout turn': 'Rẽ tại vòng xoay',
  };
  
  return directions[maneuverType] || 'Tiếp tục';
}

/**
 * Calculate route between multiple waypoints
 * @param waypoints Array of points to visit
 * @param profile Transportation profile
 * @returns Route information
 */
export async function calculateMultiWaypointRoute(
  waypoints: RoutePoint[],
  profile: 'car' | 'bike' | 'foot' = 'car'
): Promise<RouteResult | null> {
  if (waypoints.length < 2) {
    throw new Error('At least 2 waypoints are required');
  }

  try {
    const coordinates = waypoints
      .map(point => `${point.lng},${point.lat}`)
      .join(';');
    
    const url = `${OSRM_BASE_URL}/route/v1/${profile}/${coordinates}?overview=full&geometries=geojson&steps=true`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OSRM API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      console.error('No route found');
      return null;
    }

    const route = data.routes[0];
    
    const coordinates_path: [number, number][] = route.geometry.coordinates.map(
      (coord: [number, number]) => [coord[1], coord[0]]
    );

    const instructions: RouteInstruction[] = [];
    route.legs.forEach((leg: any) => {
      if (leg.steps) {
        leg.steps.forEach((step: any) => {
          instructions.push({
            text: step.maneuver?.modifier 
              ? `${getVietnameseDirection(step.maneuver.type)} ${step.name || ''}`
              : step.name || 'Tiếp tục',
            distance: step.distance,
            time: step.duration,
            direction: step.maneuver?.modifier,
          });
        });
      }
    });

    return {
      distance: route.distance,
      duration: route.duration,
      coordinates: coordinates_path,
      instructions,
    };
  } catch (error) {
    console.error('Error calculating multi-waypoint route:', error);
    return null;
  }
}

/**
 * Get traffic speed multiplier based on current traffic status
 * @param status Traffic status
 * @returns Speed multiplier
 */
export function getTrafficSpeedMultiplier(status: string): number {
  const multipliers: { [key: string]: number } = {
    'smooth': 1.0,
    'moderate': 1.3,
    'congested': 1.8,
    'heavy': 2.5,
  };
  
  return multipliers[status.toLowerCase()] || 1.0;
}
