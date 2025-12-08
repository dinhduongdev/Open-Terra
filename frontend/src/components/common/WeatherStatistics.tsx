/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

interface WeatherStatisticsProps {
  temperatureStats: Array<{ time: string; temp: number; avgTemp: number }>;
  humidityStats: Array<{ time: string; humidity: number }>;
  rainfallStats: Array<{ day: string; rainfall: number }>;
}

export default function WeatherStatisticsComponent({
  temperatureStats,
  humidityStats,
  rainfallStats,
}: WeatherStatisticsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        Thống kê thời tiết
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature Chart */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            Nhiệt độ trong ngày
          </h3>
          <div className="space-y-2">
            {temperatureStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-12">{stat.time}</span>
                <div className="flex-1 bg-white rounded-full h-6 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all"
                    style={{ width: `${(stat.temp / 40) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                    {stat.temp}°C
                  </span>
                </div>
                <span className="text-xs text-gray-500 w-16">TB: {stat.avgTemp}°C</span>
              </div>
            ))}
          </div>
        </div>

        {/* Humidity Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            Độ ẩm trong ngày
          </h3>
          <div className="space-y-2">
            {humidityStats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-12">{stat.time}</span>
                <div className="flex-1 bg-white rounded-full h-6 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${stat.humidity}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                    {stat.humidity}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rainfall Chart */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 lg:col-span-2">
          <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <span></span>
            Lượng mưa trong tuần (mm)
          </h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {rainfallStats.map((stat, index) => {
              const maxRainfall = Math.max(...rainfallStats.map((s) => s.rainfall));
              const heightPercent = (stat.rainfall / maxRainfall) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-semibold text-gray-700">
                    {stat.rainfall}mm
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t-lg transition-all hover:from-indigo-600 hover:to-purple-500"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  <div className="text-xs font-medium text-gray-600">{stat.day}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
