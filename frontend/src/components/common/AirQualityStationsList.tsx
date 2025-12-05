/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { AirQualityStation, getAqiColor, getAqiLevel } from '@/constants/airQualityMockData';

interface AirQualityStationsListProps {
  stations: AirQualityStation[];
}

export default function AirQualityStationsList({ stations }: AirQualityStationsListProps) {
  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span>📊</span>
        Danh sách trạm quan trắc
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stations.map((station) => {
          const color = getAqiColor(station.aqi);
          const level = getAqiLevel(station.aqi);

          return (
            <div
              key={station.id}
              className="rounded-lg p-4 hover:shadow-lg transition-shadow border-l-4"
              style={{ 
                borderLeftColor: color,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderLeftWidth: '4px'
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{station.name}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(station.lastUpdated).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div
                  className="rounded-lg px-3 py-1.5 min-w-[60px] text-center"
                  style={{ backgroundColor: color }}
                >
                  <div className="text-2xl font-bold text-white">{station.aqi}</div>
                </div>
              </div>

              <div
                className="text-xs font-semibold mb-3 py-1.5 px-2 rounded text-center"
                style={{
                  backgroundColor: `${color}15`,
                  color: color,
                }}
              >
                {level}
              </div>

              <div className="space-y-1.5 text-sm mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">PM2.5:</span>
                  <span className="font-semibold text-gray-900">{station.pollutants.pm25} µg/m³</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">PM10:</span>
                  <span className="font-semibold text-gray-900">{station.pollutants.pm10} µg/m³</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">O₃:</span>
                  <span className="font-semibold text-gray-900">{station.pollutants.o3} µg/m³</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
                <span>🌡️ {station.temperature}°C</span>
                <span>💧 {station.humidity}%</span>
                <span>💨 {station.windSpeed} km/h</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
