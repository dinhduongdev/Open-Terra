/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

"use client";

import React, { useState, useEffect } from "react";
import FloodReportsTable from "@/components/admin/FloodReportsTable";
import FloodMonitoringTable from "@/components/admin/FloodMonitoringTable";
import {
  getLatestFloodMonitoring,
  FloodMonitoringData,
} from "@/services/floodMonitoringService";

export default function AdminFloodPage() {
  const [floodMonitoringData, setFloodMonitoringData] = useState<
    FloodMonitoringData[]
  >([]);

  const fetchFloodMonitoringData = async () => {
    try {
      const monitoringData = await getLatestFloodMonitoring();
      console.log("Fetched flood monitoring data:", monitoringData);
      setFloodMonitoringData(monitoringData);
    } catch (err) {
      console.error("Error fetching flood monitoring data:", err);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchFloodMonitoringData();
    })();
    const interval = setInterval(fetchFloodMonitoringData, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Báo cáo Ngập lụt
          </h1>
          <p className="text-gray-600 mt-2">
            Xem và quản lý các báo cáo ngập lụt và dữ liệu cảm biến
          </p>
        </div>
      </div>

      {/* Flood Monitoring Sensors Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
          Dữ liệu Cảm biến Ngập lụt
        </h2>
        <FloodMonitoringTable
          sensors={floodMonitoringData}
          onRefresh={fetchFloodMonitoringData}
        />
      </div>

      {/* Flood Reports Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-3">
          Báo cáo từ Người dân
        </h2>
        <FloodReportsTable />
      </div>
    </div>
  );
}
