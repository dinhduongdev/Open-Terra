/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  currentWeather,
  weeklyForecast,
  hourlyForecast,
  weatherAlerts,
  weatherStations,
  temperatureStats,
  humidityStats,
  rainfallStats,
} from '@/constants/weatherMockData';
import WeatherCurrentComponent from '@/components/common/WeatherCurrent';
import WeatherForecastComponent from '@/components/common/WeatherForecast';
import WeatherHourlyComponent from '@/components/common/WeatherHourly';
import WeatherAlertsComponent from '@/components/common/WeatherAlerts';
import WeatherStationsComponent from '@/components/common/WeatherStations';
import WeatherStatisticsComponent from '@/components/common/WeatherStatistics';

// Dynamically import Map component with no SSR to avoid window/document issues
const WeatherMapDynamic = dynamic(() => import('@/components/common/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Đang tải bản đồ...</p>
    </div>
  ),
});

export default function WeatherPage() {
  const t = useTranslations('weather');
  const tSidebar = useTranslations('sidebar');
  const [showStations, setShowStations] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <span className="text-4xl">🌤️</span>
          {tSidebar('weather')}
        </h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      {/* Current Weather */}
      <div className="mb-8">
        <WeatherCurrentComponent data={currentWeather} />
      </div>

      {/* Weather Alerts */}
      <div className="mb-8">
        <WeatherAlertsComponent alerts={weatherAlerts} />
      </div>

      {/* 7-Day Forecast */}
      <div className="mb-8">
        <WeatherForecastComponent forecasts={weeklyForecast} />
      </div>

      {/* Hourly Forecast */}
      <div className="mb-8">
        <WeatherHourlyComponent forecasts={hourlyForecast} />
      </div>

      {/* Weather Map */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <span>🗺️</span>
            Bản đồ thời tiết - OpenStreetMap
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Hiển thị trạm quan trắc:</span>
            <button
              onClick={() => setShowStations(!showStations)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showStations
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showStations ? '✓ Đang bật' : 'Tắt'}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Hướng dẫn sử dụng</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click vào các điểm tròn màu để xem chi tiết trạm quan trắc</li>
                <li>
                  • Màu sắc thể hiện nhiệt độ (Đỏ = Nóng &gt;30°C, Cam = Ấm 25-30°C, Xanh =
                  Mát &lt;25°C)
                </li>
                <li>• Số hiển thị là nhiệt độ hiện tại tại trạm</li>
                <li>• Sử dụng nút bật/tắt để ẩn/hiện các trạm quan trắc</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Temperature Legend */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Chú thích nhiệt độ:</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: '#3b82f6' }}
              ></div>
              <div>
                <div className="font-semibold">&lt; 25°C</div>
                <div className="text-gray-600">Mát mẻ</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: '#f59e0b' }}
              ></div>
              <div>
                <div className="font-semibold">25-30°C</div>
                <div className="text-gray-600">Ấm áp</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: '#ef4444' }}
              ></div>
              <div>
                <div className="font-semibold">&gt; 30°C</div>
                <div className="text-gray-600">Nóng bức</div>
              </div>
            </div>
          </div>
        </div>

        <WeatherMapDynamic
          stations={weatherStations}
          showStations={showStations}
          onStationLayerToggle={setShowStations}
        />
      </div>

      {/* Weather Stations */}
      <div className="mb-8">
        <WeatherStationsComponent stations={weatherStations} />
      </div>

      {/* Weather Statistics */}
      <div className="mb-8">
        <WeatherStatisticsComponent
          temperatureStats={temperatureStats}
          humidityStats={humidityStats}
          rainfallStats={rainfallStats}
        />
      </div>

      {/* Weather Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Sun Protection */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>☀️</span>
            Khuyến nghị phòng tránh nắng
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Sử dụng kem chống nắng SPF 30+ khi ra ngoài</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Đội mũ, đeo kính râm để bảo vệ da và mắt</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Hạn chế hoạt động ngoài trời từ 11h-15h khi chỉ số UV cao</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Uống đủ nước, tránh mất nước trong ngày nóng</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Mặc quần áo mỏng, thoáng mát, màu sáng</span>
            </li>
          </ul>
        </div>

        {/* Rain Protection */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🌧️</span>
            Khuyến nghị khi có mưa
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Mang theo áo mưa hoặc ô khi ra ngoài</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Kiểm tra dự báo thời tiết trước khi di chuyển xa</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Tránh đi qua vùng ngập sâu, nước chảy xiết</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Lái xe chậm và cẩn thận khi trời mưa</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>Tránh xa các cột điện, dây điện khi có sấm sét</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📚</span>
          Thông tin về dữ liệu thời tiết
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Dữ liệu thời tiết</strong> được thu thập từ các trạm quan trắc khí tượng thủy
            văn tự động phân bố trên khắp thành phố, cung cấp thông tin chính xác và cập nhật theo
            thời gian thực.
          </p>
          <p>
            Các thông số đo lường bao gồm: nhiệt độ, độ ẩm không khí, áp suất khí quyển, tốc độ và
            hướng gió, lượng mưa, độ che phủ mây, chỉ số UV và tầm nhìn xa.
          </p>
          <p>
            <strong>Dự báo thời tiết</strong> được tính toán dựa trên các mô hình khí tượng hiện
            đại, kết hợp dữ liệu từ vệ tinh, radar thời tiết và mạng lưới quan trắc mặt đất.
          </p>
          <div className="pt-3 border-t border-blue-200">
            <p className="font-semibold text-blue-900 mb-2">Liên hệ và thông tin:</p>
            <ul className="space-y-1 text-gray-600">
              <li>• Trung tâm Khí tượng Thủy văn Quốc gia</li>
              <li>• Tổng cục Khí tượng Thủy văn Việt Nam</li>
              <li>• Hotline cảnh báo khẩn cấp: 1900-xxxx</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
