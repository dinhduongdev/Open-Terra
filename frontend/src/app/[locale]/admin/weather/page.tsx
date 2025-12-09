/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import React, { useEffect } from 'react';
import WeatherTable from '@/components/admin/WeatherTable';

export default function AdminWeatherPage() {
  // Update document title
  useEffect(() => {
    document.title = 'Open-Terra - Quản lý thời tiết';
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Thời tiết</h1>
          <p className="text-gray-600 mt-2">Theo dõi và quản lý dữ liệu thời tiết từ trạm quan trắc</p>
        </div>
      </div>
      
      <WeatherTable />
    </div>
  );
}
