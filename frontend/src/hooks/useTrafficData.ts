/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { useEffect, useState } from 'react';
import { TrafficSegment, subscribeToTrafficUpdates } from '@/services/trafficService';

export const useTrafficData = (updateInterval: number = 30000) => {
  const [trafficData, setTrafficData] = useState<TrafficSegment[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToTrafficUpdates((data) => {
      setTrafficData(data);
    }, updateInterval);

    return unsubscribe;
  }, [updateInterval]);

  return trafficData;
};
