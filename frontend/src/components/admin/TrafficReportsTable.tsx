/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useState, useEffect } from 'react';
import { TrafficReport } from '@/components/common/TrafficReportForm';
import { getTrafficReports, verifyTrafficReport } from '@/services/trafficReportService';
import { useTranslations } from 'next-intl';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function TrafficReportsTable() {
  const t = useTranslations('traffic');
  const tAdmin = useTranslations('adminTrafficReports');
  const [reports, setReports] = useState<TrafficReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'Reported' | 'Verified' | undefined>(undefined);
  const [selectedReport, setSelectedReport] = useState<TrafficReport | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReports();
  }, [currentPage, statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const skip = (currentPage - 1) * itemsPerPage;
      const data = await getTrafficReports(skip, itemsPerPage, statusFilter);
      setReports(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch reports';
      setError(errorMessage);
      toast.error(tAdmin('errors.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Reported':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetail = (report: TrafficReport) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleVerify = async (report: TrafficReport) => {
    if (!report.numeric_id) {
      toast.error(tAdmin('errors.verifyInvalidId'));
      return;
    }
    try {
      setVerifying(report.id);
      await verifyTrafficReport(report.numeric_id);
      toast.success(tAdmin('success.verified'));
      // After verification, refresh the list
      await fetchReports();
    } catch (err) {
      console.error('Error verifying report:', err);
      toast.error(tAdmin('errors.verifyFailed'));
    } finally {
      setVerifying(null);
    }
  };

  // Calculate chart data
  const getSeverityChartData = () => {
    const severityCounts: Record<string, number> = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0,
    };

    reports.forEach((report) => {
      if (severityCounts[report.severity] !== undefined) {
        severityCounts[report.severity]++;
      }
    });

    return [
      { name: 'Critical', value: severityCounts.Critical, color: '#ef4444' },
      { name: 'High', value: severityCounts.High, color: '#f97316' },
      { name: 'Medium', value: severityCounts.Medium, color: '#eab308' },
      { name: 'Low', value: severityCounts.Low, color: '#22c55e' },
    ];
  };

  const getStatusChartData = () => {
    const statusCounts: Record<string, number> = {
      Reported: 0,
      Verified: 0,
    };

    reports.forEach((report) => {
      if (statusCounts[report.status] !== undefined) {
        statusCounts[report.status]++;
      }
    });

    return [
      { name: tAdmin('status.reported'), value: statusCounts.Reported, color: '#eab308' },
      { name: tAdmin('status.verified'), value: statusCounts.Verified, color: '#3b82f6' },
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">{tAdmin('error')}</p>
        <p>{error}</p>
        <button
          onClick={fetchReports}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {tAdmin('retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Severity Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{tAdmin('charts.bySeverity')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getSeverityChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={tAdmin('charts.count')}>
                {getSeverityChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{tAdmin('charts.byStatus')}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getStatusChartData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getStatusChartData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
        <label className="font-semibold text-gray-900">{tAdmin('filter')}:</label>
        <select
          value={statusFilter || 'all'}
          onChange={(e) => {
            setStatusFilter(e.target.value === 'all' ? undefined : e.target.value as 'Reported' | 'Verified');
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="all">{tAdmin('filterAll')}</option>
          <option value="Reported">{tAdmin('filterReported')}</option>
          <option value="Verified">{tAdmin('filterVerified')}</option>
        </select>
        <button
          onClick={fetchReports}
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {tAdmin('refresh')}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tAdmin('table.reporter')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tAdmin('table.location')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tAdmin('table.severity')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tAdmin('table.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tAdmin('table.description')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tAdmin('table.time')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tAdmin('table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    {tAdmin('table.noReports')}
                  </td>
                </tr>
              ) : (
                reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {report.reporter_username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{report.street_name}</div>
                      <div className="text-xs text-gray-400">
                        {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getSeverityColor(report.severity)}`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate">{report.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(report.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetail(report)}
                        className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 mr-2"
                      >
                        {tAdmin('table.view')}
                      </button>
                      {report.status === 'Reported' && (
                        <button 
                          onClick={() => handleVerify(report)}
                          disabled={verifying === report.id}
                          className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {verifying === report.id ? tAdmin('verifying') : tAdmin('verify')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-700">
          {tAdmin('page')} {currentPage}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tAdmin('pagination.previous')}
          </button>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={reports.length < itemsPerPage}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {tAdmin('pagination.next')}
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedReport && (
        <div 
          className="fixed inset-0  bg-opacity-10 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{tAdmin('modal.title')}</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status and Severity */}
              <div className="flex gap-4">
                <div>
                  <span className="text-sm text-gray-600">{tAdmin('modal.status')}: </span>
                  <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full border ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status === 'Reported' ? tAdmin('status.reported') : tAdmin('status.verified')}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{tAdmin('modal.severity')}: </span>
                  <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full border ${getSeverityColor(selectedReport.severity)}`}>
                    {selectedReport.severity}
                  </span>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{tAdmin('modal.reporterInfo')}</h3>
                <p className="text-gray-700"><span className="font-medium">{tAdmin('modal.name')}:</span> {selectedReport.reporter_username}</p>
                <p className="text-gray-700"><span className="font-medium">{tAdmin('modal.time')}:</span> {formatDate(selectedReport.timestamp)}</p>
              </div>

              {/* Location Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">{tAdmin('modal.location')}</h3>
                <p className="text-gray-700"><span className="font-medium">{tAdmin('modal.street')}:</span> {selectedReport.street_name}</p>
                <p className="text-gray-700"><span className="font-medium">{tAdmin('modal.coordinates')}:</span> {selectedReport.latitude.toFixed(6)}, {selectedReport.longitude.toFixed(6)}</p>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{tAdmin('modal.description')}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedReport.description}</p>
              </div>

              {/* Photos */}
              {selectedReport.photo_urls && selectedReport.photo_urls.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tAdmin('modal.photos')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedReport.photo_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              >
                {tAdmin('close')}
              </button>
              {selectedReport.status === 'Reported' && (
                <button
                  onClick={() => {
                    handleVerify(selectedReport);
                    handleCloseModal();
                  }}
                  disabled={verifying === selectedReport.id}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {verifying === selectedReport.id ? tAdmin('verifying') : tAdmin('modal.verifyButton')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
