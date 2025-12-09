/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useTranslations } from 'next-intl';

export default function WeatherInfo() {
  const t = useTranslations('weather.info');
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-500">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
        {t('title')}
      </h2>
      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
        <p>
          <strong>{t('dataCollectionTitle')}</strong> {t('dataCollectionDesc')}
        </p>
        <p>
          {t('measurementParameters')}
        </p>
        <p>
          <strong>{t('forecastTitle')}</strong> {t('forecastDesc')}
        </p>
        <div className="pt-3 border-t border-blue-200">
          <p className="font-semibold text-blue-900 mb-2">{t('contactTitle')}</p>
          <ul className="space-y-1 text-gray-600">
            <li>• {t('contact1')}</li>
            <li>• {t('contact2')}</li>
            <li>• {t('contact3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
