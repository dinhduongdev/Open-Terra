/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { getAQIColor, getAQILabel } from '@/types/airQuality';

interface AirQualityOverview {
  averageAqi: number;
  goodStations: number;
  moderateStations: number;
  unhealthyStations: number;
  totalStations: number;
}

interface AirQualityOverviewProps {
  data: AirQualityOverview;
}

export default function AirQualityOverviewComponent({ data }: AirQualityOverviewProps) {
  const aqiColor = getAQIColor(data.averageAqi);
  const level = getAQILabel(data.averageAqi);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 my-6 md:my-8">
      {/* Average AQI */}
      <div
        className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4"
        style={{ borderColor: aqiColor }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">AQI Trung bình</p>
            <p className="text-3xl md:text-4xl font-bold" style={{ color: aqiColor }}>
              {data.averageAqi}
            </p>
            <p className="text-xs md:text-sm font-medium mt-2" style={{ color: aqiColor }}>
              {level}
            </p>
          </div>
          <div className="text-4xl md:text-5xl">🌫️</div>
        </div>
      </div>

      {/* Total Stations */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Tổng số trạm</p>
            <p className="text-3xl md:text-4xl font-bold text-blue-600">{data.totalStations}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">Đang hoạt động</p>
          </div>
          <div className="text-4xl md:text-5xl">📍</div>
        </div>
      </div>

      {/* Good Stations */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Trạm tốt</p>
            <p className="text-3xl md:text-4xl font-bold text-green-600">{data.goodStations}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">AQI ≤ 50</p>
          </div>
          <div className="text-4xl md:text-5xl">✅</div>
        </div>
      </div>

      {/* Moderate + Unhealthy Stations */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs md:text-sm text-gray-600 mb-1">Trạm cảnh báo</p>
            <p className="text-3xl md:text-4xl font-bold text-orange-600">
              {data.moderateStations + data.unhealthyStations}
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-2">
              TB: {data.moderateStations} | Kém: {data.unhealthyStations}
            </p>
          </div>
          <div className="text-4xl md:text-5xl">⚠️</div>
        </div>
      </div>
    </div>
  );
}
