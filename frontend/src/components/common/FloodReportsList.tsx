/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { FloodReport } from './FloodReportForm';

interface FloodReportsListProps {
  reports: FloodReport[];
}

export default function FloodReportsList({ reports }: FloodReportsListProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'Nhẹ';
      case 'medium':
        return 'Trung bình';
      case 'high':
        return 'Cao';
      case 'critical':
        return 'Nguy hiểm';
      default:
        return 'Không xác định';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return '🟢';
      case 'medium':
        return '🟡';
      case 'high':
        return '🟠';
      case 'critical':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Đang xử lý';
      case 'verified':
        return 'Đã xác minh';
      case 'resolved':
        return 'Đã giải quyết';
      default:
        return 'Không xác định';
    }
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">📋</div>
        <p className="text-gray-500 text-lg">Chưa có báo cáo nào từ người dân</p>
        <p className="text-gray-400 text-sm mt-2">
          Các báo cáo ngập lụt sẽ được hiển thị tại đây
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>📋</span> Báo cáo từ người dân ({reports.length})
      </h2>
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getSeverityIcon(report.severity)}</span>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {report.location}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium border ${getSeverityColor(
                      report.severity
                    )}`}
                  >
                    {getSeverityText(report.severity)}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {getStatusText(report.status)}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-800">
                    💧 {report.waterDepth} cm
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded">
              {report.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <span>👤</span>
                <span>
                  <strong>Người báo:</strong> {report.reporterName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>📞</span>
                <span>
                  <strong>SĐT:</strong> {report.reporterPhone}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>📍</span>
                <span>
                  <strong>Tọa độ:</strong> {report.coordinates[0].toFixed(4)},{' '}
                  {report.coordinates[1].toFixed(4)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>🕐</span>
                <span>
                  <strong>Thời gian:</strong>{' '}
                  {new Date(report.timestamp).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            {report.status === 'pending' && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-medium transition-colors">
                    ✓ Xác minh
                  </button>
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors">
                    📞 Liên hệ
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm font-medium transition-colors">
                    ❌ Từ chối
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
