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
import { getLatestAirQuality, formatStationForDisplay } from '@/services/airQualityService';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

interface FormattedStation {
  id: string;
  name: string;
  areaServed: string;
  location: {
    lat: number;
    lng: number;
  };
  aqi: number;
  level: string;
  lastUpdate: Date;
  pollutants: {
    pm25?: number;
    pm10?: number;
    pm1?: number;
    co?: number;
    no2?: number;
    o3?: number;
    so2?: number;
  };
  weather: {
    temperature?: number;
    humidity?: number;
  };
  address: any;
  source: string;
}

export default function AirQualityTable() {
  const t = useTranslations('adminAirQualityTable');
  const [stations, setStations] = useState<FormattedStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<FormattedStation | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLatestAirQuality();
      const formattedData = data.map(formatStationForDisplay);
      setStations(formattedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch air quality data';
      setError(errorMessage);
      toast.error(t('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-green-100 text-green-800 border-green-300';
    if (aqi <= 100) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (aqi <= 150) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (aqi <= 200) return 'bg-red-100 text-red-800 border-red-300';
    if (aqi <= 300) return 'bg-purple-100 text-purple-800 border-purple-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const getLevelText = (level: string) => {
    const levels: Record<string, string> = {
      good: t('levels.good'),
      moderate: t('levels.moderate'),
      unhealthyForSensitiveGroups: t('levels.unhealthyForSensitiveGroups'),
      unhealthy: t('levels.unhealthy'),
      veryUnhealthy: t('levels.veryUnhealthy'),
      hazardous: t('levels.hazardous'),
    };
    return levels[level] || level;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetail = (station: FormattedStation) => {
    setSelectedStation(station);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStation(null);
  };

  // Calculate chart data
  const getAqiDistributionData = () => {
    const distribution = {
      'good': 0,
      'moderate': 0,
      'poor': 0,
      'bad': 0,
      'veryBad': 0,
      'hazardous': 0,
    };

    stations.forEach((station) => {
      if (station.aqi <= 50) distribution['good']++;
      else if (station.aqi <= 100) distribution['moderate']++;
      else if (station.aqi <= 150) distribution['poor']++;
      else if (station.aqi <= 200) distribution['bad']++;
      else if (station.aqi <= 300) distribution['veryBad']++;
      else distribution['hazardous']++;
    });

    return [
      { name: t('charts.good'), value: distribution['good'], color: '#22c55e' },
      { name: t('charts.moderate'), value: distribution['moderate'], color: '#eab308' },
      { name: t('charts.poor'), value: distribution['poor'], color: '#f97316' },
      { name: t('charts.bad'), value: distribution['bad'], color: '#ef4444' },
      { name: t('charts.veryBad'), value: distribution['veryBad'], color: '#a855f7' },
      { name: t('charts.hazardous'), value: distribution['hazardous'], color: '#be123c' },
    ];
  };

  const getPollutantsData = () => {
    if (stations.length === 0) return [];

    const pollutants = {
      'PM2.5': [] as number[],
      'PM10': [] as number[],
      'CO': [] as number[],
      'NO2': [] as number[],
      'O3': [] as number[],
      'SO2': [] as number[],
    };

    stations.forEach((station) => {
      if (station.pollutants.pm25) pollutants['PM2.5'].push(station.pollutants.pm25);
      if (station.pollutants.pm10) pollutants['PM10'].push(station.pollutants.pm10);
      if (station.pollutants.co) pollutants['CO'].push(station.pollutants.co);
      if (station.pollutants.no2) pollutants['NO2'].push(station.pollutants.no2);
      if (station.pollutants.o3) pollutants['O3'].push(station.pollutants.o3);
      if (station.pollutants.so2) pollutants['SO2'].push(station.pollutants.so2);
    });

    return Object.entries(pollutants)
      .filter(([_, values]) => values.length > 0)
      .map(([name, values]) => ({
        name,
        value: Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2)),
        color: '#3b82f6',
      }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">{t('error')}</p>
        <p>{error}</p>
        <button
          onClick={fetchStations}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {t('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AQI Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('charts.aqiDistribution')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getAqiDistributionData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => (value > 0 ? `${name}: ${value}` : '')}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getAqiDistributionData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Pollutants Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('charts.averagePollutants')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getPollutantsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={t('charts.avgValue')} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
        <span className="font-semibold text-gray-900">{t('totalStations', { count: stations.length })}</span>
        <button
          onClick={fetchStations}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t('refresh')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.station')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.area')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.aqi')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.level')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.pm25')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.time')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {t('table.noData')}
                  </td>
                </tr>
              ) : (
                stations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {station.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {station.areaServed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getAqiColor(station.aqi)}`}>
                        {station.aqi}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getLevelText(station.level)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {station.pollutants.pm25?.toFixed(1) || 'N/A'} µg/m³
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(station.lastUpdate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetail(station)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                      >
                        {t('table.view')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedStation && (
        <div 
          className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{t('modal.title')}</h2>
              <button
                onClick={handleCloseModal}
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
                    <p className="font-medium text-gray-900">{selectedStation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('modal.areaServed')}</p>
                    <p className="font-medium text-gray-900">{selectedStation.areaServed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('modal.lastUpdate')}</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedStation.lastUpdate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('modal.dataSource')}</p>
                    <p className="font-medium text-gray-900">{selectedStation.source}</p>
                  </div>
                </div>
              </div>

              {/* AQI Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.aqiIndex')}</h3>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">{t('modal.aqi')}</p>
                    <span className={`text-3xl font-bold px-4 py-2 rounded-full ${getAqiColor(selectedStation.aqi).replace('border', '')}`}>
                      {selectedStation.aqi}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('modal.level')}</p>
                    <p className="text-xl font-semibold text-gray-900">{getLevelText(selectedStation.level)}</p>
                  </div>
                </div>
              </div>

              {/* Pollutants */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.pollutants')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedStation.pollutants.pm25 && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm text-gray-600">PM2.5</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedStation.pollutants.pm25.toFixed(1)} µg/m³</p>
                    </div>
                  )}
                  {selectedStation.pollutants.pm10 && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm text-gray-600">PM10</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedStation.pollutants.pm10.toFixed(1)} µg/m³</p>
                    </div>
                  )}
                  {selectedStation.pollutants.pm1 && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm text-gray-600">PM1</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedStation.pollutants.pm1.toFixed(1)} µg/m³</p>
                    </div>
                  )}
                  {selectedStation.pollutants.co && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm text-gray-600">CO</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedStation.pollutants.co.toFixed(2)} ppm</p>
                    </div>
                  )}
                  {selectedStation.pollutants.no2 && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm text-gray-600">NO2</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedStation.pollutants.no2.toFixed(1)} ppb</p>
                    </div>
                  )}
                  {selectedStation.pollutants.o3 && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm text-gray-600">O3</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedStation.pollutants.o3.toFixed(1)} ppb</p>
                    </div>
                  )}
                  {selectedStation.pollutants.so2 && (
                    <div className="bg-white p-3 rounded">
                      <p className="text-sm text-gray-600">SO2</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedStation.pollutants.so2.toFixed(1)} ppb</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Weather */}
              {(selectedStation.weather.temperature || selectedStation.weather.humidity) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.weather')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedStation.weather.temperature && (
                      <div>
                        <p className="text-sm text-gray-600">{t('modal.temperature')}</p>
                        <p className="font-medium text-gray-900">{selectedStation.weather.temperature.toFixed(1)}°C</p>
                      </div>
                    )}
                    {selectedStation.weather.humidity && (
                      <div>
                        <p className="text-sm text-gray-600">{t('modal.humidity')}</p>
                        <p className="font-medium text-gray-900">{selectedStation.weather.humidity.toFixed(0)}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('modal.location')}</h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">{t('modal.coordinates')}</p>
                    <p className="font-medium text-gray-900">
                      {selectedStation.location.lat.toFixed(6)}, {selectedStation.location.lng.toFixed(6)}
                    </p>
                  </div>
                  {selectedStation.address && (
                    <div>
                      <p className="text-sm text-gray-600">{t('modal.address')}</p>
                      <p className="font-medium text-gray-900">
                        {selectedStation.address.addressLocality}, {selectedStation.address.addressCountry}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
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
