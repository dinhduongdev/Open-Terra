/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AirQualityTable from '@/components/admin/AirQualityTable';

export default function AdminAirQualityPage() {
  const t = useTranslations('adminAirQuality');
  
  // Update document title
  useEffect(() => {
    document.title = `Open-Terra - ${t('title')}`;
  }, [t]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('description')}</p>
        </div>
      </div>
      
      <AirQualityTable />
    </div>
  );
}
