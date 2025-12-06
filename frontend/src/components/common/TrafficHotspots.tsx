/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { TrafficHotspot } from '@/types/traffic';
import { getStatusColor } from '@/utils/trafficUtils';

interface TrafficHotspotsProps {
  hotspots: TrafficHotspot[];
}

export default function TrafficHotspots({ hotspots }: TrafficHotspotsProps) {
  return (
    <div className="mt-4 md:mt-6 bg-white rounded-lg shadow-md p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">
        Điểm nóng giao thông
      </h3>

      <div className="space-y-3">
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow gap-3"
          >
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                <h4 className="font-semibold text-gray-800 text-sm md:text-base">{hotspot.location}</h4>
                <span
                  className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    hotspot.status
                  )}`}
                >
                  {hotspot.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4 mt-2 text-xs md:text-sm text-gray-600">
                <span>🚗 {hotspot.vehicleCount} xe</span>
                <span>⚡ {hotspot.avgSpeed} km/h</span>
                <span className="text-gray-400 hidden sm:inline">
                  📍 {hotspot.coordinates[0].toFixed(4)},{' '}
                  {hotspot.coordinates[1].toFixed(4)}
                </span>
              </div>
            </div>

            <button className="md:ml-4 px-3 md:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-xs md:text-sm w-full md:w-auto">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
