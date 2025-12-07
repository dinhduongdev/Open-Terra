/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { WeatherStation } from '@/constants/weatherMockData';

interface WeatherStationsProps {
  stations: WeatherStation[];
}

export default function WeatherStationsComponent({ stations }: WeatherStationsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Ngừng hoạt động';
      case 'maintenance':
        return 'Bảo trì';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📍</span>
        Trạm quan trắc thời tiết
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stations.map((station) => (
          <div
            key={station.id}
            className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">
                  {station.name}
                </h3>
                <p className="text-sm text-gray-600">{station.location}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                  station.status
                )}`}
              >
                {getStatusText(station.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded p-2">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <span className="text-xs">Nhiệt độ</span>
                </div>
                <p className="font-semibold text-gray-800">{station.temperature}°C</p>
              </div>

              <div className="bg-white rounded p-2">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <span className="text-xs">Độ ẩm</span>
                </div>
                <p className="font-semibold text-gray-800">{station.humidity}%</p>
              </div>

              <div className="bg-white rounded p-2">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <span></span>
                  <span className="text-xs">Gió</span>
                </div>
                <p className="font-semibold text-gray-800">{station.windSpeed} km/h</p>
              </div>

              <div className="bg-white rounded p-2">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <span></span>
                  <span className="text-xs">Lượng mưa</span>
                </div>
                <p className="font-semibold text-gray-800">{station.rainfall} mm</p>
              </div>

              <div className="bg-white rounded p-2 col-span-2">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <span className="text-xs">Áp suất</span>
                </div>
                <p className="font-semibold text-gray-800">{station.pressure} hPa</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
