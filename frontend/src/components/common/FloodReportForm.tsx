'use client';

import { useState } from 'react';

export interface FloodReport {
  id: string;
  location: string;
  coordinates: [number, number];
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  waterDepth: number;
  reporterName: string;
  reporterPhone: string;
  photos?: string[];
  timestamp: string;
  status: 'pending' | 'verified' | 'resolved';
}

interface FloodReportFormProps {
  onSubmit: (report: Omit<FloodReport, 'id' | 'timestamp' | 'status'>) => void;
  onClose: () => void;
}

export default function FloodReportForm({ onSubmit, onClose }: FloodReportFormProps) {
  const [formData, setFormData] = useState({
    location: '',
    coordinates: [21.0285, 105.8542] as [number, number],
    description: '',
    severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    waterDepth: 0,
    reporterName: '',
    reporterPhone: '',
    photos: [] as string[],
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
            coordinates: [position.coords.latitude, position.coords.longitude],
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

    if (!formData.location.trim()) {
      newErrors.location = 'Vui lòng nhập địa chỉ';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng mô tả tình trạng ngập';
    }
    if (formData.waterDepth <= 0) {
      newErrors.waterDepth = 'Vui lòng nhập độ sâu nước';
    }
    if (!formData.reporterName.trim()) {
      newErrors.reporterName = 'Vui lòng nhập họ tên';
    }
    if (!formData.reporterPhone.trim()) {
      newErrors.reporterPhone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10}$/.test(formData.reporterPhone.replace(/\s/g, ''))) {
      newErrors.reporterPhone = 'Số điện thoại không hợp lệ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      // Reset form
      setFormData({
        location: '',
        coordinates: [21.0285, 105.8542],
        description: '',
        severity: 'medium',
        waterDepth: 0,
        reporterName: '',
        reporterPhone: '',
        photos: [],
      });
      setUseCurrentLocation(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'border-green-500 bg-green-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'critical':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4" 
      style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" 
        style={{ position: 'relative', zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📝</span> Báo cáo ngập lụt
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ ngập <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: 123 Đường ABC, Phường XYZ, Quận DEF"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tọa độ GPS
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                value={formData.coordinates[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: [parseFloat(e.target.value), formData.coordinates[1]],
                  })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Vĩ độ"
              />
              <input
                type="number"
                step="any"
                value={formData.coordinates[1]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: [formData.coordinates[0], parseFloat(e.target.value)],
                  })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                placeholder="Kinh độ"
              />
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                📍 Vị trí hiện tại
              </button>
            </div>
            {useCurrentLocation && (
              <p className="text-green-600 text-sm mt-1">✓ Đã lấy vị trí hiện tại</p>
            )}
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức độ nghiêm trọng <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { value: 'low', label: 'Nhẹ', icon: '🟢' },
                { value: 'medium', label: 'Trung bình', icon: '🟡' },
                { value: 'high', label: 'Cao', icon: '🟠' },
                { value: 'critical', label: 'Nguy hiểm', icon: '🔴' },
              ].map((severity) => (
                <button
                  key={severity.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      severity: severity.value as any,
                    })
                  }
                  className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                    formData.severity === severity.value
                      ? getSeverityColor(severity.value) + ' border-opacity-100'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{severity.icon}</div>
                  <div className="text-sm">{severity.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Water Depth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ sâu nước (cm) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={formData.waterDepth || ''}
              onChange={(e) =>
                setFormData({ ...formData, waterDepth: parseInt(e.target.value) || 0 })
              }
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.waterDepth ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: 30"
            />
            {errors.waterDepth && (
              <p className="text-red-500 text-sm mt-1">{errors.waterDepth}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả tình trạng <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Mô tả chi tiết tình trạng ngập, phạm vi ảnh hưởng, các thiệt hại (nếu có)..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Reporter Info */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Thông tin người báo cáo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.reporterName}
                  onChange={(e) =>
                    setFormData({ ...formData, reporterName: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                    errors.reporterName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nguyễn Văn A"
                />
                {errors.reporterName && (
                  <p className="text-red-500 text-sm mt-1">{errors.reporterName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.reporterPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, reporterPhone: e.target.value })
                  }
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                    errors.reporterPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0123456789"
                />
                {errors.reporterPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.reporterPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Thông tin của bạn sẽ được bảo mật và chỉ sử dụng để
              xác minh và xử lý báo cáo ngập lụt. Cơ quan chức năng có thể liên hệ với bạn
              để xác thực thông tin.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
            >
              Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
