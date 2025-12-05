/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { useEffect } from 'react';
import L from 'leaflet';
import { TrafficSegment, getTrafficColor, getTrafficStatusLabel } from '@/services/trafficService';

interface UseTrafficLayerProps {
  mapRef: React.MutableRefObject<L.Map | null>;
  trafficLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  legendRef: React.MutableRefObject<L.Control | null>;
  trafficData: TrafficSegment[];
  showTrafficLayer: boolean;
}

export const useTrafficLayer = ({
  mapRef,
  trafficLayerRef,
  legendRef,
  trafficData,
  showTrafficLayer,
}: UseTrafficLayerProps) => {
  useEffect(() => {
    if (!mapRef.current || !trafficLayerRef.current) return;

    // Clear existing traffic layer
    trafficLayerRef.current.clearLayers();

    // Update toggle button text
    const toggleText = document.getElementById('traffic-toggle-text');
    if (toggleText) {
      toggleText.textContent = `${showTrafficLayer ? 'Ẩn' : 'Hiện'} lớp giao thông`;
    }

    if (showTrafficLayer && trafficData.length > 0) {
      // Add legend
      if (legendRef.current && mapRef.current) {
        legendRef.current.addTo(mapRef.current);
      }

      // Draw traffic circle markers
      trafficData.forEach((segment) => {
        const color = getTrafficColor(segment.status);

        // Use the middle point of the coordinates as the marker position
        const middleIndex = Math.floor(segment.coordinates.length / 2);
        const markerPosition = segment.coordinates[middleIndex];

        // Create circle marker
        const circleMarker = L.circleMarker(markerPosition, {
          radius: 8,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        });

        // Add popup with traffic information
        circleMarker.bindPopup(`
          <div style="min-width: 200px;">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">${segment.name}</div>
            <div style="margin-bottom: 4px;">
              <span style="display: inline-block; width: 12px; height: 12px; background: ${color}; border-radius: 50%; margin-right: 6px;"></span>
              <strong>Trạng thái:</strong> ${getTrafficStatusLabel(segment.status)}
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Tốc độ TB:</strong> ${segment.speed} km/h
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Số phương tiện:</strong> ${segment.vehicleCount}
            </div>
            <div style="font-size: 11px; color: #666; margin-top: 6px;">
              Cập nhật: ${segment.lastUpdate.toLocaleTimeString('vi-VN')}
            </div>
          </div>
        `);

        circleMarker.addTo(trafficLayerRef.current!);
      });
    } else {
      // Remove legend when traffic layer is hidden
      if (legendRef.current && mapRef.current) {
        mapRef.current.removeControl(legendRef.current);
      }
    }
  }, [trafficData, showTrafficLayer, mapRef, trafficLayerRef, legendRef]);
};
