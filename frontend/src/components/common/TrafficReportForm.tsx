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

export interface TrafficReport {
  id: string;
  numeric_id?: number;
  reporter_username: string;
  latitude: number;
  longitude: number;
  street_name: string;
  severity: 'Low' | 'Medium' | 'High';
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
  const t = useTranslations('traffic.reportForm');
  
  const [formData, setFormData] = useState({
    reporter_username: '',
    latitude: 10.8231,
    longitude: 106.6297,
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
      newErrors.reporter_username = t('usernameRequired');
    }
    if (!formData.street_name.trim()) {
      newErrors.street_name = t('streetNameRequired');
    }
    if (!formData.description.trim()) {
      newErrors.description = t('descriptionRequired');
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
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getSeverityLabel = (severity: string) => {
    return t(`severityLevels.${severity}` as any) || severity;
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 transition-opacity duration-500 ease-out ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-500 ease-out ${
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
        style={{ position: 'relative', zIndex: 10000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Sticky */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>{t('titleIcon')}</span> {t('title')}
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
              {t('username')} <span className="text-red-500">{t('required')}</span>
            </label>
            <input
              type="text"
              value={formData.reporter_username}
              onChange={(e) => setFormData({ ...formData, reporter_username: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg   text-gray-900 placeholder:text-gray ${
                errors.reporter_username ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder={t('usernamePlaceholder')}
            />
            {errors.reporter_username && (
              <p className="text-red-500 text-sm mt-1">{errors.reporter_username}</p>
            )}
          </div>

          {/* Street Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('streetName')} <span className="text-red-500">{t('required')}</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={formData.street_name}
                onChange={(e) => setFormData({ ...formData, street_name: e.target.value })}
                className={`flex-1 px-4 py-3 border-2 rounded-lg text-black placeholder:text-gray ${
                  errors.street_name ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder={t('streetNamePlaceholder')}
              />
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>{t('currentLocationButton')}</span>
              </button>
            </div>
            {errors.street_name && <p className="text-red-500 text-sm mt-1">{errors.street_name}</p>}
            {useCurrentLocation && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <span>✓</span> {t('currentLocationSuccess', { lat: formData.latitude.toFixed(4), lng: formData.longitude.toFixed(4) })}
              </p>
            )}
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('severity')} <span className="text-red-500">{t('required')}</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(['Low', 'Medium', 'High'] as const).map((severity) => (
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
              {t('description')} <span className="text-red-500">{t('required')}</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg text-gray-800 placeholder:text-gray-400 ${
                errors.description ? 'border-red-300' : 'border-gray-200'
              }`}
              rows={4}
              placeholder={t('descriptionPlaceholder')}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-2">
              <span className="text-xl">{t('infoNote.icon')}</span>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">{t('infoNote.title')}</p>
                <ul className="space-y-1 text-xs">
                  <li>{t('infoNote.privacy')}</li>
                  <li>{t('infoNote.verification')}</li>
                  <li>{t('infoNote.accuracy')}</li>
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
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              {t('submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
