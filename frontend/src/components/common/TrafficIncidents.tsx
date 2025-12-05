/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { TrafficIncident } from '@/types/traffic';
import { getSeverityColor } from '@/utils/trafficUtils';

interface TrafficIncidentsProps {
  incidents: TrafficIncident[];
}

export default function TrafficIncidents({ incidents }: TrafficIncidentsProps) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Sự cố giao thông
      </h3>

      <div className="space-y-3">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="p-4 bg-gray-50 rounded-lg border-l-4 border-red-400"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                      incident.severity
                    )}`}
                  >
                    {incident.type}
                  </span>
                  <span className="text-xs text-gray-500">{incident.time}</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  {incident.location}
                </h4>
                <p className="text-sm text-gray-600">{incident.description}</p>
              </div>

              <button className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                Chi tiết →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
