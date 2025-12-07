/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WeatherStation } from '@/constants/weatherMockData';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface WeatherMapProps {
  stations: WeatherStation[];
  showStations: boolean;
  onStationLayerToggle?: (show: boolean) => void;
}

export default function WeatherMap({
  stations,
  showStations,
  onStationLayerToggle,
}: WeatherMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [selectedStation, setSelectedStation] = useState<WeatherStation | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!mapRef.current) {
      // Initialize map
      const map = L.map('weather-map').setView([21.028511, 105.804817], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (showStations) {
      // Add station markers
      stations.forEach((station) => {
        const tempColor =
          station.temperature >= 30
            ? '#ef4444'
            : station.temperature >= 25
            ? '#f59e0b'
            : '#3b82f6';

        const icon = L.divIcon({
          className: 'custom-weather-marker',
          html: `
            <div style="
              background: ${tempColor};
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              cursor: pointer;
            ">
              ${station.temperature}°
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([station.coordinates.lat, station.coordinates.lng], {
          icon,
        })
          .addTo(mapRef.current!)
          .on('click', () => {
            setSelectedStation(station);
          });

        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">
              ${station.name}
            </h3>
            <p style="color: #666; font-size: 12px; margin-bottom: 8px;">
              ${station.location}
            </p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px;">
              <div>
                <div style="color: #666;">Nhiệt độ:</div>
                <div style="font-weight: bold;">${station.temperature}°C</div>
              </div>
              <div>
                <div style="color: #666;">Độ ẩm:</div>
                <div style="font-weight: bold;">${station.humidity}%</div>
              </div>
              <div>
                <div style="color: #666;">Gió:</div>
                <div style="font-weight: bold;">${station.windSpeed} km/h</div>
              </div>
              <div>
                <div style="color: #666;">Mưa:</div>
                <div style="font-weight: bold;">${station.rainfall} mm</div>
              </div>
              <div style="grid-column: 1 / -1;">
                <div style="color: #666;">Áp suất:</div>
                <div style="font-weight: bold;">${station.pressure} hPa</div>
              </div>
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <span style="
                display: inline-block;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
                background: ${station.status === 'active' ? '#dcfce7' : '#fee2e2'};
                color: ${station.status === 'active' ? '#166534' : '#991b1b'};
              ">
                ${station.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        markersRef.current.push(marker);
      });
    }

    return () => {
      // Cleanup on unmount
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [stations, showStations]);

  return (
    <div>
      <div id="weather-map" className="h-[600px] w-full rounded-lg overflow-hidden"></div>

      {selectedStation && (
        <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {selectedStation.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{selectedStation.location}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Nhiệt độ:</span>
                  <span className="font-semibold ml-1">{selectedStation.temperature}°C</span>
                </div>
                <div>
                  <span className="text-gray-600">Độ ẩm:</span>
                  <span className="font-semibold ml-1">{selectedStation.humidity}%</span>
                </div>
                <div>
                  <span className="text-gray-600">Gió:</span>
                  <span className="font-semibold ml-1">{selectedStation.windSpeed} km/h</span>
                </div>
                <div>
                  <span className="text-gray-600">Lượng mưa:</span>
                  <span className="font-semibold ml-1">{selectedStation.rainfall} mm</span>
                </div>
                <div>
                  <span className="text-gray-600">Áp suất:</span>
                  <span className="font-semibold ml-1">{selectedStation.pressure} hPa</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedStation(null)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
