/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  weeklyForecast,
  hourlyForecast,
  weatherStations,
  temperatureStats,
  humidityStats,
  rainfallStats,
} from '@/constants/weatherMockData';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useWeatherStatistics } from '@/hooks/useWeatherStatistics';
import WeatherCurrentCard from '@/components/common/WeatherCurrentCard';
import WeatherForecastComponent from '@/components/common/WeatherForecast';
import WeatherHourlyComponent from '@/components/common/WeatherHourly';
import WeatherStatisticsComponent from '@/components/common/WeatherStatistics';
import WeatherStatisticsAPI from '@/components/common/WeatherStatisticsAPI';
import WeatherMapSection from '@/components/common/WeatherMapSection';
import WeatherTips from '@/components/common/WeatherTips';
import WeatherInfo from '@/components/common/WeatherInfo';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const WeatherMapDynamic = dynamic(() => import('@/components/common/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Đang tải bản đồ...</p>
    </div>
  ),
});

export default function WeatherPage() {
  const t = useTranslations('weather');
  const tSidebar = useTranslations('sidebar');
  const [showStations, setShowStations] = useState(true);
  const { weatherData, loading, error } = useWeatherData();

  // Statistics date range (default: first day of current month to today)
  const getDefaultDates = () => {
    const end = new Date();
    const start = new Date(end.getFullYear(), end.getMonth(), 1); 
    return {
      start: start.toISOString().split('.')[0] + 'Z',
      end: end.toISOString().split('.')[0] + 'Z',
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDates());
  const { statisticsData, loading: statsLoading, error: statsError } = useWeatherStatistics({
    startTime: dateRange.start,
    endTime: dateRange.end,
    attributes: 'temperature,relativeHumidity,windSpeed,atmosphericPressure',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2 sm:gap-3">
            <span className="text-3xl sm:text-4xl">🌤️</span>
            <span className="break-words">{tSidebar('weather')}</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Current Weather Data */}
        <div className="mb-6 sm:mb-8">
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {weatherData && !loading && <WeatherCurrentCard weatherData={weatherData} />}
          {!loading && !error && !weatherData && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-6 text-center">
              <p className="text-yellow-700 text-base sm:text-lg">Không có dữ liệu thời tiết</p>
            </div>
          )}
        </div>

        {/* 7-Day Forecast */}
        {/* <div className="mb-6 sm:mb-8">
          <WeatherForecastComponent forecasts={weeklyForecast} />
        </div> */}

        {/* Hourly Forecast */}
        {/* <div className="mb-6 sm:mb-8">
          <WeatherHourlyComponent forecasts={hourlyForecast} />
        </div> */}

        {/* Weather Statistics API */}
        <div className="mb-6 sm:mb-8">
          {statsLoading && <LoadingSpinner />}
          {statsError && <ErrorMessage message={statsError} />}
          {statisticsData && !statsLoading && (
            <WeatherStatisticsAPI 
              statisticsData={statisticsData}
              startDate={dateRange.start}
              endDate={dateRange.end}
              onDateChange={(start, end) => setDateRange({ start, end })}
            />
          )}
        </div>

        {/* Weather Map */}
        {/* <div className="mb-6 sm:mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6">
          <WeatherMapSection showStations={showStations} onToggle={setShowStations} />
          <WeatherMapDynamic
            stations={weatherStations}
            showStations={showStations}
            onStationLayerToggle={setShowStations}
          />
        </div> */}

        {/* Weather Tips */}
        <div className="mb-6 sm:mb-8">
          <WeatherTips />
        </div>

        {/* Additional Info */}
        <WeatherInfo />
      </div>
    </div>
  );
}
