import { PopularLocation } from '@/types/traffic';
import { RoutePoint } from '@/services/routingService';

interface RoutingPanelProps {
  enableRouting: boolean;
  onRoutingToggle: (enabled: boolean) => void;
  routeOrigin?: RoutePoint;
  routeDestination?: RoutePoint;
  onSetOrigin: (location: PopularLocation) => void;
  onSetDestination: (location: PopularLocation) => void;
  popularLocations: PopularLocation[];
}

export default function RoutingPanel({
  enableRouting,
  onRoutingToggle,
  routeOrigin,
  routeDestination,
  onSetOrigin,
  onSetDestination,
  popularLocations,
}: RoutingPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700">
          🧭 Định tuyến đường đi
        </h2>
        <button
          onClick={() => onRoutingToggle(!enableRouting)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            enableRouting
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {enableRouting ? '✓ Đang bật' : 'Tắt'}
        </button>
      </div>

      {enableRouting && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Origin Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 Điểm xuất phát
            </label>
            <select
              onChange={(e) => {
                const loc = popularLocations[parseInt(e.target.value)];
                if (loc) onSetOrigin(loc);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Chọn điểm xuất phát
              </option>
              {popularLocations.map((loc, idx) => (
                <option key={idx} value={idx}>
                  {loc.name}
                </option>
              ))}
            </select>
            {routeOrigin && (
              <div className="mt-2 text-sm text-green-600">
                ✓ {routeOrigin.name}
              </div>
            )}
          </div>

          {/* Destination Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 Điểm đến
            </label>
            <select
              onChange={(e) => {
                const loc = popularLocations[parseInt(e.target.value)];
                if (loc) onSetDestination(loc);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue=""
            >
              <option value="" disabled>
                Chọn điểm đến
              </option>
              {popularLocations.map((loc, idx) => (
                <option key={idx} value={idx}>
                  {loc.name}
                </option>
              ))}
            </select>
            {routeDestination && (
              <div className="mt-2 text-sm text-red-600">
                ✓ {routeDestination.name}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
