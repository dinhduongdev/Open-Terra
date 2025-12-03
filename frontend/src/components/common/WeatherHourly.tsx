import { HourlyForecast } from '@/constants/weatherMockData';

interface WeatherHourlyProps {
  forecasts: HourlyForecast[];
}

export default function WeatherHourlyComponent({ forecasts }: WeatherHourlyProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>⏰</span>
        Dự báo theo giờ
      </h2>

      <div className="overflow-x-auto">
        <div className="flex gap-4 min-w-max">
          {forecasts.map((forecast, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-24 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
            >
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {forecast.time}
              </p>
              <div className="text-4xl mb-2">{forecast.icon}</div>
              <p className="text-xl font-bold text-gray-800 mb-2">
                {forecast.temperature}°
              </p>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <span>💧</span>
                  <span>{forecast.humidity}%</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span>🌧️</span>
                  <span>{forecast.precipitation}%</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span>🌪️</span>
                  <span>{forecast.windSpeed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
