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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAIAdvisorAdvice } from '@/services/aiAdvisorService';
import type { AIAdvisorResult } from '@/types/aiAdvisor';

export default function AIAdvisorSection() {
    const t = useTranslations('overview.aiAdvisor');
    const [aiAdvice, setAiAdvice] = useState<AIAdvisorResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchAIAdvice() {
        try {
            setLoading(true);
            const advice = await getAIAdvisorAdvice();
            setAiAdvice(advice);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch AI advice:', err);
            setError(t('error'));
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <section className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-200">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            {t('title')}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                            <span>{t('loading')}</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-200">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            {t('title')}
                        </h2>
                        <p className="text-red-600 mb-4">
                            {error}
                        </p>
                        <button
                            onClick={fetchAIAdvice}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            {t('retry')}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (!aiAdvice) {
        return (
            <section className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-200">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            {t('title')}
                        </h2>
                        <p className="text-gray-900 mb-4">
                            {t('description')}
                        </p>
                        <button
                            onClick={fetchAIAdvice}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {t('getAdvice')}
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-blue-200">
            <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                {t('title')}
                            </h2>
                            <p className="text-sm text-gray-900">
                                {t('updatedAt')}: {new Date(aiAdvice.timestamp).toLocaleString()}
                            </p>
                        </div>
                        <button
                            onClick={fetchAIAdvice}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            {t('refresh')}
                        </button>
                    </div>
                </div>
            </div>

            <div className="prose prose-slate max-w-none mb-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {aiAdvice.advice}
                </ReactMarkdown>
            </div>

            {aiAdvice.data_sources && (
                <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm text-gray-900 mb-2">
                        {t('dataSources')}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {aiAdvice.data_sources.air_quality && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Air Quality
                            </span>
                        )}
                        {aiAdvice.data_sources.weather && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Weather
                            </span>
                        )}
                        {aiAdvice.data_sources.traffic && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Traffic
                            </span>
                        )}
                        {aiAdvice.data_sources.flood && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Flood
                            </span>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
