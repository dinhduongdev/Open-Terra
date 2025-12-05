import { useState, useEffect } from 'react';
import { WeatherStatisticsData } from '@/types/weather';

interface UseWeatherStatisticsParams {
  startTime: string;
  endTime: string;
  attributes: string;
}

interface UseWeatherStatisticsReturn {
  statisticsData: WeatherStatisticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useWeatherStatistics = ({
  startTime,
  endTime,
  attributes,
}: UseWeatherStatisticsParams): UseWeatherStatisticsReturn => {
  const [statisticsData, setStatisticsData] = useState<WeatherStatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        start_time: startTime,
        end_time: endTime,
        attributes: attributes,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/weather/statistics?${params}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: WeatherStatisticsData = await response.json();
      setStatisticsData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching weather statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startTime && endTime && attributes) {
      fetchStatistics();
    }
  }, [startTime, endTime, attributes]);

  return { statisticsData, loading, error, refetch: fetchStatistics };
};
