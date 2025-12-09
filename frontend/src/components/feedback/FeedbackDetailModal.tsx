/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FeedbackResponse, FeedbackStatus } from '@/types/feedback';

interface FeedbackDetailModalProps {
  feedback: FeedbackResponse;
  isAdmin?: boolean;
  onClose: () => void;
  onStatusUpdate?: (feedbackId: number, status: FeedbackStatus) => void;
}

export default function FeedbackDetailModal({
  feedback,
  isAdmin = false,
  onClose,
  onStatusUpdate,
}: FeedbackDetailModalProps) {
  const t = useTranslations('feedback');
  const tCategories = useTranslations('feedback.categories');
  const tStatus = useTranslations('feedback.status');
  const [selectedStatus, setSelectedStatus] = useState<FeedbackStatus>(
    feedback.status || FeedbackStatus.PENDING
  );

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(feedback.email);
  };

  const handleStatusChange = () => {
    if (onStatusUpdate) {
      onStatusUpdate(feedback.id, selectedStatus);
    }
  };

  const getCategoryBadgeColor = (cat: string): string => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Bug Report': 'bg-red-100 text-red-800',
      'Feature Request': 'bg-green-100 text-green-800',
      'Improvement': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[cat as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {t('detail.title')} #{feedback.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Category Badge */}
          <div>
            <span className={`px-3 py-1 text-sm rounded-full ${getCategoryBadgeColor(feedback.category)}`}>
              {tCategories(feedback.category)}
            </span>
          </div>

          {/* Submitted By */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              👤 {t('detail.submittedBy')}
            </h3>
            <p className="text-gray-900 font-medium">{feedback.username}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-600">{feedback.email}</p>
              <button
                onClick={handleCopyEmail}
                className="text-emerald-600 hover:text-emerald-700 text-sm"
                title={t('detail.copyEmail')}
              >
                📋
              </button>
            </div>
          </div>

          {/* Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              📅 {t('detail.date')}
            </h3>
            <p className="text-gray-900">{formatDate(feedback.created_at)}</p>
          </div>

          {/* Status (Admin only) */}
          {isAdmin && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                🔖 {t('detail.status')}
              </h3>
              <div className="flex items-center gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as FeedbackStatus)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {Object.values(FeedbackStatus).map((status) => (
                    <option key={status} value={status}>
                      {tStatus(status)}
                    </option>
                  ))}
                </select>
                {selectedStatus !== (feedback.status || FeedbackStatus.PENDING) && (
                  <button
                    onClick={handleStatusChange}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    {t('detail.changeStatus')}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              💬 {t('detail.message')}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-900">
              {feedback.message}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            {t('detail.back')}
          </button>
        </div>
      </div>
    </div>
  );
}
