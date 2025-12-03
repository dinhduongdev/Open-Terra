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
