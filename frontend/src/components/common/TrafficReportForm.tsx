/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useState } from 'react';

export interface TrafficReport {
  id: string;
  reporter_username: string;
  latitude: number;
  longitude: number;
  street_name: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  photo_urls?: string[];
  timestamp: string;
  status: string;
  created_at?: string;
}

interface TrafficReportFormProps {
  onSubmit: (report: Omit<TrafficReport, 'id' | 'timestamp' | 'status'>) => void;
  onClose: () => void;
}

export default function TrafficReportForm({ onSubmit, onClose }: TrafficReportFormProps) {
  const [formData, setFormData] = useState({
    reporter_username: '',
    latitude: 10.8231,
    longitude: 106.6297,
    street_name: '',
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    description: '',
    photo_urls: [] as string[],
  });

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setUseCurrentLocation(true);
        },
        (error) => {
          alert('Không thể lấy vị trí hiện tại. Vui lòng nhập thủ công.');
          console.error(error);
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị.');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.reporter_username.trim()) {
      newErrors.reporter_username = 'Vui lòng nhập tên người dùng';
    }
    if (!formData.street_name.trim()) {
      newErrors.street_name = 'Vui lòng nhập tên đường';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng mô tả tình trạng giao thông';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-100 border-green-300';
      case 'Medium':
        return 'bg-yellow-100 border-yellow-300';
      case 'High':
        return 'bg-orange-100 border-orange-300';
      case 'Critical':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'Thấp';
      case 'Medium':
        return 'Trung bình';
      case 'High':
        return 'Cao';
      case 'Critical':
        return 'Nghiêm trọng';
      default:
        return severity;
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ position: 'relative', zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>🚦</span> Báo cáo tình trạng giao thông
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên người dùng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.reporter_username}
              onChange={(e) => setFormData({ ...formData, reporter_username: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder:text-gray-900 ${
                errors.reporter_username ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="john_doe"
            />
            {errors.reporter_username && (
              <p className="text-red-500 text-sm mt-1">{errors.reporter_username}</p>
            )}
          </div>

          {/* Street Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên đường <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.street_name}
                onChange={(e) => setFormData({ ...formData, street_name: e.target.value })}
                className={`flex-1 px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder:text-gray-900 ${
                  errors.street_name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="VD: Nguyen Hue Street"
              />
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <span className="text-xl">📍</span>
                <span className="hidden sm:inline">Vị trí hiện tại</span>
              </button>
            </div>
            {errors.street_name && <p className="text-red-500 text-sm mt-1">{errors.street_name}</p>}
            {useCurrentLocation && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <span>✓</span> Đã sử dụng vị trí hiện tại (Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)})
              </p>
            )}
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mức độ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['Low', 'Medium', 'High', 'Critical'] as const).map((severity) => (
                <button
                  key={severity}
                  type="button"
                  onClick={() => setFormData({ ...formData, severity })}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.severity === severity
                      ? 'border-red-500 ' + getSeverityColor(severity)
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-xs font-medium text-gray-900">{getSeverityLabel(severity)}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder:text-gray-900 ${
                errors.description ? 'border-red-300' : 'border-gray-200'
              }`}
              rows={4}
              placeholder="Mô tả tình trạng giao thông: kẹt xe từ đâu đến đâu, nguyên nhân nếu biết..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-2">
              <span className="text-xl">ℹ️</span>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Lưu ý:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Thông tin của bạn sẽ được bảo mật</li>
                  <li>• Báo cáo sẽ được xác minh trước khi hiển thị công khai</li>
                  <li>• Cung cấp thông tin chính xác để hỗ trợ cộng đồng tốt hơn</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
