/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { HourlyForecast } from '@/constants/weatherMockData';

interface WeatherHourlyProps {
  forecasts: HourlyForecast[];
}

export default function WeatherHourlyComponent({ forecasts }: WeatherHourlyProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
        <span>⏰</span>
        Dự báo theo giờ
      </h2>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 sm:gap-3">
        {forecasts.map((forecast, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-2 sm:p-3 text-center hover:shadow-md transition-shadow"
          >
            <p className="text-xs font-semibold text-gray-700 mb-1 sm:mb-2 truncate">
              {forecast.time}
            </p>
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{forecast.icon}</div>
            <p className="text-base sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">
              {forecast.temperature}°
            </p>
            <div className="space-y-0.5 sm:space-y-1 text-xs text-gray-600">
              <div className="flex items-center justify-center gap-0.5">
                <span>💧</span>
                <span>{forecast.humidity}%</span>
              </div>
              <div className="flex items-center justify-center gap-0.5">
                <span>🌧️</span>
                <span>{forecast.precipitation}%</span>
              </div>
              <div className="flex items-center justify-center gap-0.5 truncate">
                <span>🌪️</span>
                <span className="text-xs truncate">{forecast.windSpeed}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
