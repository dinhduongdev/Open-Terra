/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';
import TrafficReportsTable from '@/components/admin/TrafficReportsTable';
import { useTranslations } from 'next-intl';

export default function AdminTrafficPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Báo cáo Giao thông</h1>
          <p className="text-gray-600 mt-2">Xem và quản lý các báo cáo giao thông từ người dân</p>
        </div>
      </div>
      
      <TrafficReportsTable />
    </div>
  );
}
