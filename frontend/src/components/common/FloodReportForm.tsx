/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getAddressFromCoordinates } from '@/services/floodReportService';

export interface FloodReport {
  id: string;
  numeric_id?: number;
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

interface FloodReportFormProps {
  onSubmit: (report: Omit<FloodReport, 'id' | 'timestamp' | 'status'>) => void;
  onClose: () => void;
}

export default function FloodReportForm({ onSubmit, onClose }: FloodReportFormProps) {
  const t = useTranslations('floodMap.citizenReport.form');
  const tReport = useTranslations('floodMap.citizenReport');
  const tSeverity = useTranslations('floodMap.reportsList.severity');
  
  const [formData, setFormData] = useState({
    reporter_username: '',
    latitude: 10.7769,
    longitude: 106.7009,
    street_name: '',
    severity: 'Medium' as 'Low' | 'Medium' | 'High',
    description: '',
    photo_urls: [] as string[],
  });

  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setIsOpen(true);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            // Get address from coordinates using service
            const streetName = await getAddressFromCoordinates(lat, lon);
            
            setFormData((prevData) => ({
              ...prevData,
              latitude: lat,
              longitude: lon,
              street_name: streetName,
            }));
            setUseCurrentLocation(true);
          } catch (error) {
            console.error('Error fetching address:', error);
            // Still update coordinates even if address fetch fails
            setFormData((prevData) => ({
              ...prevData,
              latitude: lat,
              longitude: lon,
            }));
            setUseCurrentLocation(true);
          }
        },
        (error) => {
          alert(t('locationError'));
          console.error(error);
        }
      );
    } else {
      alert(t('locationNotSupported'));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.reporter_username.trim()) {
      newErrors.reporter_username = t('reporterNamePlaceholder');
    }
    if (!formData.street_name.trim()) {
      newErrors.street_name = t('locationPlaceholder');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('descriptionPlaceholder');
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
        reporter_username: '',
        latitude: 10.7769,
        longitude: 106.7009,
        street_name: '',
        severity: 'Medium',
        description: '',
        photo_urls: [],
      });
      setUseCurrentLocation(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low':
        return 'border-green-500 bg-green-50';
      case 'Medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'High':
        return 'border-orange-500 bg-orange-50';
      case 'Critical':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-500 ease-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-500 ease-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ position: 'relative', zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             {tReport('title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Reporter Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reporterName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.reporter_username}
              onChange={(e) => setFormData({ ...formData, reporter_username: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg  text-gray-900 ${
                errors.reporter_username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Phạm Đình Dương"
            />
            {errors.reporter_username && (
              <p className="text-red-500 text-sm mt-1">{errors.reporter_username}</p>
            )}
          </div>

          {/* Street Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('location')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.street_name}
              onChange={(e) => setFormData({ ...formData, street_name: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg  text-gray-900 ${
                errors.street_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('locationPlaceholder')}
            />
            {errors.street_name && (
              <p className="text-red-500 text-sm mt-1">{errors.street_name}</p>
            )}
          </div>

          {/* Coordinates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('coordinates')}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: parseFloat(e.target.value),
                  })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder={t('latitude')}
              />
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: parseFloat(e.target.value),
                  })
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900"
                placeholder={t('longitude')}
              />
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap"
              >
                {t('currentLocation')}
              </button>
            </div>
            {useCurrentLocation && (
              <p className="text-green-600 text-sm mt-1">✓ {t('currentLocation')} (Lat: {formData.latitude.toFixed(4)}, Lng: {formData.longitude.toFixed(4)})</p>
            )}
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('severity')} <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-900">
              {[
                { value: 'Low', label: tSeverity('Low'), icon: '' },
                { value: 'Medium', label: tSeverity('Medium'), icon: '' },
                { value: 'High', label: tSeverity('High'), icon: '' },
              ].map((severity) => (
                <button
                  key={severity.value}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      severity: severity.value as 'Low' | 'Medium' | 'High',
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('description')} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg  text-gray-900 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={t('descriptionPlaceholder')}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              {t('privacyNotice')}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
            >
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
