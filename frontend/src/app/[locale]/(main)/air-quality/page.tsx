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
import { useState, useEffect } from 'react';
import {
  getLatestAirQuality,
  calculateAirQualityOverview,
  extractPollutantsData,
  formatStationForDisplay,
} from '@/services/airQualityService';
import { AirQualityStation } from '@/types/airQuality';
import AirQualityOverviewComponent from '@/components/common/AirQualityOverview';
import AirQualityStationsList from '@/components/common/AirQualityStationsList';
import PollutantsOverview from '@/components/common/PollutantsOverview';
import AirQualityStatistics from '@/components/common/AirQualityStatistics';
import HealthRecommendations from '@/components/common/HealthRecommendations';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import StationSelector from '@/components/common/StationSelector';

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
  const [stations, setStations] = useState<AirQualityStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLatestAirQuality();
        setStations(data);
      } catch (err) {
        console.error('Failed to fetch air quality data:', err);
        setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu chất lượng không khí');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate derived data from stations
  const overview = calculateAirQualityOverview(stations);
  const pollutants = extractPollutantsData(stations);
  const formattedStations = stations.map(formatStationForDisplay);

  // Extract station IDs for selector
  const stationOptions = stations.map((station) => {
    // Extract numeric ID from URN format: "urn:ngsi-ld:AirQualityObserved:airquality:3276359:latest"
    const idMatch = station.id.match(/:(\d+):/);
    const numericId = idMatch ? idMatch[1] : station.id;
    
    return {
      id: numericId,
      name: station.name,
      areaServed: station.areaServed,
    };
  });

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

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
      <AirQualityOverviewComponent data={overview} />

      {/* No data message */}
      {stations.length === 0 && (
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">Không có dữ liệu</h3>
              <p className="text-yellow-800">
                Hiện tại chưa có dữ liệu từ các trạm quan trắc chất lượng không khí. Vui lòng thử
                lại sau.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Map */}
      {stations.length > 0 && (
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
            stations={formattedStations}
            showStations={showStations}
            onStationLayerToggle={setShowStations}
          />
        </div>
      )}

      {/* Station Selector - View individual station details */}
      {stations.length > 0 && <StationSelector stations={stationOptions} />}

      {/* Stations List */}
      {stations.length > 0 && <AirQualityStationsList stations={formattedStations} />}

      {/* Pollutants Overview */}
      {pollutants.length > 0 && <PollutantsOverview pollutants={pollutants} />}

      {/* Statistics - Show only if we have historical data */}
      {/* <AirQualityStatistics statsByTime={airQualityStatsByTime} /> */}

      {/* Health Recommendations */}
      {overview.averageAqi > 0 && <HealthRecommendations aqi={overview.averageAqi} />}

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
