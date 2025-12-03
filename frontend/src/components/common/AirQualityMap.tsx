'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AirQualityStation, getAqiColor, getAqiLevel } from '@/constants/airQualityMockData';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface AirQualityMapProps {
  stations: AirQualityStation[];
  showStations: boolean;
  onStationLayerToggle: (show: boolean) => void;
}

export default function AirQualityMap({
  stations,
  showStations,
  onStationLayerToggle,
}: AirQualityMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const stationMarkersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    // Initialize map only once
    if (!mapRef.current) {
      const map = L.map('air-quality-map', {
        center: [21.0285, 105.8542], // Hanoi center
        zoom: 12,
        zoomControl: true,
      });

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      // Cleanup map on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing station markers
    stationMarkersRef.current.forEach((marker) => marker.remove());
    stationMarkersRef.current = [];

    if (showStations) {
      // Add station markers
      stations.forEach((station) => {
        const color = getAqiColor(station.aqi);
        const level = getAqiLevel(station.aqi);

        const circle = L.circleMarker(station.position, {
          radius: 15,
          fillColor: color,
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        });

        const popupContent = `
          <div style="min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #1f2937;">
              📍 ${station.name}
            </h3>
            <div style="margin-bottom: 12px; padding: 8px; background: ${color}; border-radius: 6px; text-align: center;">
              <div style="font-size: 32px; font-weight: 700; color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.3);">
                ${station.aqi}
              </div>
              <div style="font-size: 14px; font-weight: 600; color: #fff; margin-top: 4px;">
                AQI - ${level}
              </div>
            </div>
            <div style="font-size: 13px; color: #4b5563; line-height: 1.6;">
              <div style="margin-bottom: 8px;">
                <strong style="color: #1f2937;">Chất ô nhiễm:</strong>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 8px;">
                <div>PM2.5: <strong>${station.pollutants.pm25} µg/m³</strong></div>
                <div>PM10: <strong>${station.pollutants.pm10} µg/m³</strong></div>
                <div>O₃: <strong>${station.pollutants.o3} µg/m³</strong></div>
                <div>NO₂: <strong>${station.pollutants.no2} µg/m³</strong></div>
                <div>SO₂: <strong>${station.pollutants.so2} µg/m³</strong></div>
                <div>CO: <strong>${station.pollutants.co} mg/m³</strong></div>
              </div>
              <div style="padding-top: 8px; border-top: 1px solid #e5e7eb;">
                <div>🌡️ Nhiệt độ: <strong>${station.temperature}°C</strong></div>
                <div>💧 Độ ẩm: <strong>${station.humidity}%</strong></div>
                <div>💨 Gió: <strong>${station.windSpeed} km/h</strong></div>
              </div>
              <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280;">
                ⏰ Cập nhật: ${new Date(station.lastUpdated).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
        `;

        circle.bindPopup(popupContent, {
          maxWidth: 300,
          className: 'air-quality-popup',
        });

        circle.addTo(mapRef.current!);
        stationMarkersRef.current.push(circle);

        // Add AQI label
        const aqiIcon = L.divIcon({
          className: 'aqi-label',
          html: `<div style="
            background: #fff;
            border: 2px solid ${color};
            border-radius: 12px;
            padding: 2px 6px;
            font-size: 11px;
            font-weight: 700;
            color: #1f2937;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            white-space: nowrap;
          ">${station.aqi}</div>`,
          iconSize: [40, 20],
          iconAnchor: [20, -15],
        });

        L.marker(station.position, { icon: aqiIcon }).addTo(mapRef.current!);
      });
    }
  }, [stations, showStations]);

  return (
    <div>
      <div id="air-quality-map" style={{ height: '600px', width: '100%', borderRadius: '8px' }} />
      <style jsx global>{`
        .air-quality-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .air-quality-popup .leaflet-popup-content {
          margin: 12px;
        }
        .air-quality-popup .leaflet-popup-tip-container {
          display: none;
        }
        .aqi-label {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
