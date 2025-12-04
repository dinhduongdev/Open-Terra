'use client';

import { AirQualityStatByTime } from '@/constants/airQualityMockData';

interface AirQualityStatisticsProps {
  statsByTime: AirQualityStatByTime[];
}

export default function AirQualityStatistics({ statsByTime }: AirQualityStatisticsProps) {
  const maxAqi = Math.max(...statsByTime.map((s) => s.aqi));
  const maxPm25 = Math.max(...statsByTime.map((s) => s.pm25));

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span>📈</span>
        Biểu đồ chất lượng không khí 24h
      </h2>

      {/* AQI Chart */}
      <div className="mb-8">
        <h3 className="text-md font-semibold text-gray-700 mb-4">Chỉ số AQI theo giờ</h3>
        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
          <div className="h-full flex items-end justify-center gap-6">
            {statsByTime.map((stat, index) => {
              const height = (stat.aqi / maxAqi) * 100;
              const color =
                stat.aqi <= 50
                  ? 'bg-green-500'
                  : stat.aqi <= 100
                  ? 'bg-yellow-500'
                  : stat.aqi <= 150
                  ? 'bg-orange-500'
                  : 'bg-red-500';

              return (
                <div key={index} className="flex flex-col items-center h-full justify-end" style={{ width: '48px' }}>
                  <div className="relative w-full flex flex-col items-center group h-full justify-end">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      AQI: {stat.aqi}
                    </div>
                    <div
                      className={`w-full ${color} rounded-t-md transition-all hover:opacity-80`}
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600 mt-2">
          {statsByTime.map((stat, index) => (
            <div key={index} className="text-center" style={{ width: '48px' }}>
              {stat.time}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Tốt (0-50)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>TB (51-100)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Kém (101-150)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Xấu (151+)</span>
          </div>
        </div>
      </div>

      {/* PM2.5 Chart */}
      <div className="pt-8 border-t border-gray-200">
        <h3 className="text-md font-semibold text-gray-700 mb-4">Nồng độ PM2.5 theo giờ</h3>
        <div className="relative h-64 bg-gray-50 rounded-lg p-4">
          <div className="h-full flex items-end justify-center gap-6">
            {statsByTime.map((stat, index) => {
              const height = (stat.pm25 / maxPm25) * 100;
              const color =
                stat.pm25 <= 25
                  ? 'bg-green-500'
                  : stat.pm25 <= 50
                  ? 'bg-yellow-500'
                  : stat.pm25 <= 75
                  ? 'bg-orange-500'
                  : 'bg-red-500';

              return (
                <div key={index} className="flex flex-col items-center h-full justify-end" style={{ width: '48px' }}>
                  <div className="relative w-full flex flex-col items-center group h-full justify-end">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {stat.pm25} µg/m³
                    </div>
                    <div
                      className={`w-full ${color} rounded-t-md transition-all hover:opacity-80`}
                      style={{ height: `${height}%`, minHeight: '4px' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-gray-600 mt-2">
          {statsByTime.map((stat, index) => (
            <div key={index} className="text-center" style={{ width: '48px' }}>
              {stat.time}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Tốt (0-25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>TB (26-50)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span>Kém (51-75)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Xấu (76+)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
