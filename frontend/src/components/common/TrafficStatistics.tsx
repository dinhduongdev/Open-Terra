/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { TrafficStatByTime, RouteStatistic } from '@/types/traffic';
import { getStatusColor, getCongestionColor } from '@/utils/trafficUtils';

interface TrafficStatisticsProps {
  statsByTime: TrafficStatByTime[];
  routeStats: RouteStatistic[];
}

export default function TrafficStatistics({
  statsByTime,
  routeStats,
}: TrafficStatisticsProps) {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Stats by Time */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Thống kê theo giờ
        </h3>
        <div className="space-y-3">
          {statsByTime.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{stat.time}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">
                  {stat.vehicles.toLocaleString()} xe
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs ${getStatusColor(
                    stat.status
                  )}`}
                >
                  {stat.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Tuyến đường chính
        </h3>
        <div className="space-y-3">
          {routeStats.map((route, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-800">{route.route}</span>
                <span className="text-sm text-gray-600">{route.avgSpeed} km/h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getCongestionColor(
                    route.congestion
                  )}`}
                  style={{ width: `${route.congestion}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tắc nghẽn: {route.congestion}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
