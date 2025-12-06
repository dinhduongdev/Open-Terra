/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { WeatherForecast } from '@/constants/weatherMockData';

interface WeatherForecastProps {
  forecasts: WeatherForecast[];
}

export default function WeatherForecastComponent({ forecasts }: WeatherForecastProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
        <span>📅</span>
        Dự báo 7 ngày
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 md:gap-4">
        {forecasts.map((forecast, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 sm:p-3 md:p-4 hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-0.5 sm:mb-1 truncate">
                {forecast.dayOfWeek}
              </p>
              <p className="text-xs text-gray-500 mb-1 sm:mb-2">
                {new Date(forecast.date).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                })}
              </p>

              <div className="text-3xl sm:text-4xl md:text-5xl mb-1 sm:mb-2">{forecast.icon}</div>

              <div className="mb-1 sm:mb-2">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-base sm:text-lg md:text-2xl font-bold text-red-500">
                    {forecast.tempMax}°
                  </span>
                  <span className="text-xs sm:text-sm md:text-lg text-gray-400">/</span>
                  <span className="text-xs sm:text-sm md:text-lg text-blue-500">{forecast.tempMin}°</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-1 sm:mb-2 line-clamp-1">{forecast.condition}</p>

              <div className="space-y-0.5 sm:space-y-1 text-xs text-gray-500">
                <div className="flex items-center justify-between gap-0.5">
                  <span className="truncate">💧 {forecast.humidity}%</span>
                  <span className="truncate">🌧️ {forecast.precipitation}%</span>
                </div>
                <div className="flex items-center justify-center truncate">
                  <span>🌪️ {forecast.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
