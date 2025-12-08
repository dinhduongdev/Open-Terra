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
    <div className="mt-4 md:mt-6 bg-white rounded-lg shadow-md p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">
        Sự cố giao thông
      </h3>

      <div className="space-y-3">
        {incidents.map((incident) => (
          <div
            key={incident.id}
            className="p-3 md:p-4 bg-gray-50 rounded-lg border-l-4 border-red-400"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                  <span
                    className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                      incident.severity
                    )}`}
                  >
                    {incident.type}
                  </span>
                  <span className="text-xs text-gray-500">{incident.time}</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                  {incident.location}
                </h4>
                <p className="text-xs md:text-sm text-gray-600">{incident.description}</p>
              </div>

              <button className="md:ml-4 text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium text-left md:text-right">
                Chi tiết →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
