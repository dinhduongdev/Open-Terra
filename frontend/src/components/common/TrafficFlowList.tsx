/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useTranslations } from 'next-intl';
import { TrafficFlowData } from '@/services/trafficFlowService';

interface TrafficFlowListProps {
  sensors: TrafficFlowData[];
}

export default function TrafficFlowList({ sensors }: TrafficFlowListProps) {
  const t = useTranslations('traffic.sensors');
  
  if (!sensors.length) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">{t('noData')}</p>
      </div>
    );
  }

  const getStatusColor = (speed: number, congested: boolean) => {
    if (congested) return 'bg-red-100 border-red-300 text-red-700';
    if (speed > 40) return 'bg-green-100 border-green-300 text-green-700';
    if (speed > 25) return 'bg-yellow-100 border-yellow-300 text-yellow-700';
    return 'bg-red-100 border-red-300 text-red-700';
  };

  const getStatusText = (speed: number, congested: boolean) => {
    if (congested) return t('status.congested');
    if (speed > 40) return t('status.clear');
    if (speed > 25) return t('status.slow');
    return t('status.jam');
  };

  const getStatusDot = (speed: number, congested: boolean) => {
    if (congested) return 'bg-red-500';
    if (speed > 40) return 'bg-green-500';
    if (speed > 25) return 'bg-yellow-500';
    return 'bg-red-500';
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
          const speed = sensor.averageVehicleSpeed?.value || 0;
          const congested = sensor.congested?.value || false;
          const intensity = sensor.intensity?.value || 0;
          const occupancy = sensor.occupancy?.value || 0;
          const laneId = sensor.laneId?.value || 'N/A';
          const [lng, lat] = sensor.location?.value?.coordinates || [0, 0];
          const sensorId = sensor.id.split(':').pop() || sensor.id;
          const timestamp = sensor.dateObserved?.value?.['@value'] 
            ? new Date(sensor.dateObserved.value['@value']).toLocaleString('vi-VN')
            : 'N/A';

          return (
            <div
              key={sensor.id}
              className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Sensor ID and Status */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                        {t('sensorId')} #{sensorId}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {t('lane')} {laneId} • {lat.toFixed(6)}, {lng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(speed, congested)}`}>
                    <span className={`w-2 h-2 rounded-full ${getStatusDot(speed, congested)} animate-pulse`}></span>
                    {getStatusText(speed, congested)}
                  </div>
                </div>

                {/* Traffic Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {/* Speed */}
                  <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-200">
                    <div className="text-xs text-blue-600 font-medium mb-1">
                      {t('metrics.averageSpeed')}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-blue-700">
                      {speed.toFixed(1)}
                    </div>
                    <div className="text-xs text-blue-600">{t('units.kmh')}</div>
                  </div>

                  {/* Intensity */}
                  <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-200">
                    <div className="text-xs text-purple-600 font-medium mb-1">
                      {t('metrics.intensity')}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-purple-700">
                      {intensity}
                    </div>
                    <div className="text-xs text-purple-600">{t('units.vehiclesPerMinute')}</div>
                  </div>

                  {/* Occupancy */}
                  <div className="bg-orange-50 rounded-lg p-3 text-center border border-orange-200">
                    <div className="text-xs text-orange-600 font-medium mb-1">
                      {t('metrics.density')}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-orange-700">
                      {(occupancy * 100).toFixed(0)}
                    </div>
                    <div className="text-xs text-orange-600">{t('units.percent')}</div>
                  </div>

                  {/* Lane */}
                  <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                    <div className="text-xs text-gray-600 font-medium mb-1">
                      {t('metrics.laneNumber')}
                    </div>
                    <div className="text-lg md:text-xl font-bold text-gray-700">
                      {laneId}
                    </div>
                    <div className="text-xs text-gray-600">{t('units.lane')}</div>
                  </div>
                </div>
              </div>

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
