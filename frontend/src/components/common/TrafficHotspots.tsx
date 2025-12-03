import { TrafficHotspot } from '@/types/traffic';
import { getStatusColor } from '@/utils/trafficUtils';

interface TrafficHotspotsProps {
  hotspots: TrafficHotspot[];
}

export default function TrafficHotspots({ hotspots }: TrafficHotspotsProps) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Điểm nóng giao thông
      </h3>

      <div className="space-y-3">
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="font-semibold text-gray-800">{hotspot.location}</h4>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    hotspot.status
                  )}`}
                >
                  {hotspot.status}
                </span>
              </div>
              <div className="flex gap-4 mt-2 text-sm text-gray-600">
                <span>🚗 {hotspot.vehicleCount} xe</span>
                <span>⚡ {hotspot.avgSpeed} km/h</span>
                <span className="text-gray-400">
                  📍 {hotspot.coordinates[0].toFixed(4)},{' '}
                  {hotspot.coordinates[1].toFixed(4)}
                </span>
              </div>
            </div>

            <button className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
