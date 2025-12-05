/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { getAQIColor, getAQILabel } from '@/types/airQuality';

interface AirQualityStation {
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
  address: {
    addressCountry: string;
    addressLocality: string;
  };
  source: string;
}

interface AirQualityStationsListProps {
  stations: AirQualityStation[];
}

export default function AirQualityStationsList({ stations }: AirQualityStationsListProps) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span>📊</span>
          Danh sách trạm quan trắc
        </h2>
        <div className="text-sm text-gray-600">
          Tổng số: <span className="font-semibold text-blue-600">{stations.length}</span> trạm
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stations.map((station) => {
          const color = getAQIColor(station.aqi);
          const level = getAQILabel(station.aqi);

          return (
            <div
              key={station.id}
              className="rounded-lg p-6 hover:shadow-xl transition-all border-2"
              style={{ 
                borderColor: color,
                backgroundColor: 'white',
              }}
            >
              {/* Header with Station Info */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-gray-100">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{station.name}</h3>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {station.areaServed}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span>{station.address.addressLocality}, {station.address.addressCountry}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📡</span>
                      <span>Nguồn: {station.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>⏰</span>
                      <span>
                        {station.lastUpdate.toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  <div
                    className="rounded-xl px-4 py-3 min-w-[80px] text-center shadow-lg"
                    style={{ backgroundColor: color }}
                  >
                    <div className="text-3xl font-bold text-white">{station.aqi}</div>
                    <div className="text-xs text-white font-medium mt-1">AQI</div>
                  </div>
                  <div
                    className="text-xs font-bold mt-2 py-1.5 px-3 rounded-lg text-center"
                    style={{
                      backgroundColor: `${color}20`,
                      color: color,
                    }}
                  >
                    {level}
                  </div>
                </div>
              </div>

              {/* Air Pollutants Section */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span>🧪</span>
                  Chất ô nhiễm không khí
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {station.pollutants.pm25 !== undefined && (
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border border-purple-200">
                      <div className="text-xs text-purple-600 font-medium mb-1">PM2.5</div>
                      <div className="text-lg font-bold text-purple-900">
                        {station.pollutants.pm25.toFixed(2)}
                      </div>
                      <div className="text-xs text-purple-600">µg/m³</div>
                    </div>
                  )}
                  {station.pollutants.pm10 !== undefined && (
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
                      <div className="text-xs text-blue-600 font-medium mb-1">PM10</div>
                      <div className="text-lg font-bold text-blue-900">
                        {station.pollutants.pm10.toFixed(2)}
                      </div>
                      <div className="text-xs text-blue-600">µg/m³</div>
                    </div>
                  )}
                  {station.pollutants.pm1 !== undefined && (
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-3 border border-indigo-200">
                      <div className="text-xs text-indigo-600 font-medium mb-1">PM1</div>
                      <div className="text-lg font-bold text-indigo-900">
                        {station.pollutants.pm1.toFixed(2)}
                      </div>
                      <div className="text-xs text-indigo-600">µg/m³</div>
                    </div>
                  )}
                  {station.pollutants.o3 !== undefined && (
                    <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-3 border border-cyan-200">
                      <div className="text-xs text-cyan-600 font-medium mb-1">O₃</div>
                      <div className="text-lg font-bold text-cyan-900">
                        {station.pollutants.o3.toFixed(2)}
                      </div>
                      <div className="text-xs text-cyan-600">ppb</div>
                    </div>
                  )}
                  {station.pollutants.no2 !== undefined && (
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                      <div className="text-xs text-orange-600 font-medium mb-1">NO₂</div>
                      <div className="text-lg font-bold text-orange-900">
                        {station.pollutants.no2.toFixed(2)}
                      </div>
                      <div className="text-xs text-orange-600">ppb</div>
                    </div>
                  )}
                  {station.pollutants.so2 !== undefined && (
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-3 border border-red-200">
                      <div className="text-xs text-red-600 font-medium mb-1">SO₂</div>
                      <div className="text-lg font-bold text-red-900">
                        {station.pollutants.so2.toFixed(2)}
                      </div>
                      <div className="text-xs text-red-600">ppb</div>
                    </div>
                  )}
                  {station.pollutants.co !== undefined && (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border border-gray-200">
                      <div className="text-xs text-gray-600 font-medium mb-1">CO</div>
                      <div className="text-lg font-bold text-gray-900">
                        {station.pollutants.co.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600">ppm</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Weather Information Section */}
              {(station.weather.temperature !== undefined || station.weather.humidity !== undefined) && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span>🌤️</span>
                    Thông tin thời tiết
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {station.weather.temperature !== undefined && (
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-amber-600 font-medium mb-1">Nhiệt độ</div>
                            <div className="text-2xl font-bold text-amber-900">
                              {station.weather.temperature.toFixed(1)}°C
                            </div>
                          </div>
                          <span className="text-3xl">🌡️</span>
                        </div>
                      </div>
                    )}
                    {station.weather.humidity !== undefined && (
                      <div className="bg-gradient-to-br from-sky-50 to-sky-100 rounded-lg p-3 border border-sky-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-sky-600 font-medium mb-1">Độ ẩm</div>
                            <div className="text-2xl font-bold text-sky-900">
                              {station.weather.humidity.toFixed(0)}%
                            </div>
                          </div>
                          <span className="text-3xl">💧</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location Coordinates */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-medium">Tọa độ:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {station.location.lat.toFixed(6)}, {station.location.lng.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
