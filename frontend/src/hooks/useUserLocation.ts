/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { useEffect, useState } from 'react';

interface UseUserLocationReturn {
  userLocation: [number, number];
  locationError: string | null;
}

const DEFAULT_LOCATION: [number, number] = [21.0285, 105.8542]; // Hanoi

export const useUserLocation = (
  providedCenter?: [number, number]
): UseUserLocationReturn => {
  const [userLocation, setUserLocation] = useState<[number, number]>(
    providedCenter || DEFAULT_LOCATION
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!providedCenter && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(error.message);
        }
      );
    }
  }, [providedCenter]);

  return { userLocation, locationError };
};
