'use client';

import { AirQualityOverview, getAqiColor } from '@/constants/airQualityMockData';

interface AirQualityOverviewProps {
  data: AirQualityOverview;
}

export default function AirQualityOverviewComponent({ data }: AirQualityOverviewProps) {
  const aqiColor = getAqiColor(data.averageAqi);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
      {/* Average AQI */}
      <div
        className="bg-white rounded-lg shadow-md p-6 border-l-4"
        style={{ borderColor: aqiColor }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">AQI Trung bình</p>
            <p className="text-4xl font-bold" style={{ color: aqiColor }}>
              {data.averageAqi}
            </p>
            <p className="text-sm font-medium mt-2" style={{ color: aqiColor }}>
              {data.level}
            </p>
          </div>
          <div className="text-5xl">🌫️</div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {data.trend === 'improving' && (
            <span className="text-green-600 flex items-center gap-1 text-sm">
              <span>↓</span> Đang cải thiện
            </span>
          )}
          {data.trend === 'worsening' && (
            <span className="text-red-600 flex items-center gap-1 text-sm">
              <span>↑</span> Đang xấu đi
            </span>
          )}
          {data.trend === 'stable' && (
            <span className="text-gray-600 flex items-center gap-1 text-sm">
              <span>→</span> Ổn định
            </span>
          )}
        </div>
      </div>

      {/* Total Stations */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tổng số trạm</p>
            <p className="text-4xl font-bold text-blue-600">{data.totalStations}</p>
            <p className="text-sm text-gray-500 mt-2">Đang hoạt động</p>
          </div>
          <div className="text-5xl">📍</div>
        </div>
      </div>

      {/* Good Stations */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Trạm tốt</p>
            <p className="text-4xl font-bold text-green-600">{data.goodStations}</p>
            <p className="text-sm text-gray-500 mt-2">AQI ≤ 50</p>
          </div>
          <div className="text-5xl">✅</div>
        </div>
      </div>

      {/* Moderate + Unhealthy Stations */}
      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Trạm cảnh báo</p>
            <p className="text-4xl font-bold text-orange-600">
              {data.moderateStations + data.unhealthyStations}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              TB: {data.moderateStations} | Kém: {data.unhealthyStations}
            </p>
          </div>
          <div className="text-5xl">⚠️</div>
        </div>
      </div>
    </div>
  );
}
