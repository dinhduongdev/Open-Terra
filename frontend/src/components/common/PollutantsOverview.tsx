/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useTranslations } from 'next-intl';

interface Pollutant {
  name: string;
  value: number;
  unit: string;
  trend: number;
}

interface PollutantsOverviewProps {
  pollutants: Pollutant[];
}

// WHO Air Quality Guidelines (2021)
const WHO_STANDARDS: { [key: string]: number } = {
  PM25: 15, // µg/m³ (annual mean)
  PM10: 45, // µg/m³ (annual mean)
  PM1: 10, // µg/m³ (estimated)
  O3: 60, // ppb (8-hour mean)
  NO2: 25, // ppb (annual mean)
  SO2: 40, // ppb (24-hour mean)
  CO: 4, // ppm (8-hour mean)
};

export default function PollutantsOverview({ pollutants }: PollutantsOverviewProps) {
  const t = useTranslations('airQuality.pollutants');
  const tLevel = useTranslations('airQuality.pollutants.level');
  
  const getPollutantLevel = (name: string, value: number): string => {
    const standard = WHO_STANDARDS[name];
    if (!standard) return tLevel('unknown');
    
    const percentage = (value / standard) * 100;
    if (percentage <= 50) return tLevel('good');
    if (percentage <= 100) return tLevel('moderate');
    if (percentage <= 150) return tLevel('poor');
    return tLevel('veryPoor');
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case tLevel('good'):
        return 'text-green-600 bg-green-50 border-green-200';
      case tLevel('moderate'):
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case tLevel('poor'):
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case tLevel('veryPoor'):
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 100) return 'bg-yellow-500';
    if (percentage <= 150) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const calculatePercentage = (name: string, value: number): number => {
    const standard = WHO_STANDARDS[name];
    if (!standard) return 0;
    return Math.round((value / standard) * 100);
  };

  return (
    <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
        {t('title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {pollutants.map((pollutant, index) => {
          const level = getPollutantLevel(pollutant.name, pollutant.value);
          const percentage = calculatePercentage(pollutant.name, pollutant.value);
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 md:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3 md:mb-4">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-gray-800">{pollutant.name}</h3>
                  <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">
                    {pollutant.value} <span className="text-xs md:text-sm text-gray-500">{pollutant.unit}</span>
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(level)}`}
                >
                  {level}
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>{t('vsWhoStandard')}</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all ${getProgressColor(percentage)}`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  ></div>
                </div>
            </div>

            {WHO_STANDARDS[pollutant.name] && (
              <div className="text-xs text-gray-500 mt-3">
                {t('whoStandard')} <strong>{WHO_STANDARDS[pollutant.name]} {pollutant.unit}</strong>
              </div>
            )}

            {pollutant.trend !== 0 && (
              <div className="flex items-center gap-1 text-xs mt-2">
                {pollutant.trend > 0 ? (
                  <span className="text-red-600">↑ {t('increase')} {Math.abs(pollutant.trend)}%</span>
                ) : (
                  <span className="text-green-600">↓ {t('decrease')} {Math.abs(pollutant.trend)}%</span>
                )}
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* Pollutants Info */}
      <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h3 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">{t('explainTitle')}</h3>
        <div className="text-xs md:text-sm text-blue-800 space-y-1">
          <p><strong>PM2.5:</strong> {t('pm25Desc')}</p>
          <p><strong>PM10:</strong> {t('pm10Desc')}</p>
          <p><strong>O₃ (Ozone):</strong> {t('o3Desc')}</p>
          <p><strong>NO₂:</strong> {t('no2Desc')}</p>
          <p><strong>SO₂:</strong> {t('so2Desc')}</p>
          <p><strong>CO:</strong> {t('coDesc')}</p>
        </div>
      </div>
    </div>
  );
}
