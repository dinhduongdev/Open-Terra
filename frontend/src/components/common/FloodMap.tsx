/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FloodZone, FloodStation, FloodWarning } from '@/constants/floodMockData';

// Fix for default marker icons in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FloodMapProps {
  floodZones: FloodZone[];
  floodStations: FloodStation[];
  floodWarnings: FloodWarning[];
  showFloodLayer: boolean;
  onFloodLayerToggle: (show: boolean) => void;
}

export default function FloodMap({
  floodZones,
  floodStations,
  floodWarnings,
  showFloodLayer,
  onFloodLayerToggle,
}: FloodMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const floodLayerRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerRef = useRef<L.LayerGroup | null>(null);
  const warningsLayerRef = useRef<L.LayerGroup | null>(null);
  const legendRef = useRef<L.Control | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map('flood-map').setView([21.0285, 105.8542], 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Initialize layer groups
    floodLayerRef.current = L.layerGroup().addTo(map);
    stationsLayerRef.current = L.layerGroup().addTo(map);
    warningsLayerRef.current = L.layerGroup().addTo(map);

    // Add legend with collapse functionality
    const Legend = L.Control.extend({
      options: { position: 'bottomright' },
      onAdd: function () {
        const div = L.DomUtil.create('div', 'flood-legend');
        let isCollapsed = false;
        
        const updateLegend = () => {
          if (isCollapsed) {
            div.innerHTML = `
              <div style="background: white; padding: 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); color: #000000; cursor: pointer;" id="legend-toggle">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: bold; font-size: 11px; color: #000000;">Mức độ ngập úng</span>
                  <span style="font-size: 12px; margin-left: 8px;">▼</span>
                </div>
              </div>
            `;
          } else {
            div.innerHTML = `
              <div style="background: white; padding: 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); color: #000000;">
                <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 6px;" id="legend-toggle">
                  <span style="font-weight: bold; font-size: 11px; color: #000000;">Mức độ ngập úng</span>
                  <span style="font-size: 12px; margin-left: 8px;">▲</span>
                </div>
                <div id="legend-content">
                  <div style="display: flex; align-items: center; margin-bottom: 3px;">
                    <div style="width: 14px; height: 14px; background: rgba(34, 197, 94, 0.3); border: 1.5px solid #22c55e; margin-right: 5px; border-radius: 2px;"></div>
                    <span style="font-size: 10px; color: #000000;">Thấp (&lt; 30cm)</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-bottom: 3px;">
                    <div style="width: 14px; height: 14px; background: rgba(234, 179, 8, 0.3); border: 1.5px solid #eab308; margin-right: 5px; border-radius: 2px;"></div>
                    <span style="font-size: 10px; color: #000000;">Trung bình (30-50cm)</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-bottom: 3px;">
                    <div style="width: 14px; height: 14px; background: rgba(249, 115, 22, 0.3); border: 1.5px solid #f97316; margin-right: 5px; border-radius: 2px;"></div>
                    <span style="font-size: 10px; color: #000000;">Cao (50-80cm)</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-bottom: 6px;">
                    <div style="width: 14px; height: 14px; background: rgba(220, 38, 38, 0.3); border: 1.5px solid #dc2626; margin-right: 5px; border-radius: 2px;"></div>
                    <span style="font-size: 10px; color: #000000;">Nguy hiểm (&gt; 80cm)</span>
                  </div>
                  <div style="border-top: 1px solid #e5e7eb; padding-top: 6px; margin-top: 6px;">
                    <div style="font-weight: bold; margin-bottom: 4px; font-size: 11px; color: #000000;">Ký hiệu</div>
                    <div style="display: flex; align-items: center; margin-bottom: 2px;">
                      <span style="font-size: 14px; margin-right: 5px;">📍</span>
                      <span style="font-size: 10px; color: #000000;">Trạm đo</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                      <span style="font-size: 14px; margin-right: 5px;">⚠️</span>
                      <span style="font-size: 10px; color: #000000;">Cảnh báo</span>
                    </div>
                  </div>
                </div>
              </div>
            `;
          }
          
          const toggleBtn = div.querySelector('#legend-toggle');
          if (toggleBtn) {
            L.DomEvent.on(toggleBtn as HTMLElement, 'click', function(e) {
              L.DomEvent.stopPropagation(e);
              isCollapsed = !isCollapsed;
              updateLegend();
            });
          }
        };
        
        updateLegend();
        
        // Prevent map interactions when clicking on legend
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        
        return div;
      },
    });

    legendRef.current = new Legend();
    legendRef.current.addTo(map);

    return () => {
      if (legendRef.current && map) {
        map.removeControl(legendRef.current);
      }
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update flood zones
  useEffect(() => {
    if (!floodLayerRef.current || !showFloodLayer) {
      floodLayerRef.current?.clearLayers();
      return;
    }

    floodLayerRef.current.clearLayers();

    const getColorByLevel = (level: string) => {
      switch (level) {
        case 'low':
          return '#22c55e';
        case 'medium':
          return '#eab308';
        case 'high':
          return '#f97316';
        case 'critical':
          return '#dc2626';
        default:
          return '#6b7280';
      }
    };

    const getLevelText = (level: string) => {
      switch (level) {
        case 'low':
          return 'Thấp';
        case 'medium':
          return 'Trung bình';
        case 'high':
          return 'Cao';
        case 'critical':
          return 'Nguy hiểm';
        default:
          return 'Không xác định';
      }
    };

    floodZones.forEach((zone) => {
      const color = getColorByLevel(zone.level);
      const polygon = L.polygon(zone.coordinates as L.LatLngExpression[], {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        weight: 2,
      }).addTo(floodLayerRef.current!);

      polygon.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${zone.name}</h3>
          <div style="font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Mức độ:</strong> <span style="color: ${color};">${getLevelText(zone.level)}</span></p>
            <p style="margin: 4px 0;"><strong>Độ sâu:</strong> ${zone.depth} cm</p>
            <p style="margin: 4px 0;"><strong>Diện tích:</strong> ${zone.area} km²</p>
            <p style="margin: 4px 0;"><strong>Dân số ảnh hưởng:</strong> ${zone.affectedPopulation.toLocaleString()} người</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 11px;"><strong>Cập nhật:</strong> ${new Date(zone.lastUpdated).toLocaleTimeString('vi-VN')}</p>
          </div>
        </div>
      `);
    });
  }, [floodZones, showFloodLayer]);

  // Update flood stations
  useEffect(() => {
    if (!stationsLayerRef.current) return;

    stationsLayerRef.current.clearLayers();

    const getStationIcon = (status: string) => {
      const colors = {
        normal: '#22c55e',
        warning: '#eab308',
        danger: '#f97316',
        critical: '#dc2626',
      };
      const color = colors[status as keyof typeof colors] || '#6b7280';

      return L.divIcon({
        html: `<div style="font-size: 24px;">📍</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
    };

    const getStatusText = (status: string) => {
      switch (status) {
        case 'normal':
          return 'Bình thường';
        case 'warning':
          return 'Cảnh báo';
        case 'danger':
          return 'Nguy hiểm';
        case 'critical':
          return 'Rất nguy hiểm';
        default:
          return 'Không xác định';
      }
    };

    floodStations.forEach((station) => {
      const marker = L.marker(station.coordinates as L.LatLngExpression, {
        icon: getStationIcon(station.status),
      }).addTo(stationsLayerRef.current!);

      marker.bindPopup(`
        <div style="min-width: 220px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">📊 ${station.name}</h3>
          <div style="font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Mực nước:</strong> ${station.waterLevel.toFixed(2)} m</p>
            <p style="margin: 4px 0;"><strong>Trạng thái:</strong> <span style="color: ${
              station.status === 'normal' ? '#22c55e' :
              station.status === 'warning' ? '#eab308' :
              station.status === 'danger' ? '#f97316' : '#dc2626'
            };">${getStatusText(station.status)}</span></p>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 2px 0; font-size: 12px;">Mức 1: ${station.alertLevel1} m</p>
              <p style="margin: 2px 0; font-size: 12px;">Mức 2: ${station.alertLevel2} m</p>
              <p style="margin: 2px 0; font-size: 12px;">Mức 3: ${station.alertLevel3} m</p>
            </div>
            <p style="margin-top: 8px; color: #6b7280; font-size: 11px;"><strong>Cập nhật:</strong> ${new Date(station.lastUpdated).toLocaleTimeString('vi-VN')}</p>
          </div>
        </div>
      `);
    });
  }, [floodStations]);

  // Update flood warnings
  useEffect(() => {
    if (!warningsLayerRef.current) return;

    warningsLayerRef.current.clearLayers();

    const getWarningIcon = (level: string) => {
      return L.divIcon({
        html: `<div style="font-size: 28px;">⚠️</div>`,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      });
    };

    const getLevelColor = (level: string) => {
      switch (level) {
        case 'warning':
          return '#eab308';
        case 'danger':
          return '#f97316';
        case 'critical':
          return '#dc2626';
        default:
          return '#6b7280';
      }
    };

    const getLevelText = (level: string) => {
      switch (level) {
        case 'warning':
          return 'Cảnh báo';
        case 'danger':
          return 'Nguy hiểm';
        case 'critical':
          return 'Rất nguy hiểm';
        default:
          return 'Không xác định';
      }
    };

    floodWarnings.forEach((warning) => {
      const marker = L.marker(warning.coordinates as L.LatLngExpression, {
        icon: getWarningIcon(warning.level),
      }).addTo(warningsLayerRef.current!);

      marker.bindPopup(`
        <div style="min-width: 220px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">⚠️ ${warning.location}</h3>
          <div style="font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Mức độ:</strong> <span style="color: ${getLevelColor(warning.level)};">${getLevelText(warning.level)}</span></p>
            <p style="margin: 8px 0; padding: 8px; background: #fef3c7; border-left: 3px solid #eab308; border-radius: 4px;">${warning.message}</p>
            <p style="margin: 4px 0; color: #6b7280; font-size: 11px;"><strong>Thời gian:</strong> ${new Date(warning.timestamp).toLocaleString('vi-VN')}</p>
          </div>
        </div>
      `);
    });
  }, [floodWarnings]);

  // Toggle flood layer
  useEffect(() => {
    if (!showFloodLayer && floodLayerRef.current) {
      floodLayerRef.current.clearLayers();
    }
  }, [showFloodLayer]);

  return (
    <div id="flood-map" className="h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-sm" />
  );
}
