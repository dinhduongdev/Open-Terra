/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useTranslations } from 'next-intl';
import { FloodMonitoringData } from '@/services/floodMonitoringService';
import { getStreetNameFromCoordinates } from '@/utils/geocoding';
import { useEffect, useState } from 'react';

interface FloodMonitoringListProps {
  sensors: FloodMonitoringData[];
}

export default function FloodMonitoringList({ sensors }: FloodMonitoringListProps) {
  const t = useTranslations('floodMap.monitoring');
  console.log("sensors",sensors);
  const [locationNames, setLocationNames] = useState<Record<string, string>>({});
  
  // Fetch street names for all sensors
  useEffect(() => {
    const fetchLocationNames = async () => {
      const names: Record<string, string> = {};
      
      for (const sensor of sensors) {
        const [lng, lat] = sensor.location?.value?.coordinates || [0, 0];
        if (lat && lng) {
          const streetName = await getStreetNameFromCoordinates(lat, lng);
          if (streetName) {
            names[sensor.id] = streetName;
          }
        }
      }
      
      setLocationNames(names);
    };
    
    if (sensors.length > 0) {
      fetchLocationNames();
    }
  }, [sensors]);
    
  if (!sensors.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">{t('noData')}</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 border-green-300 text-green-700';
      case 'alert':
        return 'bg-yellow-100 border-yellow-300 text-yellow-700';
      case 'danger':
        return 'bg-red-100 border-red-300 text-red-700';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return t('status.normal');
      case 'alert':
        return t('status.alert');
      case 'danger':
        return t('status.danger');
      default:
        return status || t('status.normal');
    }
  };

  const getStatusDot = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return 'bg-green-500';
      case 'alert':
        return 'bg-yellow-500';
      case 'danger':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 flex items-center gap-2">
          {t('title')}
          <span className="text-sm font-normal text-gray-500">
            ({sensors.length} {t('count')})
          </span>
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {sensors.map((sensor) => {
          const waterLevel = sensor.waterLevel?.value || sensor.currentLevel?.value || 0;
          const alertLevel = sensor.alertLevel?.value || 0;
          const dangerLevel = sensor.dangerLevel?.value || 0;
          const referenceLevel = sensor.referenceLevel?.value || 0;
          const measuredDistance = sensor.measuredDistance?.value || 0;
          const status = sensor.floodLevelStatus?.value || 'normal';
          const stationID = sensor.stationID?.value || sensor.id.split(':').pop() || sensor.id;
          const [lng, lat] = sensor.location?.value?.coordinates || [0, 0];
          const address = sensor.address?.value?.streetAddress || 'N/A';
          const description = sensor.description?.value || '';
          const timestamp = sensor.dateObserved?.value?.['@value'] 
            ? new Date(sensor.dateObserved.value['@value']).toLocaleString('vi-VN')
            : 'N/A';

          return (
            <div
              key={sensor.id}
              className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Station ID and Status */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                        {t('station')} #{stationID}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {address}
                      </p>
                      <p className="text-xs text-gray-400">
                        {locationNames[sensor.id] || `${lat.toFixed(6)}, ${lng.toFixed(6)}`}
                      </p>
                      {description && (
                        <p className="text-xs text-gray-600 mt-1">{description}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(status)}`}>
                    <span className={`w-2 h-2 rounded-full ${getStatusDot(status)} animate-pulse`}></span>
                    {getStatusText(status)}
                  </div>
                </div>

                {/* Water Level Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {/* Current Water Level */}
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium mb-1">
                      {t('waterLevel')}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-blue-700">
                      {waterLevel.toFixed(2)}
                    </div>
                    <div className="text-xs text-blue-600">{t('units.meter')}</div>
                  </div>

                  {/* Alert Level */}
                  <div className="bg-yellow-50 rounded-lg p-3 text-center border border-yellow-200">
                    <div className="text-xs text-yellow-600 font-medium mb-1">
                      {t('alertLevel')}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-yellow-700">
                      {alertLevel.toFixed(2)}
                    </div>
                    <div className="text-xs text-yellow-600">{t('units.meter')}</div>
                  </div>

                  {/* Danger Level */}
                  <div className="bg-red-50 rounded-lg p-3 text-center border border-red-200">
                    <div className="text-xs text-red-600 font-medium mb-1">
                      {t('dangerLevel')}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-red-700">
                      {dangerLevel.toFixed(2)}
                    </div>
                    <div className="text-xs text-red-600">{t('units.meter')}</div>
                  </div>

                  {/* Measured Distance */}
                  {measuredDistance > 0 && (
                    <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                      <div className="text-xs text-purple-600 font-medium mb-1">
                        {t('distance')}
                      </div>
                      <div className="text-lg md:text-xl font-bold text-purple-700">
                        {measuredDistance.toFixed(2)}
                      </div>
                      <div className="text-xs text-purple-600">{t('units.meter')}</div>
                    </div>
                  )}

                  {/* Reference Level */}
                  {referenceLevel > 0 && (
                    <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                      <div className="text-xs text-gray-600 font-medium mb-1">
                        {t('referenceLevel')}
                      </div>
                      <div className="text-lg md:text-xl font-bold text-gray-700">
                        {referenceLevel.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600">{t('units.meter')}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar showing water level vs danger level */}
              {dangerLevel > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{t('vsDangerLevel')}</span>
                    <span>{((waterLevel / dangerLevel) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        waterLevel >= dangerLevel
                          ? 'bg-red-500'
                          : waterLevel >= alertLevel
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((waterLevel / dangerLevel) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t('lastUpdate')}: {timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
