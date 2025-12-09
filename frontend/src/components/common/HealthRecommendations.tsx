/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useTranslations } from 'next-intl';
import { getHealthRecommendation } from '@/constants/airQualityMockData';

interface HealthRecommendationsProps {
  aqi: number;
}

export default function HealthRecommendations({ aqi }: HealthRecommendationsProps) {
  const t = useTranslations('airQuality.health');
  const recommendations = getHealthRecommendation(aqi);

  const getAlertColor = () => {
    if (aqi <= 50) return 'from-green-50 to-green-100 border-green-500';
    if (aqi <= 100) return 'from-yellow-50 to-yellow-100 border-yellow-500';
    if (aqi <= 150) return 'from-orange-50 to-orange-100 border-orange-500';
    if (aqi <= 200) return 'from-red-50 to-red-100 border-red-500';
    if (aqi <= 300) return 'from-purple-50 to-purple-100 border-purple-500';
    return 'from-red-100 to-red-200 border-red-700';
  };

  return (
    <div className="mt-6 md:mt-8">
      <div className={`bg-gradient-to-r ${getAlertColor()} rounded-lg shadow-md p-4 md:p-6 border-l-4`}>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* General Population */}
          {/* <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              {t('general')}
            </h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{recommendations.general}</p>
          </div> */}

          {/* Sensitive Groups */}
          {/* <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              {t('sensitive')}
            </h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{recommendations.sensitive}</p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-2">
              {t('sensitiveNote')}
            </p>
          </div> */}

          {/* Children */}
          {/* <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              {t('children')}
            </h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{recommendations.children}</p>
          </div> */}

          {/* Elderly */}
          {/* <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              {t('elderly')}
            </h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{recommendations.elderly}</p>
          </div> */}
        </div>

        {/* General Tips */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white rounded-lg p-3 md:p-4">
            <h3 className="font-semibold text-green-700 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
               {t('preventive')}
            </h3>
            <ul className="text-xs md:text-sm text-gray-700 space-y-1.5 md:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{t('preventiveTip1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{t('preventiveTip2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{t('preventiveTip3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{t('preventiveTip4')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{t('preventiveTip5')}</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-3 md:p-4">
            <h3 className="font-semibold text-red-700 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
               {t('avoid')}
            </h3>
            <ul className="text-xs md:text-sm text-gray-700 space-y-1.5 md:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{t('avoidTip1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{t('avoidTip2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{t('avoidTip3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{t('avoidTip4')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{t('avoidTip5')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Contact */}
        {aqi > 200 && (
          <div className="mt-4 p-3 md:p-4 bg-red-100 border-l-4 border-red-600 rounded">
            <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2 text-sm md:text-base">
              ⚠️ {t('emergency')}
            </h3>
            <p className="text-xs md:text-sm text-red-800 mb-2">
              {t('emergencyMessage')}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm font-semibold text-red-800">
              <span>{t('emergencyHotline')}</span>
              <span>{t('healthHotline')}</span>
              <span>{t('environmentHotline')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
