/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import FeedbackTable from '@/components/admin/FeedbackTable';
import { useTranslations } from 'next-intl';
import { generatePageMetadata } from '@/utils/metadata';

export async function generateMetadata() {
  return generatePageMetadata('adminFeedback');
}

export default function AdminFeedbackPage() {
  const t = useTranslations('feedback');

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('list.title')}</h1>
        <p className="text-gray-600">{t('subtitle')}</p>
      </div>

      <FeedbackTable />
    </div>
  );
}
