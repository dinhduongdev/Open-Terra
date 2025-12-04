/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { RouteResult, formatDistance, formatDuration, calculateArrivalTime } from '@/services/routingService';

interface RouteInfoProps {
  route: RouteResult;
}

export default function RouteInfo({ route }: RouteInfoProps) {
  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-blue-900 mb-3">📊 Thông tin tuyến đường</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-3 rounded-lg">
          <div className="text-sm text-gray-600">Khoảng cách</div>
          <div className="text-xl font-bold text-blue-600">
            {formatDistance(route.distance)}
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <div className="text-sm text-gray-600">Thời gian di chuyển</div>
          <div className="text-xl font-bold text-blue-600">
            {formatDuration(route.duration)}
          </div>
        </div>
        <div className="bg-white p-3 rounded-lg">
          <div className="text-sm text-gray-600">Dự kiến đến</div>
          <div className="text-xl font-bold text-blue-600">
            {calculateArrivalTime(route.duration).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      {/* Turn-by-turn instructions */}
      {route.instructions && route.instructions.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 mb-2">📍 Hướng dẫn chi tiết:</h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {route.instructions.slice(0, 5).map((instruction, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-sm bg-white p-2 rounded"
              >
                <span className="font-bold text-blue-600">{idx + 1}.</span>
                <div className="flex-1">
                  <div>{instruction.text}</div>
                  <div className="text-xs text-gray-500">
                    {formatDistance(instruction.distance)}
                  </div>
                </div>
              </div>
            ))}
            {route.instructions.length > 5 && (
              <div className="text-xs text-gray-500 text-center">
                ... và {route.instructions.length - 5} bước nữa
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
