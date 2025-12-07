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
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'Nhẹ';
      case 'Medium':
        return 'Trung bình';
      case 'High':
        return 'Cao';
      case 'Critical':
        return 'Nguy hiểm';
      default:
        return severity;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low':
        return '🟢';
      case 'Medium':
        return '🟡';
      case 'High':
        return '🟠';
      case 'Critical':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'reported':
        return 'bg-yellow-100 text-yellow-800';
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'reported':
        return 'Đã báo cáo';
      case 'verified':
        return 'Đã xác minh';
      case 'resolved':
        return 'Đã giải quyết';
      default:
        return status;
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
                    {report.street_name}
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
                  <strong>Người báo:</strong> {report.reporter_username}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span>📍</span>
                <span>
                  <strong>Tọa độ:</strong> {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
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
          </div>
        ))}
      </div>
    </div>
  );
}
