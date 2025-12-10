/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import AirQualityTable from '@/components/admin/AirQualityTable';
import TrafficFlowTable from '@/components/admin/TrafficFlowTable';
import FloodMonitoringTable from '@/components/admin/FloodMonitoringTable';
import WeatherTable from '@/components/admin/WeatherTable';
import FeedbackTable from '@/components/admin/FeedbackTable';
import { getLatestTrafficFlow, TrafficFlowData } from '@/services/trafficFlowService';
import { getLatestFloodMonitoring, FloodMonitoringData } from '@/services/floodMonitoringService';

export default function AdminDashboard() {
  const t = useTranslations('adminDashboard');
  const [trafficFlowData, setTrafficFlowData] = useState<TrafficFlowData[]>([]);
  const [floodMonitoringData, setFloodMonitoringData] = useState<FloodMonitoringData[]>([]);

  // Update document title
  useEffect(() => {
    document.title = `Open-Terra - ${t('title')}`;
  }, [t]);

  // Fetch traffic flow data
  const fetchTrafficFlowData = async () => {
    try {
      const flowData = await getLatestTrafficFlow();
      setTrafficFlowData(flowData);
    } catch (err) {
      console.error('Error fetching traffic flow data:', err);
    }
  };

  // Fetch flood monitoring data
  const fetchFloodMonitoringData = async () => {
    try {
      const monitoringData = await getLatestFloodMonitoring();
      setFloodMonitoringData(monitoringData);
    } catch (err) {
      console.error('Error fetching flood monitoring data:', err);
    }
  };

  useEffect(() => {
    fetchTrafficFlowData();
    fetchFloodMonitoringData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchTrafficFlowData();
      fetchFloodMonitoringData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
        <p className="text-gray-600 mt-2">{t('subtitle')}</p>
      </div>

      {/* Traffic Flow Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
          {t('sections.traffic')}
        </h2>
        <TrafficFlowTable sensors={trafficFlowData} onRefresh={fetchTrafficFlowData} />
      </div>

      {/* Flood Monitoring Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
          {t('sections.flood')}
        </h2>
        <FloodMonitoringTable sensors={floodMonitoringData} onRefresh={fetchFloodMonitoringData} />
      </div>

      {/* Air Quality Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
          {t('sections.airQuality')}
        </h2>
        <AirQualityTable />
      </div>

      {/* Weather Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
          {t('sections.weather')}
        </h2>
        <WeatherTable />
      </div>

      {/* Feedback Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
          {t('sections.feedback')}
        </h2>
        <FeedbackTable />
      </div>
    </div>
  );
}
