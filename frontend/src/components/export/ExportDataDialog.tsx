/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { entityHistoryService } from '@/services/entityHistoryService';
import { ExportParams, ExportFormat } from '@/types/entityHistory';

interface ExportDataDialogProps {
  onClose: () => void;
  defaultEntityType?: string;
}

export default function ExportDataDialog({ onClose, defaultEntityType }: ExportDataDialogProps) {
  const t = useTranslations('export');
  const [isExporting, setIsExporting] = useState(false);
  const [useLastN, setUseLastN] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  
  const [formData, setFormData] = useState<ExportParams>({
    entity_type: defaultEntityType || 'AirQualityObserved',
    format: 'csv',
    entity_id: '',
    start_time: '',
    end_time: '',
    last_n: 24,
    attrs: '',
  });

  const entityTypes = [
    'AirQualityObserved',
    'WeatherObserved',
    'TrafficFlowObserved',
    'FloodMonitoring',
  ];

  useEffect(() => {
    // Trigger animation after mount
    setIsOpen(true);
  }, []);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleExport = async () => {
    // Validation
    if (!useLastN && (!formData.start_time || !formData.end_time)) {
      toast.error(t('validationError'));
      return;
    }

    if (useLastN && (!formData.last_n || formData.last_n < 1 || formData.last_n > 10000)) {
      toast.error(t('validationError'));
      return;
    }

    setIsExporting(true);

    try {
      // Build export params
      const params: ExportParams = {
        entity_type: formData.entity_type,
        format: formData.format,
      };

      if (formData.entity_id) {
        params.entity_id = formData.entity_id;
      }

      if (useLastN && formData.last_n) {
        params.last_n = formData.last_n;
      } else if (!useLastN) {
        params.start_time = formData.start_time;
        params.end_time = formData.end_time;
      }

      if (formData.attrs) {
        params.attrs = formData.attrs;
      }

      // Add tenant for FloodMonitoring and TrafficFlowObserved
      if (formData.entity_type === 'FloodMonitoring' || formData.entity_type === 'TrafficFlowObserved') {
        params.tenant = 'openiot';
      }

      // Export data
      const blob = await entityHistoryService.exportEntityHistory(params);
      
      // Generate filename
      const filename = `export_${params.entity_type}_${Date.now()}.${params.format}`;
      
      // Download file
      entityHistoryService.downloadFile(blob, filename);

      toast.success(t('success'));
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('error'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'last_n' ? (value ? parseInt(value) : undefined) : value,
    }));
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
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{t('title')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Entity Type */}
          <div>
            <label htmlFor="entity_type" className="block text-sm font-medium text-gray-700 mb-2">
              {t('entityType')} <span className="text-red-500">*</span>
            </label>
            <select
              id="entity_type"
              name="entity_type"
              value={formData.entity_type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800"
            >
              {entityTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`entityTypes.${type}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('format')} <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center text-gray-800">
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={formData.format === 'csv'}
                  onChange={handleChange}
                  className="mr-2"
                />
                {t('formatCsv')}
              </label>
              <label className="flex items-center text-gray-800">
                <input
                  type="radio"
                  name="format"
                  value="json"
                  checked={formData.format === 'json'}
                  onChange={handleChange}
                  className="mr-2"
                />
                {t('formatJson')}
              </label>
            </div>
          </div>

          {/* Entity ID */}
          <div>
            <label htmlFor="entity_id" className="block text-sm font-medium text-gray-700 mb-2">
              {t('entityId')}
            </label>
            <input
              type="text"
              id="entity_id"
              name="entity_id"
              value={formData.entity_id}
              onChange={handleChange}
              placeholder={t('entityIdPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('timeRange')}
            </label>
            
            {/* Last N */}
            <div className="mb-4">
              <label className="flex items-center mb-2 text-gray-800">
                <input
                  type="radio"
                  checked={useLastN}
                  onChange={() => setUseLastN(true)}
                  className="mr-2"
                />
                {t('lastN')}
              </label>
              {useLastN && (
                <input
                  type="number"
                  name="last_n"
                  value={formData.last_n || ''}
                  onChange={handleChange}
                  placeholder={t('lastNPlaceholder')}
                  min="1"
                  max="10000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              )}
            </div>

            {/* Custom Range */}
            <div>
              <label className="flex items-center mb-2 text-gray-800">
                <input
                  type="radio"
                  checked={!useLastN}
                  onChange={() => setUseLastN(false)}
                  className="mr-2"
                />
                {t('customRange')}
              </label>
              {!useLastN && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t('startTime')}</label>
                    <input
                      type="datetime-local"
                      name="start_time"
                      value={formData.start_time ? formData.start_time.slice(0, 16) : ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          start_time: e.target.value ? `${e.target.value}:00Z` : '',
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">{t('endTime')}</label>
                    <input
                      type="datetime-local"
                      name="end_time"
                      value={formData.end_time ? formData.end_time.slice(0, 16) : ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          end_time: e.target.value ? `${e.target.value}:00Z` : '',
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attributes */}
          <div>
            <label htmlFor="attrs" className="block text-sm font-medium text-gray-700 mb-2">
              {t('attributes')}
            </label>
            <input
              type="text"
              id="attrs"
              name="attrs"
              value={formData.attrs}
              onChange={handleChange}
              placeholder={t('attributesPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? t('exporting') : t('export')}
          </button>
        </div>
      </div>
    </div>
  );
}
