/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';
import AirQualityTable from '@/components/admin/AirQualityTable';

export default function AdminAirQualityPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Chất lượng Không khí</h1>
          <p className="text-gray-600 mt-2">Theo dõi và quản lý dữ liệu từ các trạm quan trắc không khí</p>
        </div>
      </div>
      
      <AirQualityTable />
    </div>
  );
}
