/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { FloodOverviewData } from '@/constants/floodMockData';

interface FloodOverviewProps {
  data: FloodOverviewData;
}

export default function FloodOverview({ data }: FloodOverviewProps) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Tổng diện tích ngập</p>
            <p className="text-2xl font-bold text-blue-600">{data.totalAffectedArea} km²</p>
          </div>
          <div className="text-3xl">🗺️</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Dân số ảnh hưởng</p>
            <p className="text-2xl font-bold text-orange-600">
              {data.totalAffectedPopulation.toLocaleString()}
            </p>
          </div>
          <div className="text-3xl">👥</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Độ sâu trung bình</p>
            <p className="text-2xl font-bold text-cyan-600">{data.averageDepth} cm</p>
          </div>
          <div className="text-3xl">📏</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Vùng nguy hiểm</p>
            <p className="text-2xl font-bold text-red-600">{data.criticalZones}</p>
          </div>
          <div className="text-3xl">🚨</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Cảnh báo hoạt động</p>
            <p className="text-2xl font-bold text-yellow-600">{data.activeWarnings}</p>
          </div>
          <div className="text-3xl">⚠️</div>
        </div>
      </div>
    </div>
  );
}
