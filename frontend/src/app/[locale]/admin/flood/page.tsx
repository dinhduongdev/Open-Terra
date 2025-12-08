/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';
import FloodReportsTable from '@/components/admin/FloodReportsTable';

export default function AdminFloodPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Báo cáo Ngập lụt</h1>
          <p className="text-gray-600 mt-2">Xem và quản lý các báo cáo ngập lụt từ người dân</p>
        </div>
      </div>
      
      <FloodReportsTable />
    </div>
  );
}
