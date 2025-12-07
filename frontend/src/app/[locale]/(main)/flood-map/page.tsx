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
import FloodReportForm, { FloodReport } from '@/components/common/FloodReportForm';
import FloodReportsList from '@/components/common/FloodReportsList';
import { getFloodReports, submitFloodReport } from '@/services/floodReportService';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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
  const [showReportForm, setShowReportForm] = useState(false);
  const [citizenReports, setCitizenReports] = useState<FloodReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Reported' | 'Verified'>('All');

  // Fetch flood reports on mount and when filter changes
  useEffect(() => {
    fetchFloodReports();
  }, [statusFilter]);

  const fetchFloodReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = statusFilter === 'All' ? undefined : statusFilter;
      const reports = await getFloodReports(0, 50, status);
      console.log('Fetched flood reports:', reports);
      setCitizenReports(reports);
    } catch (err) {
      setError('Không thể tải báo cáo ngập lụt');
      console.error('Error fetching flood reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async (report: Omit<FloodReport, 'id' | 'timestamp' | 'status'>) => {
    try {
      const newReport = await submitFloodReport(report);
      setCitizenReports([newReport, ...citizenReports]);
      setShowReportForm(false);
      alert('Báo cáo đã được gửi thành công! Cơ quan chức năng sẽ xử lý trong thời gian sớm nhất.');
      // Refresh reports list
      fetchFloodReports();
    } catch (err) {
      alert('Không thể gửi báo cáo. Vui lòng thử lại!');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                {t('floodMap')}
              </h1>
              <p className="text-gray-600">
                Theo dõi tình trạng ngập úng và cảnh báo lũ lụt theo thời gian thực
              </p>
            </div>
            <button
              onClick={() => setShowReportForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
            >
              Báo cáo ngập lụt
            </button>
          </div>
        </div>

      {/* Main Map */}
      <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
          Bản đồ báo cáo ngập lụt - OpenStreetMap
        </h2>
        <FloodMapDynamic floodReports={citizenReports} />
      </div>

      {/* Citizen Reports */}
      <div className="mt-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 mr-2">Lọc theo trạng thái:</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                statusFilter === 'All'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter('Reported')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                statusFilter === 'Reported'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đã báo cáo
            </button>
            <button
              onClick={() => setStatusFilter('Verified')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                statusFilter === 'Verified'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đã xác minh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchFloodReports}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Thử lại
            </button>
          </div>
        ) : citizenReports.length > 0 ? (
          <FloodReportsList reports={citizenReports} />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">Chưa có báo cáo ngập lụt nào</p>
          </div>
        )}
      </div>

      {/* Warnings */}
      {/* <FloodWarnings warnings={floodWarnings} /> */}

      {/* Statistics */}
      {/* <FloodStatistics statsByTime={floodStatsByTime} stations={floodStations} /> */}

      {/* Safety Tips */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
           Hướng dẫn an toàn khi ngập lụt
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
               Cần tránh
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
               Nên làm
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
    </div>
  );
}
