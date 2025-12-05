/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { WeatherCurrent } from '@/constants/weatherMockData';

interface WeatherCurrentProps {
  data: WeatherCurrent;
}

export default function WeatherCurrentComponent({ data }: WeatherCurrentProps) {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-medium opacity-90 mb-1">Thời tiết hiện tại</h2>
          <p className="text-xs opacity-75">
            Cập nhật: {new Date(data.lastUpdated).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="text-6xl">{data.icon}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Temperature */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline">
                <span className="text-7xl font-bold">{data.temperature}</span>
                <span className="text-4xl ml-2">°C</span>
              </div>
              <p className="text-xl mt-2 opacity-90">{data.condition}</p>
              <p className="text-sm mt-1 opacity-75">
                Cảm giác như {data.feelsLike}°C
              </p>
            </div>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💧</span>
              <span className="text-xs opacity-75">Độ ẩm</span>
            </div>
            <p className="text-2xl font-semibold">{data.humidity}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌪️</span>
              <span className="text-xs opacity-75">Gió</span>
            </div>
            <p className="text-2xl font-semibold">{data.windSpeed} km/h</p>
            <p className="text-xs opacity-75">{data.windDirection}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🔆</span>
              <span className="text-xs opacity-75">Chỉ số UV</span>
            </div>
            <p className="text-2xl font-semibold">{data.uvIndex}</p>
            <p className="text-xs opacity-75">
              {data.uvIndex <= 2 ? 'Thấp' : data.uvIndex <= 5 ? 'Trung bình' : data.uvIndex <= 7 ? 'Cao' : 'Rất cao'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌡️</span>
              <span className="text-xs opacity-75">Áp suất</span>
            </div>
            <p className="text-2xl font-semibold">{data.pressure}</p>
            <p className="text-xs opacity-75">hPa</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">☁️</span>
              <span className="text-xs opacity-75">Mây che phủ</span>
            </div>
            <p className="text-2xl font-semibold">{data.cloudCover}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">👁️</span>
              <span className="text-xs opacity-75">Tầm nhìn</span>
            </div>
            <p className="text-2xl font-semibold">{data.visibility}</p>
            <p className="text-xs opacity-75">km</p>
          </div>
        </div>
      </div>
    </div>
  );
}
