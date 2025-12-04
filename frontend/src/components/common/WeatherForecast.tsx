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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📅</span>
        Dự báo 7 ngày
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {forecasts.map((forecast, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                {forecast.dayOfWeek}
              </p>
              <p className="text-xs text-gray-500 mb-3">
                {new Date(forecast.date).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                })}
              </p>

              <div className="text-5xl mb-3">{forecast.icon}</div>

              <div className="mb-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-red-500">
                    {forecast.tempMax}°
                  </span>
                  <span className="text-lg text-gray-400">/</span>
                  <span className="text-lg text-blue-500">{forecast.tempMin}°</span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mb-2">{forecast.condition}</p>

              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <span>💧 {forecast.humidity}%</span>
                  <span>🌧️ {forecast.precipitation}%</span>
                </div>
                <div className="flex items-center justify-center">
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
