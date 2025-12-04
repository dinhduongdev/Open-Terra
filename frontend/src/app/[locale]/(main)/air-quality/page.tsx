'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import {
  airQualityStations,
  airQualityOverview,
  airQualityStatsByTime,
  mainPollutants,
} from '@/constants/airQualityMockData';
import AirQualityOverviewComponent from '@/components/common/AirQualityOverview';
import AirQualityStationsList from '@/components/common/AirQualityStationsList';
import PollutantsOverview from '@/components/common/PollutantsOverview';
import AirQualityStatistics from '@/components/common/AirQualityStatistics';
import HealthRecommendations from '@/components/common/HealthRecommendations';

// Dynamically import Map component with no SSR to avoid window/document issues
const AirQualityMapDynamic = dynamic(() => import('@/components/common/AirQualityMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Đang tải bản đồ...</p>
    </div>
  ),
});

export default function AirQualityPage() {
  const t = useTranslations('sidebar');
  const [showStations, setShowStations] = useState(true);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <span className="text-4xl">🌫️</span>
          {t('airQuality')}
        </h1>
        <p className="text-gray-600">
          Theo dõi chất lượng không khí và các chỉ số ô nhiễm theo thời gian thực
        </p>
      </div>

      {/* Overview Stats */}
      <AirQualityOverviewComponent data={airQualityOverview} />

      {/* Main Map */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <span>🗺️</span>
            Bản đồ chất lượng không khí - OpenStreetMap
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
                <li>• Click vào các điểm màu để xem chi tiết trạm quan trắc</li>
                <li>• Màu sắc thể hiện mức độ chất lượng không khí (Xanh = Tốt, Đỏ = Kém)</li>
                <li>• Số hiển thị là chỉ số AQI (Air Quality Index)</li>
                <li>• Sử dụng nút bật/tắt để ẩn/hiện các trạm quan trắc</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AQI Scale Legend */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Thang đo chỉ số AQI:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#00e400' }}></div>
              <div>
                <div className="font-semibold">0-50</div>
                <div className="text-gray-600">Tốt</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ffff00' }}></div>
              <div>
                <div className="font-semibold">51-100</div>
                <div className="text-gray-600">Trung bình</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ff7e00' }}></div>
              <div>
                <div className="font-semibold">101-150</div>
                <div className="text-gray-600">Kém (Nhạy cảm)</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ff0000' }}></div>
              <div>
                <div className="font-semibold">151-200</div>
                <div className="text-gray-600">Kém</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#8f3f97' }}></div>
              <div>
                <div className="font-semibold">201-300</div>
                <div className="text-gray-600">Rất kém</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#7e0023' }}></div>
              <div>
                <div className="font-semibold">300+</div>
                <div className="text-gray-600">Nguy hại</div>
              </div>
            </div>
          </div>
        </div>

        <AirQualityMapDynamic
          stations={airQualityStations}
          showStations={showStations}
          onStationLayerToggle={setShowStations}
        />
      </div>

      {/* Stations List */}
      <AirQualityStationsList stations={airQualityStations} />

      {/* Pollutants Overview */}
      <PollutantsOverview pollutants={mainPollutants} />

      {/* Statistics */}
      <AirQualityStatistics statsByTime={airQualityStatsByTime} />

      {/* Health Recommendations */}
      <HealthRecommendations aqi={airQualityOverview.averageAqi} />

      {/* Additional Info */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border-l-4 border-blue-500">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📚</span>
          Thông tin thêm về chỉ số AQI
        </h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>
            <strong>Chỉ số chất lượng không khí (AQI)</strong> là thước đo được sử dụng để đánh giá
            mức độ ô nhiễm không khí và tác động của nó đến sức khỏe con người.
          </p>
          <p>
            AQI được tính dựa trên 6 chất ô nhiễm chính: PM2.5, PM10, O₃, NO₂, SO₂ và CO. Chỉ số
            AQI dao động từ 0 đến 500, với giá trị càng cao nghĩa là mức độ ô nhiễm càng lớn.
          </p>
          <p>
            Dữ liệu được cập nhật theo thời gian thực từ các trạm quan trắc môi trường của thành
            phố và các nguồn dữ liệu quốc tế đáng tin cậy.
          </p>
          <div className="pt-3 border-t border-blue-200">
            <p className="font-semibold text-blue-900">Nguồn tham khảo:</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• Tổ chức Y tế Thế giới (WHO)</li>
              <li>• Cơ quan Bảo vệ Môi trường Hoa Kỳ (EPA)</li>
              <li>• Tổng cục Môi trường Việt Nam</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
