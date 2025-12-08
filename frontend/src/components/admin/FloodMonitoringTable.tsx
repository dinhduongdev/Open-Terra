/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useState } from 'react';
import { FloodMonitoringData } from '@/services/floodMonitoringService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FloodMonitoringTableProps {
  sensors: FloodMonitoringData[];
  onRefresh?: () => void;
}

export default function FloodMonitoringTable({ sensors, onRefresh }: FloodMonitoringTableProps) {
  const [selectedSensor, setSelectedSensor] = useState<FloodMonitoringData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'alert':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return 'Bình thường';
      case 'alert':
        return 'Cảnh báo';
      case 'danger':
        return 'Nguy hiểm';
      default:
        return status || 'Không xác định';
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
      second: '2-digit',
    });
  };

  const handleViewDetail = (sensor: FloodMonitoringData) => {
    setSelectedSensor(sensor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSensor(null);
  };

  // Calculate chart data
  const getWaterLevelChartData = () => {
    return sensors.map((sensor) => {
      const waterLevel = sensor.waterLevel?.value || sensor.currentLevel?.value || 0;
      const alertLevel = sensor.alertLevel?.value || 0;
      const dangerLevel = sensor.dangerLevel?.value || 0;
      const stationID = sensor.stationID?.value || sensor.id.split(':').pop() || 'N/A';

      return {
        name: stationID,
        waterLevel,
        alertLevel,
        dangerLevel,
      };
    });
  };

  const getStatusChartData = () => {
    const statusCounts: Record<string, number> = {
      normal: 0,
      alert: 0,
      danger: 0,
    };

    sensors.forEach((sensor) => {
      const status = (sensor.floodLevelStatus?.value || 'normal').toLowerCase();
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });

    return [
      { name: 'Bình thường', value: statusCounts.normal, color: '#22c55e' },
      { name: 'Cảnh báo', value: statusCounts.alert, color: '#eab308' },
      { name: 'Nguy hiểm', value: statusCounts.danger, color: '#ef4444' },
    ];
  };

  return (
    <div className="space-y-4">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Water Level Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mực nước các trạm</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getWaterLevelChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Mét (m)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="waterLevel" name="Mực nước hiện tại" fill="#3b82f6" />
              <Bar dataKey="alertLevel" name="Mức cảnh báo" fill="#eab308" />
              <Bar dataKey="dangerLevel" name="Mức nguy hiểm" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố trạng thái</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getStatusChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Số lượng trạm" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
        <label className="font-semibold text-gray-900">Cảm biến ngập lụt</label>
        <div className="ml-auto flex gap-2">
          <span className="text-sm text-gray-600">Tổng số: {sensors.length} cảm biến</span>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Làm mới
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mực nước
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mức cảnh báo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mức nguy hiểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cập nhật
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sensors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu cảm biến ngập lụt
                  </td>
                </tr>
              ) : (
                sensors.map((sensor) => {
                  const waterLevel = sensor.waterLevel?.value || sensor.currentLevel?.value || 0;
                  const alertLevel = sensor.alertLevel?.value || 0;
                  const dangerLevel = sensor.dangerLevel?.value || 0;
                  const status = sensor.floodLevelStatus?.value || 'normal';
                  const stationID = sensor.stationID?.value || sensor.id.split(':').pop() || sensor.id;
                  const address = sensor.address?.value?.streetAddress || 'N/A';
                  const description = sensor.description?.value || '';
                  const timestamp = sensor.dateObserved?.value?.['@value'] || '';

                  return (
                    <tr key={sensor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{stationID}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div>{address}</div>
                        {description && (
                          <div className="text-xs text-gray-400 truncate max-w-xs">{description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {waterLevel.toFixed(2)} m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {alertLevel.toFixed(2)} m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dangerLevel.toFixed(2)} m
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {timestamp ? formatDate(timestamp) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewDetail(sensor)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedSensor && (
        <div 
          className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết cảm biến ngập lụt</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {(() => {
                const waterLevel = selectedSensor.waterLevel?.value || selectedSensor.currentLevel?.value || 0;
                const alertLevel = selectedSensor.alertLevel?.value || 0;
                const dangerLevel = selectedSensor.dangerLevel?.value || 0;
                const referenceLevel = selectedSensor.referenceLevel?.value || 0;
                const measuredDistance = selectedSensor.measuredDistance?.value || 0;
                const status = selectedSensor.floodLevelStatus?.value || 'normal';
                const stationID = selectedSensor.stationID?.value || selectedSensor.id.split(':').pop() || selectedSensor.id;
                const [lng, lat] = selectedSensor.location?.value?.coordinates || [0, 0];
                const address = selectedSensor.address?.value?.streetAddress || 'N/A';
                const description = selectedSensor.description?.value || '';
                const timestamp = selectedSensor.dateObserved?.value?.['@value'] || '';

                return (
                  <>
                    {/* Status */}
                    <div className="flex gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Trạng thái: </span>
                        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full border ${getStatusColor(status)}`}>
                          {getStatusText(status)}
                        </span>
                      </div>
                    </div>

                    {/* Station Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Thông tin trạm</h3>
                      <p className="text-gray-700"><span className="font-medium">Mã trạm:</span> #{stationID}</p>
                      <p className="text-gray-700"><span className="font-medium">Địa chỉ:</span> {address}</p>
                      {description && (
                        <p className="text-gray-700"><span className="font-medium">Mô tả:</span> {description}</p>
                      )}
                      <p className="text-gray-700"><span className="font-medium">Tọa độ:</span> {lat.toFixed(6)}, {lng.toFixed(6)}</p>
                    </div>

                    {/* Water Level Metrics */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Thông số mực nước</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-blue-200">
                          <p className="text-xs text-gray-600 mb-1">Mực nước hiện tại</p>
                          <p className="text-2xl font-bold text-blue-700">{waterLevel.toFixed(2)} m</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-yellow-200">
                          <p className="text-xs text-gray-600 mb-1">Mức cảnh báo</p>
                          <p className="text-2xl font-bold text-yellow-700">{alertLevel.toFixed(2)} m</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-red-200">
                          <p className="text-xs text-gray-600 mb-1">Mức nguy hiểm</p>
                          <p className="text-2xl font-bold text-red-700">{dangerLevel.toFixed(2)} m</p>
                        </div>
                        {referenceLevel > 0 && (
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <p className="text-xs text-gray-600 mb-1">Mức tham chiếu</p>
                            <p className="text-2xl font-bold text-gray-700">{referenceLevel.toFixed(2)} m</p>
                          </div>
                        )}
                        {measuredDistance > 0 && (
                          <div className="bg-white p-3 rounded border border-purple-200">
                            <p className="text-xs text-gray-600 mb-1">Khoảng cách đo</p>
                            <p className="text-2xl font-bold text-purple-700">{measuredDistance.toFixed(2)} m</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {dangerLevel > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Mức độ nguy hiểm</h3>
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Mực nước so với mức nguy hiểm</span>
                          <span>{((waterLevel / dangerLevel) * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all ${
                              waterLevel >= dangerLevel
                                ? 'bg-red-500'
                                : waterLevel >= alertLevel
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((waterLevel / dangerLevel) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Thời gian cập nhật</h3>
                      <p className="text-gray-700">{timestamp ? formatDate(timestamp) : 'N/A'}</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
