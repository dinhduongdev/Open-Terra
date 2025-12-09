/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useTranslations } from 'next-intl';

const WeatherTipCard = ({ 
  icon, 
  title, 
  tips, 
  gradient 
}: { 
  icon: string; 
  title: string; 
  tips: string[]; 
  gradient: string;
}) => (
  <div className={`${gradient} rounded-lg shadow-md p-4 sm:p-6 border-l-4 ${
    icon === '☀️' ? 'border-orange-500' : 'border-blue-500'
  }`}>
    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
      <span>{icon}</span>
      <span>{title}</span>
    </h2>
    <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
      {tips.map((tip, index) => (
        <li key={index} className="flex items-start gap-2">
          <span>•</span>
          <span>{tip}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function WeatherTips() {
  const t = useTranslations('weather.tips');

  const sunProtectionTips = [
    t('sunProtection.tip1'),
    t('sunProtection.tip2'),
    t('sunProtection.tip3'),
    t('sunProtection.tip4'),
    t('sunProtection.tip5'),
  ];

  const rainProtectionTips = [
    t('rainProtection.tip1'),
    t('rainProtection.tip2'),
    t('rainProtection.tip3'),
    t('rainProtection.tip4'),
    t('rainProtection.tip5'),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      <WeatherTipCard
        icon="☀️"
        title={t('sunProtection.title')}
        tips={sunProtectionTips}
        gradient="bg-gradient-to-br from-yellow-50 to-orange-50"
      />
      <WeatherTipCard
        icon="🌧️"
        title={t('rainProtection.title')}
        tips={rainProtectionTips}
        gradient="bg-gradient-to-br from-blue-50 to-cyan-50"
      />
    </div>
  );
}
