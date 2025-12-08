/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useState, useEffect } from 'react';
import { TrafficFlowData } from '@/services/trafficFlowService';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrafficFlowTableProps {
  sensors: TrafficFlowData[];
  onRefresh?: () => void;
}

export default function TrafficFlowTable({ sensors, onRefresh }: TrafficFlowTableProps) {
  const [selectedSensor, setSelectedSensor] = useState<TrafficFlowData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (speed: number, congested: boolean) => {
    if (congested) return 'bg-red-100 text-red-800 border-red-300';
    if (speed > 40) return 'bg-green-100 text-green-800 border-green-300';
    if (speed > 25) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  const getStatusText = (speed: number, congested: boolean) => {
    if (congested) return 'Tắc nghẽn';
    if (speed > 40) return 'Thông thoáng';
    if (speed > 25) return 'Chậm';
    return 'Kẹt xe';
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

  const handleViewDetail = (sensor: TrafficFlowData) => {
    setSelectedSensor(sensor);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSensor(null);
  };

  // Calculate chart data
  const getSpeedChartData = () => {
    return sensors.map((sensor) => ({
      name: sensor.id.split(':').pop() || 'N/A',
      speed: sensor.averageVehicleSpeed?.value || 0,
    }));
  };

  const getIntensityOccupancyChartData = () => {
    return sensors.map((sensor) => ({
      name: sensor.id.split(':').pop() || 'N/A',
      intensity: sensor.intensity?.value || 0,
      occupancy: sensor.occupancy?.value || 0,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Speed Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tốc độ trung bình các cảm biến</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getSpeedChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'km/h', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="speed" name="Tốc độ (km/h)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Intensity & Occupancy Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cường độ & Mật độ giao thông</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getIntensityOccupancyChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="intensity" name="Cường độ" stroke="#8b5cf6" strokeWidth={2} />
              <Line type="monotone" dataKey="occupancy" name="Mật độ (%)" stroke="#ec4899" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-lg shadow">
        <label className="font-semibold text-gray-900">Cảm biến giao thông</label>
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
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tốc độ TB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cường độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mật độ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Làn đường
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
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    Không có dữ liệu cảm biến giao thông
                  </td>
                </tr>
              ) : (
                sensors.map((sensor) => {
                  const speed = sensor.averageVehicleSpeed?.value || 0;
                  const congested = sensor.congested?.value || false;
                  const intensity = sensor.intensity?.value || 0;
                  const occupancy = sensor.occupancy?.value || 0;
                  const laneId = sensor.laneId?.value || 'N/A';
                  const stationID = sensor.id.split(':').pop() || sensor.id;
                  const [lng, lat] = sensor.location?.value?.coordinates || [0, 0];
                  const timestamp = sensor.dateObserved?.value?.['@value'] || '';

                  return (
                    <tr key={sensor.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{stationID}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="text-xs text-gray-400">
                          {lat.toFixed(4)}, {lng.toFixed(4)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(speed, congested)}`}>
                          {getStatusText(speed, congested)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {speed.toFixed(1)} km/h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {intensity} xe/phút
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(occupancy * 100).toFixed(0)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {laneId}
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
              <h2 className="text-2xl font-bold text-gray-900">Chi tiết cảm biến giao thông</h2>
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
                const speed = selectedSensor.averageVehicleSpeed?.value || 0;
                const congested = selectedSensor.congested?.value || false;
                const intensity = selectedSensor.intensity?.value || 0;
                const occupancy = selectedSensor.occupancy?.value || 0;
                const laneId = selectedSensor.laneId?.value || 'N/A';
                const stationID = selectedSensor.id.split(':').pop() || selectedSensor.id;
                const [lng, lat] = selectedSensor.location?.value?.coordinates || [0, 0];
                const address = selectedSensor.address?.value?.streetAddress || 'N/A';
                const timestamp = selectedSensor.dateObserved?.value?.['@value'] || '';

                return (
                  <>
                    {/* Status */}
                    <div className="flex gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Trạng thái: </span>
                        <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full border ${getStatusColor(speed, congested)}`}>
                          {getStatusText(speed, congested)}
                        </span>
                      </div>
                    </div>

                    {/* Station Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Thông tin trạm</h3>
                      <p className="text-gray-700"><span className="font-medium">Mã trạm:</span> #{stationID}</p>
                      <p className="text-gray-700"><span className="font-medium">Làn đường:</span> {laneId}</p>
                      <p className="text-gray-700"><span className="font-medium">Địa chỉ:</span> {address}</p>
                      <p className="text-gray-700"><span className="font-medium">Tọa độ:</span> {lat.toFixed(6)}, {lng.toFixed(6)}</p>
                    </div>

                    {/* Traffic Metrics */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Thông số giao thông</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded border border-blue-200">
                          <p className="text-xs text-gray-600 mb-1">Tốc độ trung bình</p>
                          <p className="text-2xl font-bold text-blue-700">{speed.toFixed(1)} km/h</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-purple-200">
                          <p className="text-xs text-gray-600 mb-1">Cường độ xe</p>
                          <p className="text-2xl font-bold text-purple-700">{intensity} xe/phút</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-orange-200">
                          <p className="text-xs text-gray-600 mb-1">Mật độ đường</p>
                          <p className="text-2xl font-bold text-orange-700">{(occupancy * 100).toFixed(0)}%</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-red-200">
                          <p className="text-xs text-gray-600 mb-1">Tắc nghẽn</p>
                          <p className="text-2xl font-bold text-red-700">{congested ? 'Có' : 'Không'}</p>
                        </div>
                      </div>
                    </div>

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
