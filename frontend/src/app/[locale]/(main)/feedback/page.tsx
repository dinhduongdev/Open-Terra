/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/utils/metadata';
import FeedbackForm from '@/components/feedback/FeedbackForm';

export async function generateMetadata() {
  return generatePageMetadata('feedback');
}

export default async function FeedbackPage() {
  const t = await getTranslations('feedback');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h1>
            <p className="text-lg text-emerald-50">{t('subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('form.title')}</h2>
            <FeedbackForm />
          </div>

        </div>
      </div>
    </div>
  );
}
