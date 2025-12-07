/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useTranslations } from 'next-intl';
import { TrafficReport } from './TrafficReportForm';

interface TrafficReportsListProps {
  reports: TrafficReport[];
}

export default function TrafficReportsList({ reports }: TrafficReportsListProps) {
  const t = useTranslations('traffic.reportsList');
  
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

  const getSeverityLabel = (severity: string) => {
    return t(`severity.${severity}` as any) || severity;
  };

  const getStatusBadge = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    const statusText = t(`status.${normalizedStatus}` as any) || status;
    
    switch (normalizedStatus) {
      case 'reported':
        return (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            {statusText}
          </span>
        );
      case 'verified':
        return (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            {statusText}
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {statusText}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
            {statusText}
          </span>
        );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return t('justNow');
    if (minutes < 60) return `${minutes} ${t('minutesAgo')}`;
    if (hours < 24) return `${hours} ${t('hoursAgo')}`;
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {t('title')} ({reports.length})
      </h2>

      {reports.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <span className="text-4xl mb-2 block">{t('noReportsIcon')}</span>
          <p>{t('noReportsMessage')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800">{report.street_name}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(
                          report.severity
                        )}`}
                      >
                        {getSeverityLabel(report.severity)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatTimestamp(report.timestamp)}
                    </p>
                  </div>
                </div>
                {getStatusBadge(report.status)}
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-3 pl-11">{report.description}</p>

              {/* Reporter Info */}
              <div className="flex items-center justify-between pl-11 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>👤</span>
                  <span>{report.reporter_username}</span>
                </div>
                <button 
                  onClick={() => {
                    // Scroll to map or highlight marker
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {t('viewOnMap')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
