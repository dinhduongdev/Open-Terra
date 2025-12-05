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
  floodZones,
  floodStations,
  floodWarnings,
  floodOverview,
  floodStatsByTime,
} from '@/constants/floodMockData';
import FloodOverview from '@/components/common/FloodOverview';
import FloodWarnings from '@/components/common/FloodWarnings';
import FloodStatistics from '@/components/common/FloodStatistics';
import FloodReportForm, { FloodReport } from '@/components/common/FloodReportForm';
import FloodReportsList from '@/components/common/FloodReportsList';

// Dynamically import Map component with no SSR to avoid window/document issues
const FloodMapDynamic = dynamic(() => import('@/components/common/FloodMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Đang tải bản đồ...</p>
    </div>
  ),
});

export default function FloodMapPage() {
  const t = useTranslations('sidebar');
  const [showFloodLayer, setShowFloodLayer] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [citizenReports, setCitizenReports] = useState<FloodReport[]>([]);

  const handleSubmitReport = (report: Omit<FloodReport, 'id' | 'timestamp' | 'status'>) => {
    const newReport: FloodReport = {
      ...report,
      id: `report-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    setCitizenReports([newReport, ...citizenReports]);
    setShowReportForm(false);
    alert('Báo cáo đã được gửi thành công! Cơ quan chức năng sẽ xử lý trong thời gian sớm nhất.');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="text-4xl">🌊</span>
              {t('floodMap')}
            </h1>
            <p className="text-gray-600">
              Theo dõi tình trạng ngập úng và cảnh báo lũ lụt theo thời gian thực
            </p>
          </div>
          <button
            onClick={() => setShowReportForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-xl">📝</span>
            Báo cáo ngập lụt
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <FloodOverview data={floodOverview} />

      {/* Main Map */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            <span>🗺️</span>
            Bản đồ ngập lụt - OpenStreetMap
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Lớp vùng ngập:</span>
            <button
              onClick={() => setShowFloodLayer(!showFloodLayer)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showFloodLayer
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showFloodLayer ? '✓ Đang bật' : 'Tắt'}
            </button>
          </div>
        </div>
        <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Hướng dẫn sử dụng</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click vào các vùng màu để xem chi tiết mức độ ngập</li>
                <li>• Click vào biểu tượng 📍 để xem thông tin trạm đo</li>
                <li>• Click vào biểu tượng ⚠️ để xem cảnh báo chi tiết</li>
                <li>• Sử dụng nút bật/tắt để ẩn/hiện lớp vùng ngập</li>
              </ul>
            </div>
          </div>
        </div>
        <FloodMapDynamic
          floodZones={floodZones}
          floodStations={floodStations}
          floodWarnings={floodWarnings}
          showFloodLayer={showFloodLayer}
          onFloodLayerToggle={setShowFloodLayer}
        />
      </div>

      {/* Citizen Reports */}
      {citizenReports.length > 0 && (
        <div className="mt-8">
          <FloodReportsList reports={citizenReports} />
        </div>
      )}

      {/* Warnings */}
      <FloodWarnings warnings={floodWarnings} />

      {/* Statistics */}
      <FloodStatistics statsByTime={floodStatsByTime} stations={floodStations} />

      {/* Safety Tips */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🆘</span> Hướng dẫn an toàn khi ngập lụt
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
              <span>⚠️</span> Cần tránh
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Không đi qua vùng nước chảy xiết hoặc nước sâu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Tránh xa các cột điện, dây điện bị đổ hoặc ngập nước</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Không cố gắng lái xe qua vùng ngập sâu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Không uống nước chưa qua xử lý từ vùng ngập</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <span>✅</span> Nên làm
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Theo dõi thông tin cảnh báo từ cơ quan chức năng</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Chuẩn bị túi cứu hộ khẩn cấp và đồ dùng thiết yếu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Di chuyển đến nơi cao hơn khi có lệnh sơ tán</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Liên hệ cơ quan chức năng khi cần hỗ trợ: 113, 114, 115</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Report Form Modal */}
      {showReportForm && (
        <FloodReportForm
          onSubmit={handleSubmitReport}
          onClose={() => setShowReportForm(false)}
        />
      )}
    </div>
  );
}
