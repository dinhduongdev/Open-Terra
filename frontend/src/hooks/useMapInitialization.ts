/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface UseMapInitializationProps {
  center: [number, number];
  zoom: number;
  locationError: string | null;
  showTrafficLayer: boolean;
}

export const useMapInitialization = ({
  center,
  zoom,
  locationError,
  showTrafficLayer,
}: UseMapInitializationProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const trafficLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const legendRef = useRef<L.Control | null>(null);

  useEffect(() => {
    const map = L.map('map').setView(center, zoom);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const popupText = locationError
      ? `Vị trí mặc định (Hà Nội)<br><small>Không thể lấy vị trí: ${locationError}</small>`
      : 'Vị trí hiện tại của bạn';

    L.marker(center).addTo(map).bindPopup(popupText).openPopup();

    // Initialize layer groups
    trafficLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    // Add traffic legend
    const Legend = L.Control.extend({
      options: { position: 'bottomright' },
      onAdd: function () {
        const div = L.DomUtil.create('div', 'traffic-legend');
        div.innerHTML = `
          <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">Tình trạng giao thông</div>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="width: 20px; height: 4px; background: #22c55e; margin-right: 8px; border-radius: 2px;"></div>
              <span style="font-size: 12px;">Thông thoáng</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="width: 20px; height: 4px; background: #eab308; margin-right: 8px; border-radius: 2px;"></div>
              <span style="font-size: 12px;">Di chuyển chậm</span>
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <div style="width: 20px; height: 4px; background: #f97316; margin-right: 8px; border-radius: 2px;"></div>
              <span style="font-size: 12px;">Kẹt xe nhẹ</span>
            </div>
            <div style="display: flex; align-items: center;">
              <div style="width: 20px; height: 4px; background: #dc2626; margin-right: 8px; border-radius: 2px;"></div>
              <span style="font-size: 12px;">Kẹt xe nghiêm trọng</span>
            </div>
          </div>
        `;
        return div;
      },
    });

    legendRef.current = new Legend();
    if (showTrafficLayer) {
      // legendRef.current.addTo(map);
    }

    // Add traffic layer toggle button
    const ToggleControl = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        const button = L.DomUtil.create('button', 'traffic-toggle-btn');
        button.innerHTML = `
          <div style="background: white; padding: 10px 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); cursor: pointer; font-size: 14px; font-weight: 500; border: none;">
            <span id="traffic-toggle-icon">🚦</span> <span id="traffic-toggle-text">${
              showTrafficLayer ? 'Ẩn' : 'Hiện'
            } lớp giao thông</span>
          </div>
        `;

        L.DomEvent.disableClickPropagation(button);

        return button;
      },
    });

    new ToggleControl().addTo(map);

    return () => {
      if (legendRef.current && map) {
        map.removeControl(legendRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom, locationError, showTrafficLayer]);

  return { mapRef, trafficLayerRef, routeLayerRef, legendRef };
};
