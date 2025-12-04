/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { TrafficOverviewData } from '@/types/traffic';

interface TrafficOverviewProps {
  data: TrafficOverviewData;
  hotspotCount: number;
}

export default function TrafficOverview({ data, hotspotCount }: TrafficOverviewProps) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-700">Traffic Overview</h3>
        <span className="text-sm text-gray-500">Cập nhật: {data.lastUpdate}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Tổng phương tiện</p>
          <p className="text-2xl font-bold text-blue-800 mt-2">
            {data.totalVehicles.toLocaleString()}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-600 font-medium">Tốc độ TB</p>
          <p className="text-2xl font-bold text-green-800 mt-2">
            {data.averageSpeed} km/h
          </p>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-orange-600 font-medium">Mức độ tắc nghẽn</p>
          <p className="text-2xl font-bold text-orange-800 mt-2">
            {data.congestionLevel}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Điểm tắc nghẽn</p>
          <p className="text-2xl font-bold text-purple-800 mt-2">{hotspotCount}</p>
        </div>
      </div>
    </div>
  );
}
