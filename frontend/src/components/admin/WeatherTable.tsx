/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useState, useEffect } from 'react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function WeatherTable() {
  const { weatherData, loading, error } = useWeatherData();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error('Không thể tải dữ liệu thời tiết');
    }
  }, [error]);

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

  const getWeatherIcon = (weatherType: string) => {
    const type = weatherType.toLowerCase();
    if (type.includes('nắng') || type.includes('sunny')) return '☀️';
    if (type.includes('mây') || type.includes('cloud')) return '☁️';
    if (type.includes('mưa') || type.includes('rain')) return '🌧️';
    if (type.includes('giông') || type.includes('storm')) return '⛈️';
    return '🌤️';
  };

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { text: 'Thấp', color: 'bg-green-100 text-green-800' };
    if (uv <= 5) return { text: 'Trung bình', color: 'bg-yellow-100 text-yellow-800' };
    if (uv <= 7) return { text: 'Cao', color: 'bg-orange-100 text-orange-800' };
    if (uv <= 10) return { text: 'Rất cao', color: 'bg-red-100 text-red-800' };
    return { text: 'Cực cao', color: 'bg-purple-100 text-purple-800' };
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Prepare chart data
  const getWeatherMetricsData = () => {
    if (!weatherData?.result) return [];
    
    return [
      {
        metric: 'Nhiệt độ',
        value: Number(weatherData.result.temperature.value),
        unit: '°C',
      },
      {
        metric: 'Cảm giác',
        value: Number(weatherData.result.feelsLikeTemperature.value),
        unit: '°C',
      },
      {
        metric: 'Độ ẩm',
        value: Number(weatherData.result.relativeHumidity.value) * 100,
        unit: '%',
      },
      {
        metric: 'Áp suất',
        value: Number(weatherData.result.atmosphericPressure.value),
        unit: 'hPa',
      },
    ];
  };

  const getWindAndVisibilityData = () => {
    if (!weatherData?.result) return [];
    
    return [
      {
        metric: 'Tốc độ gió',
        value: Number(weatherData.result.windSpeed.value),
        unit: 'km/h',
      },
      {
        metric: 'Tầm nhìn',
        value: Number(weatherData.result.visibility.value) / 1000,
        unit: 'km',
      },
      {
        metric: 'Lượng mưa',
        value: Number(weatherData.result.precipitation.value),
        unit: 'mm',
      },
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !weatherData?.result) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Lỗi</p>
        <p>{error || 'Không có dữ liệu thời tiết'}</p>
      </div>
    );
  }

  const weather = weatherData.result;
  const uvLevel = getUVLevel(weather.uVIndexMax.value as number);

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature Card */}
        <div className="bg-red-500 rounded-lg shadow-lg p-6 text-white">
          <div>
            <p className="text-sm opacity-90">Nhiệt độ</p>
            <p className="text-4xl font-bold">{Number(weather.temperature.value)}°C</p>
            <p className="text-sm mt-1">Cảm giác {Number(weather.feelsLikeTemperature.value)}°C</p>
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-blue-500 rounded-lg shadow-lg p-6 text-white">
          <div>
            <p className="text-sm opacity-90">Độ ẩm</p>
            <p className="text-4xl font-bold">{(Number(weather.relativeHumidity.value) * 100).toFixed(0)}%</p>
            <p className="text-sm mt-1">Điểm sương {Number(weather.dewPoint.value)}°C</p>
          </div>
        </div>

        {/* Wind Card */}
        <div className="bg-green-500 rounded-lg shadow-lg p-6 text-white">
          <div>
            <p className="text-sm opacity-90">Tốc độ gió</p>
            <p className="text-4xl font-bold">{Number(weather.windSpeed.value)} km/h</p>
            <p className="text-sm mt-1">Hướng {getWindDirection(weather.windDirection.value as number)}</p>
          </div>
        </div>

        {/* UV Index Card */}
        <div className="bg-purple-500 rounded-lg shadow-lg p-6 text-white">
          <div>
            <p className="text-sm opacity-90">Chỉ số UV tối đa</p>
            <p className="text-4xl font-bold">{Number(weather.uVIndexMax.value)}</p>
            <p className="text-sm mt-1">Mức độ: {uvLevel.text}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weather Metrics Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Các chỉ số thời tiết</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getWeatherMetricsData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Giá trị" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wind & Visibility Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gió và Tầm nhìn</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getWindAndVisibilityData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Giá trị" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Information Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h3>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Xem đầy đủ
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông số
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá trị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn vị
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian quan sát
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Trạm quan trắc</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={3}>{weather.name}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Khu vực</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={3}>{weather.areaServed}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Loại thời tiết</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={3}>
                  {weather.weatherType.value}
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nhiệt độ</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.temperature.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.temperature.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.temperature.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cảm giác như</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.feelsLikeTemperature.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.feelsLikeTemperature.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.feelsLikeTemperature.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Độ ẩm</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(Number(weather.relativeHumidity.value) * 100).toFixed(0)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.relativeHumidity.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Áp suất khí quyển</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.atmosphericPressure.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.atmosphericPressure.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.atmosphericPressure.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tốc độ gió</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.windSpeed.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.windSpeed.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.windSpeed.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Hướng gió</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {weather.windDirection.value}° ({getWindDirection(weather.windDirection.value as number)})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.windDirection.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.windDirection.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lượng mưa</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{Number(weather.precipitation.value)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{weather.precipitation.unitCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.precipitation.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tầm nhìn</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(Number(weather.visibility.value) / 1000).toFixed(1)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">km</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.visibility.observedAt!)}</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Chỉ số UV tối đa</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${uvLevel.color}`}>
                    {Number(weather.uVIndexMax.value)} - {uvLevel.text}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(weather.uVIndexMax.observedAt!)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Full Details Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Thông tin đầy đủ về thời tiết</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Station Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Thông tin trạm</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tên trạm</p>
                    <p className="font-medium text-gray-900">{weather.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Khu vực</p>
                    <p className="font-medium text-gray-900">{weather.areaServed}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Địa chỉ</p>
                    <p className="font-medium text-gray-900">
                      {weather.address.addressLocality}, {weather.address.addressCountry}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Nguồn dữ liệu</p>
                    <p className="font-medium text-gray-900">{weather.source}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Mô tả</p>
                    <p className="font-medium text-gray-900">{weather.description}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vị trí</h3>
                <p className="text-gray-900">
                  Tọa độ: {weather.location.coordinates[1].toFixed(6)}, {weather.location.coordinates[0].toFixed(6)}
                </p>
              </div>

              {/* Observation Time */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Thời gian quan sát</h3>
                <p className="text-gray-900">{formatDate(weather.dateObserved['@value'])}</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
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
