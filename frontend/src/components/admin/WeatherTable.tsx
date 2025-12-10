/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useWeatherData } from '@/hooks/useWeatherData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function WeatherTable() {
  const t = useTranslations('adminWeatherTable');
  const { weatherData, loading, error } = useWeatherData();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(t('errors.loadFailed'));
    }
  }, [error, t]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWeatherIcon = (weatherType: string) => {
    const type = weatherType.toLowerCase();
    if (type.includes('nắng') || type.includes('sunny')) return '☀️';
    if (type.includes('mây') || type.includes('cloud')) return '☁️';
    if (type.includes('mưa') || type.includes('rain')) return '🌧️';
    if (type.includes('giông') || type.includes('storm')) return '⛈️';
    return '🌤️';
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { text: t('uvLevels.low'), color: 'bg-green-100 text-green-800' };
    if (uv <= 5) return { text: t('uvLevels.moderate'), color: 'bg-yellow-100 text-yellow-800' };
    if (uv <= 7) return { text: t('uvLevels.high'), color: 'bg-orange-100 text-orange-800' };
    if (uv <= 10) return { text: t('uvLevels.veryHigh'), color: 'bg-red-100 text-red-800' };
    return { text: t('uvLevels.extreme'), color: 'bg-purple-100 text-purple-800' };
  };

  const getWindDirection = (degrees: number) => {
    const directions = [
      t('windDirections.north'),
      t('windDirections.northeast'),
      t('windDirections.east'),
      t('windDirections.southeast'),
      t('windDirections.south'),
      t('windDirections.southwest'),
      t('windDirections.west'),
      t('windDirections.northwest')
    ];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Prepare chart data
  const getWeatherMetricsData = () => {
    if (!weatherData?.result) return [];
    
    return [
      {
        metric: t('metrics.temperature'),
        value: Number(weatherData.result.temperature.value),
        unit: '°C',
      },
      {
        metric: t('metrics.feelsLike'),
        value: Number(weatherData.result.feelsLikeTemperature.value),
        unit: '°C',
      },
      {
        metric: t('metrics.humidity'),
        value: Number(weatherData.result.relativeHumidity.value) * 100,
        unit: '%',
      },
      {
        metric: t('metrics.pressure'),
        value: Number(weatherData.result.atmosphericPressure.value),
        unit: 'hPa',
      },
    ];
  };

  const getWindAndVisibilityData = () => {
    if (!weatherData?.result) return [];
    
    return [
      {
        metric: t('metrics.windSpeed'),
        value: Number(weatherData.result.windSpeed.value),
        unit: 'km/h',
      },
      {
        metric: t('metrics.visibility'),
        value: Number(weatherData.result.visibility.value) / 1000,
        unit: 'km',
      },
      {
        metric: t('metrics.precipitation'),
        value: Number(weatherData.result.precipitation.value),
        unit: 'mm',
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !weatherData?.result) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">{t('error')}</p>
        <p>{error || t('noData')}</p>
      </div>
    );
  }

  const weather = weatherData.result;
  const uvLevel = getUVLevel(weather.uVIndexMax.value as number);

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature Card */}
        <div className="bg-red-500 rounded-lg shadow-lg p-6 text-white">
          <div>
            <p className="text-sm opacity-90">Nhiệt độ</p>
            <p className="text-4xl font-bold">{Number(weather.temperature.value)}°C</p>
            <p className="text-sm mt-1">Cảm giác {Number(weather.feelsLikeTemperature.value)}°C</p>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-blue-500 rounded-lg shadow-lg p-6 text-white">
          <div>
            <p className="text-sm opacity-90">Độ ẩm</p>
            <p className="text-4xl font-bold">{(Number(weather.relativeHumidity.value) * 100).toFixed(0)}%</p>
            <p className="text-sm mt-1">Điểm sương {Number(weather.dewPoint.value)}°C</p>
          </div>
        </div>

        {/* Wind Card */}
        <div className="bg-green-500 rounded-lg shadow-lg p-6 text-white">
          <div>
            <p className="text-sm opacity-90">Tốc độ gió</p>
            <p className="text-4xl font-bold">{Number(weather.windSpeed.value)} km/h</p>
            <p className="text-sm mt-1">Hướng {getWindDirection(weather.windDirection.value as number)}</p>
          </div>
        </div>

        {/* UV Index Card */}
        <div className="bg-purple-500 rounded-lg shadow-lg p-6 text-white">
          <div>
            <p className="text-sm opacity-90">Chỉ số UV tối đa</p>
            <p className="text-4xl font-bold">{Number(weather.uVIndexMax.value)}</p>
            <p className="text-sm mt-1">Mức độ: {uvLevel.text}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weather Metrics Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('charts.weatherMetrics')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getWeatherMetricsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={t('charts.value')} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wind & Visibility Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('charts.windVisibility')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getWindAndVisibilityData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={t('charts.value')} fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Information Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{t('table.title')}</h3>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {t('table.viewFull')}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.parameter')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.value')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.unit')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.observedAt')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.station')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={3}>{weather.name}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.area')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={3}>{weather.areaServed}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.weatherType')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={3}>
                  {weather.weatherType.value}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.temperature')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.temperature.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.temperature.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.temperature.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.feelsLike')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.feelsLikeTemperature.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.feelsLikeTemperature.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.feelsLikeTemperature.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.humidity')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(Number(weather.relativeHumidity.value) * 100).toFixed(0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.relativeHumidity.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.pressure')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.atmosphericPressure.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.atmosphericPressure.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.atmosphericPressure.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.windSpeed')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.windSpeed.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.windSpeed.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.windSpeed.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.windDirection')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {weather.windDirection.value}° ({getWindDirection(weather.windDirection.value as number)})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.windDirection.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.windDirection.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.precipitation')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.precipitation.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.precipitation.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.precipitation.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.visibility')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(Number(weather.visibility.value) / 1000).toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">km</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.visibility.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{t('table.uvIndex')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${uvLevel.color}`}>
                    {Number(weather.uVIndexMax.value)} - {uvLevel.text}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.uVIndexMax.observedAt!)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Details Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{t('modal.title')}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Station Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.stationInfo')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('modal.stationName')}</p>
                    <p className="font-medium text-gray-900">{weather.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('modal.area')}</p>
                    <p className="font-medium text-gray-900">{weather.areaServed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('modal.address')}</p>
                    <p className="font-medium text-gray-900">
                      {weather.address.addressLocality}, {weather.address.addressCountry}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('modal.dataSource')}</p>
                    <p className="font-medium text-gray-900">{weather.source}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">{t('modal.description')}</p>
                    <p className="font-medium text-gray-900">{weather.description}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.location')}</h3>
                <p className="text-gray-900">
                  {t('modal.coordinates')}: {weather.location.coordinates[1].toFixed(6)}, {weather.location.coordinates[0].toFixed(6)}
                </p>
              </div>

              {/* Observation Time */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.observationTime')}</h3>
                <p className="text-gray-900">{formatDate(weather.dateObserved['@value'])}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
