/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { useTranslations } from 'next-intl';
import { WeatherStatisticsData } from '@/types/weather';

interface WeatherStatisticsAPIProps {
  statisticsData: WeatherStatisticsData;
  startDate: string;
  endDate: string;
  onDateChange: (start: string, end: string) => void;
}

const StatCard = ({
  icon,
  title,
  min,
  max,
  avg,
  unit,
}: {
  icon: string;
  title: string;
  min: number;
  max: number;
  avg: number;
  unit: string;
}) => {
  const t = useTranslations('weather.statistics');
  
  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <span className="text-2xl sm:text-3xl">{icon}</span>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">{t('average')}:</span>
          <span className="text-lg sm:text-xl font-bold text-blue-600">
            {avg.toFixed(1)} {unit}
          </span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 gap-2">
          <div className="flex-1">
            <span className="text-xs text-gray-500">{t('lowest')}:</span>
            <p className="text-sm sm:text-base font-semibold text-green-600">
              {min.toFixed(1)} {unit}
            </p>
          </div>
          <div className="flex-1 text-right">
            <span className="text-xs text-gray-500">{t('highest')}:</span>
            <p className="text-sm sm:text-base font-semibold text-red-600">
              {max.toFixed(1)} {unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WeatherStatisticsAPI({ 
  statisticsData, 
  startDate, 
  endDate, 
  onDateChange 
}: WeatherStatisticsAPIProps) {
  const t = useTranslations('weather.statistics');
  const { result } = statisticsData;
  const { period, statistics } = result;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateInput = (isoString: string) => {
    return isoString.split('T')[0];
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value + 'T00:00:00Z';
    const newStartDate = new Date(newStart);
    const currentEndDate = new Date(endDate);
    
    if (newStartDate > currentEndDate) {
      alert(t('startDateError'));
      return;
    }
    
    onDateChange(newStart, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value + 'T00:00:00Z';
    const currentStartDate = new Date(startDate);
    const newEndDate = new Date(newEnd);
    
    if (newEndDate < currentStartDate) {
      alert(t('endDateError'));
      return;
    }
    
    onDateChange(startDate, newEnd);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          {t('title')}
        </h2>
        
        {/* Date Range Selector */}
        <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm mb-3 sm:mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                {t('fromDate')}
              </label>
              <input
                type="date"
                value={formatDateInput(startDate)}
                onChange={handleStartDateChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 [&::-webkit-calendar-picker-indicator]:opacity-100"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                {t('toDate')}
              </label>
              <input
                type="date"
                value={formatDateInput(endDate)}
                onChange={handleEndDateChange}
                className="w-full px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 [&::-webkit-calendar-picker-indicator]:opacity-100"
              />
            </div>
          </div>
        </div>

        {/* Period Info */}
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
          <span className="break-words">
            {t('from')} <strong>{formatDate(period.start)}</strong> {t('to')}{' '}
            <strong>{formatDate(period.end)}</strong>
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {Math.round(period.duration_hours)} {t('hours')}
          </span>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StatCard
          icon=""
          title={t('temperature')}
          min={statistics.temperature.min}
          max={statistics.temperature.max}
          avg={statistics.temperature.avg}
          unit="°C"
        />
        <StatCard
          icon=""
          title={t('humidity')}
          min={statistics.relativeHumidity.min * 100}
          max={statistics.relativeHumidity.max * 100}
          avg={statistics.relativeHumidity.avg * 100}
          unit="%"
        />
        <StatCard
          icon=""
          title={t('windSpeed')}
          min={statistics.windSpeed.min}
          max={statistics.windSpeed.max}
          avg={statistics.windSpeed.avg}
          unit="km/h"
        />
        <StatCard
          icon=""
          title={t('atmosphericPressure')}
          min={statistics.atmosphericPressure.min}
          max={statistics.atmosphericPressure.max}
          avg={statistics.atmosphericPressure.avg}
          unit="hPa"
        />
      </div>

      {/* Data Count Info */}
      {/* <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white/70 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          {t('dataCalculated')}{' '}
          <strong className="text-blue-600">{statistics.temperature.count}</strong> {t('dataPoints')}
        </p>
      </div> */}
    </div>
  );
}
