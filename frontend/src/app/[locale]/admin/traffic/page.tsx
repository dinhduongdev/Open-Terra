/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import React, { useState, useEffect } from 'react';
import TrafficReportsTable from '@/components/admin/TrafficReportsTable';
import TrafficFlowTable from '@/components/admin/TrafficFlowTable';
import { getLatestTrafficFlow, TrafficFlowData } from '@/services/trafficFlowService';

export default function AdminTrafficPage() {
  const [trafficFlowData, setTrafficFlowData] = useState<TrafficFlowData[]>([]);

  // Update document title
  useEffect(() => {
    document.title = 'Open-Terra - Quản lý giao thông';
  }, []);

  const fetchTrafficFlowData = async () => {
    try {
      const flowData = await getLatestTrafficFlow();
      console.log('Fetched traffic flow data:', flowData);
      setTrafficFlowData(flowData);
    } catch (err) {
      console.error('Error fetching traffic flow data:', err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchTrafficFlowData();
    })();
    
    // Refresh traffic flow data every 30 seconds
    const interval = setInterval(fetchTrafficFlowData, 30000);
    
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Báo cáo Giao thông</h1>
          <p className="text-gray-600 mt-2">Xem và quản lý các báo cáo giao thông và dữ liệu cảm biến</p>
        </div>
      </div>

      {/* Traffic Flow Sensors Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
          Dữ liệu Cảm biến Giao thông
        </h2>
        <TrafficFlowTable sensors={trafficFlowData} onRefresh={fetchTrafficFlowData} />
      </div>
      
      {/* Traffic Reports Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
          Báo cáo từ Người dân
        </h2>
        <TrafficReportsTable />
      </div>
    </div>
  );
}
