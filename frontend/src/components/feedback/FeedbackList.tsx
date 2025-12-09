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
import { feedbackService } from '@/services/feedbackService';
import { FeedbackResponse, FeedbackCategory, FeedbackStatus } from '@/types/feedback';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import FeedbackDetailModal from '@/components/feedback/FeedbackDetailModal';
import toast from 'react-hot-toast';

interface FeedbackListProps {
  isAdmin?: boolean;
}

export default function FeedbackList({ isAdmin = false }: FeedbackListProps) {
  const t = useTranslations('feedback');
  const tCategories = useTranslations('feedback.categories');
  const tStatus = useTranslations('feedback.status');
  
  const [feedbackList, setFeedbackList] = useState<FeedbackResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackResponse | null>(null);
  
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory | undefined>();
  const limit = 20;

  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await feedbackService.listFeedback(category, page * limit, limit);
      setFeedbackList(response.items);
      setTotal(response.total);
    } catch (err) {
      setError(t('list.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [page, category]);

  const handleStatusUpdate = async (feedbackId: number, status: FeedbackStatus) => {
    try {
      await feedbackService.updateFeedbackStatus(feedbackId, { status });
      toast.success(t('statusUpdate.success'));
      fetchFeedback();
      setSelectedFeedback(null);
    } catch (err) {
      toast.error(t('statusUpdate.error'));
    }
  };

  const totalPages = Math.ceil(total / limit);
  const startIndex = page * limit + 1;
  const endIndex = Math.min((page + 1) * limit, total);

  const getCategoryBadgeColor = (cat: FeedbackCategory): string => {
    const colors = {
      'General': 'bg-blue-100 text-blue-800',
      'Bug Report': 'bg-red-100 text-red-800',
      'Feature Request': 'bg-green-100 text-green-800',
      'Improvement': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadgeColor = (status?: FeedbackStatus): string => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewed': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
    };
    return status ? colors[status] : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchFeedback}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          {t('list.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">{t('list.filter')}</label>
          <select
            value={category || ''}
            onChange={(e) => {
              setCategory(e.target.value ? (e.target.value as FeedbackCategory) : undefined);
              setPage(0);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">{t('list.filterAll')}</option>
            {Object.values(FeedbackCategory).map((cat) => (
              <option key={cat} value={cat}>
                {tCategories(cat)}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm text-gray-600">
          {total > 0 ? t('list.showingResults', { start: startIndex, end: endIndex, total }) : ''}
        </div>
      </div>

      {/* Table */}
      {feedbackList.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>{t('list.noFeedback')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.id')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.name')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.category')}
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t('table.status')}
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.date')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbackList.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{feedback.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{feedback.username}</div>
                      <div className="text-sm text-gray-500">{feedback.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryBadgeColor(feedback.category)}`}>
                        {tCategories(feedback.category)}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(feedback.status)}`}>
                          {feedback.status ? tStatus(feedback.status) : tStatus('pending')}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(feedback.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedFeedback(feedback)}
                        className="text-emerald-600 hover:text-emerald-900 font-medium"
                      >
                        {t('table.view')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('list.previous')}
          </button>
          <span className="px-4 py-2 text-gray-700">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t('list.next')}
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          isAdmin={isAdmin}
          onClose={() => setSelectedFeedback(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
