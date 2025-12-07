/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useState, useEffect } from 'react';
import { getStationAirQuality } from '@/services/airQualityService';
import { AirQualityStation } from '@/types/airQuality';
import { getAQIColor, getAQILabel } from '@/types/airQuality';
import LoadingSpinner from './LoadingSpinner';

interface StationOption {
  id: string;
  name: string;
  areaServed: string;
}

interface StationSelectorProps {
  stations: StationOption[];
}

export default function StationSelector({ stations }: StationSelectorProps) {
  const [selectedStationId, setSelectedStationId] = useState<string>('');
  const [stationData, setStationData] = useState<AirQualityStation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStationChange = async (stationId: string) => {
    if (!stationId) {
      setSelectedStationId('');
      setStationData(null);
      return;
    }

    setSelectedStationId(stationId);
    setLoading(true);
    setError(null);

    try {
      const data = await getStationAirQuality(stationId);
      setStationData(data);
    } catch (err) {
      console.error('Failed to fetch station data:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu trạm');
      setStationData(null);
    } finally {
      setLoading(false);
    }
  };

  // Format station data for display
  const formatStationData = (station: AirQualityStation) => {
    return {
      id: station.id,
      name: station.name,
      areaServed: station.areaServed,
      location: {
        lat: station.location.coordinates[1],
        lng: station.location.coordinates[0],
      },
      aqi: station.airQualityIndex.value,
      level: station.airQualityLevel,
      lastUpdate: new Date(station.dateObserved['@value']),
      pollutants: {
        pm25: station.pm25?.value,
        pm10: station.pm10?.value,
        pm1: station.pm1?.value,
        co: station.co?.value,
        no2: station.no2?.value,
        o3: station.o3?.value,
        so2: station.so2?.value,
      },
      weather: {
        temperature: station.temperature?.value,
        humidity: station.relativeHumidity?.value ? station.relativeHumidity.value * 100 : undefined,
      },
      address: station.address,
      source: station.source,
    };
  };

  const formattedStation = stationData ? formatStationData(stationData) : null;

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        Xem chi tiết trạm quan trắc
      </h2>

      {/* Station Selector */}
      <div className="mb-6">
        <label htmlFor="station-select" className="block text-sm font-medium text-gray-700 mb-2">
          Chọn trạm quan trắc:
        </label>
        <select
          id="station-select"
          value={selectedStationId}
          onChange={(e) => handleStationChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 font-medium"
        >
          <option value="" className="text-gray-500">-- Chọn một trạm --</option>
          {stations.map((station) => (
            <option key={station.id} value={station.id} className="text-gray-900">
              {station.name} - {station.areaServed}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center gap-3">
            <span className="text-2xl">❌</span>
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Lỗi</h3>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Station Details */}
      {!loading && !error && formattedStation && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b-2 border-gray-100">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-2xl font-bold text-gray-900">{formattedStation.name}</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium text-sm">
                  {formattedStation.areaServed}
                </span>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>
                    {formattedStation.address.addressLocality}, {formattedStation.address.addressCountry}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📡</span>
                  <span>Nguồn: {formattedStation.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⏰</span>
                  <span>
                    Cập nhật: {formattedStation.lastUpdate.toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌐</span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {formattedStation.location.lat.toFixed(6)}, {formattedStation.location.lng.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
            <div className="ml-6">
              <div
                className="rounded-xl px-6 py-4 min-w-[100px] text-center shadow-lg"
                style={{ backgroundColor: getAQIColor(formattedStation.aqi) }}
              >
                <div className="text-4xl font-bold text-white">{formattedStation.aqi}</div>
                <div className="text-sm text-white font-medium mt-1">AQI</div>
              </div>
              <div
                className="text-sm font-bold mt-3 py-2 px-4 rounded-lg text-center"
                style={{
                  backgroundColor: `${getAQIColor(formattedStation.aqi)}20`,
                  color: getAQIColor(formattedStation.aqi),
                }}
              >
                {getAQILabel(formattedStation.aqi)}
              </div>
            </div>
          </div>

          {/* Air Pollutants */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span>🧪</span>
              Chất ô nhiễm không khí
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formattedStation.pollutants.pm25 !== undefined && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border-2 border-purple-200">
                  <div className="text-sm text-purple-600 font-semibold mb-2">PM2.5</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {formattedStation.pollutants.pm25.toFixed(2)}
                  </div>
                  <div className="text-xs text-purple-600 mt-1">µg/m³</div>
                </div>
              )}
              {formattedStation.pollutants.pm10 !== undefined && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border-2 border-blue-200">
                  <div className="text-sm text-blue-600 font-semibold mb-2">PM10</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {formattedStation.pollutants.pm10.toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">µg/m³</div>
                </div>
              )}
              {formattedStation.pollutants.pm1 !== undefined && (
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border-2 border-indigo-200">
                  <div className="text-sm text-indigo-600 font-semibold mb-2">PM1</div>
                  <div className="text-2xl font-bold text-indigo-900">
                    {formattedStation.pollutants.pm1.toFixed(2)}
                  </div>
                  <div className="text-xs text-indigo-600 mt-1">µg/m³</div>
                </div>
              )}
              {formattedStation.pollutants.o3 !== undefined && (
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border-2 border-cyan-200">
                  <div className="text-sm text-cyan-600 font-semibold mb-2">O₃</div>
                  <div className="text-2xl font-bold text-cyan-900">
                    {formattedStation.pollutants.o3.toFixed(2)}
                  </div>
                  <div className="text-xs text-cyan-600 mt-1">ppb</div>
                </div>
              )}
              {formattedStation.pollutants.no2 !== undefined && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border-2 border-orange-200">
                  <div className="text-sm text-orange-600 font-semibold mb-2">NO₂</div>
                  <div className="text-2xl font-bold text-orange-900">
                    {formattedStation.pollutants.no2.toFixed(2)}
                  </div>
                  <div className="text-xs text-orange-600 mt-1">ppb</div>
                </div>
              )}
              {formattedStation.pollutants.so2 !== undefined && (
                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border-2 border-red-200">
                  <div className="text-sm text-red-600 font-semibold mb-2">SO₂</div>
                  <div className="text-2xl font-bold text-red-900">
                    {formattedStation.pollutants.so2.toFixed(2)}
                  </div>
                  <div className="text-xs text-red-600 mt-1">ppb</div>
                </div>
              )}
              {formattedStation.pollutants.co !== undefined && (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200">
                  <div className="text-sm text-gray-600 font-semibold mb-2">CO</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formattedStation.pollutants.co.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">ppm</div>
                </div>
              )}
            </div>
          </div>

          {/* Weather Information */}
          {(formattedStation.weather.temperature !== undefined || 
            formattedStation.weather.humidity !== undefined) && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                Thông tin thời tiết
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formattedStation.weather.temperature !== undefined && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-6 border-2 border-amber-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-amber-600 font-semibold mb-2">Nhiệt độ</div>
                        <div className="text-3xl font-bold text-amber-900">
                          {formattedStation.weather.temperature.toFixed(1)}°C
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {formattedStation.weather.humidity !== undefined && (
                  <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-6 border-2 border-sky-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-sky-600 font-semibold mb-2">Độ ẩm</div>
                        <div className="text-3xl font-bold text-sky-900">
                          {formattedStation.weather.humidity.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !formattedStation && selectedStationId === '' && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">Vui lòng chọn một trạm quan trắc để xem chi tiết</p>
        </div>
      )}
    </div>
  );
}
