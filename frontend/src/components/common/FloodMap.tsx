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
import { FloodReport } from './FloodReportForm';
import { FloodMonitoringData } from '@/services/floodMonitoringService';

// Fix for default marker icons in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface FloodMapProps {
  floodReports?: FloodReport[];
  floodMonitoringData?: FloodMonitoringData[];
}

export default function FloodMap({
  floodReports = [],
  floodMonitoringData = [],
}: FloodMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const legendRef = useRef<L.Control | null>(null);
  const floodReportMarkersRef = useRef<any[]>([]);
  const floodMonitoringMarkersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  // Track when map is ready
  useEffect(() => {
    if (mapRef.current && !mapReady) {
      setMapReady(true);
    }
  }, [mapRef.current, mapReady]);

  // Helper functions for severity styling
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'Critical':
        return '#dc2626'; // red-600
      case 'High':
        return '#ea580c'; // orange-600
      case 'Medium':
        return '#ca8a04'; // yellow-600
      case 'Low':
        return '#16a34a'; // green-600
      default:
        return '#3b82f6'; // blue-500
    }
  };

  const getSeveritySize = (severity: string): { width: number; height: number; fontSize: number } => {
    switch (severity) {
      case 'Critical':
        return { width: 56, height: 56, fontSize: 24 };
      case 'High':
        return { width: 50, height: 50, fontSize: 22 };
      case 'Medium':
        return { width: 44, height: 44, fontSize: 20 };
      case 'Low':
        return { width: 40, height: 40, fontSize: 18 };
      default:
        return { width: 44, height: 44, fontSize: 20 };
    }
  };

  // Initialize map
  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map('flood-map').setView([10.8231, 106.6297], 12);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add combined legend with collapse functionality
    const Legend = L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        const div = L.DomUtil.create('div', 'flood-legend');
        let isCollapsed = false;
        
        const updateLegend = () => {
          if (isCollapsed) {
            div.innerHTML = `
              <div style="background: white; padding: 8px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); color: #000000; cursor: pointer;" id="legend-toggle">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="font-weight: bold; font-size: 11px; color: #000000;">Cảm biến ngập lụt</span>
                  <span style="font-size: 12px; margin-left: 8px;">▼</span>
                </div>
              </div>
            `;
          } else {
            div.innerHTML = `
              <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); color: #000000;">
                <div style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; margin-bottom: 8px;" id="legend-toggle">
                  <span style="font-weight: bold; font-size: 12px; color: #374151;">Cảm biến ngập lụt</span>
                  <span style="font-size: 12px; margin-left: 8px;">▲</span>
                </div>
                <div id="legend-content">
                  <div style="display: flex; align-items: center; margin-bottom: 4px;">
                    <div style="width: 16px; height: 16px; background: #10b981; border: 2px solid white; margin-right: 8px; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                    <span style="font-size: 12px; color: #000000;">Bình thường</span>
                  </div>
                  <div style="display: flex; align-items: center; margin-bottom: 4px;">
                    <div style="width: 16px; height: 16px; background: #f59e0b; border: 2px solid white; margin-right: 8px; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                    <span style="font-size: 12px; color: #000000;">Cảnh báo</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <div style="width: 16px; height: 16px; background: #ef4444; border: 2px solid white; margin-right: 8px; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                    <span style="font-size: 12px; color: #000000;">Nguy hiểm</span>
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

  // Render flood report markers
  useEffect(() => {
    // Clear existing markers
    floodReportMarkersRef.current.forEach((marker) => {
      if (mapRef.current && marker) {
        mapRef.current.removeLayer(marker);
      }
    });
    floodReportMarkersRef.current = [];

    // Wait for map to be ready
    if (!mapReady || !mapRef.current) return;

    // Store reference to avoid null issues
    const map = mapRef.current;

    // Add new markers
    floodReports.forEach((report) => {
      if (!report.latitude || !report.longitude) return;

      const color = getSeverityColor(report.severity);
      const size = getSeveritySize(report.severity);
      
      // Add pulsing animation for Critical severity
      const pulseAnimation = report.severity === 'Critical'
        ? `
          animation: pulse 2s ease-in-out infinite;
        `
        : '';

      // Create custom icon
      const customIcon = L.divIcon({
        className: 'custom-flood-marker',
        html: `
          <style>
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.1);
                opacity: 0.9;
              }
            }
          </style>
          <div style="
            background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
            width: ${size.width}px;
            height: ${size.height}px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4), 0 0 0 4px ${color}33;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${size.fontSize}px;
            ${pulseAnimation}
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
            
          </div>
        `,
        iconSize: [size.width, size.height],
        iconAnchor: [size.width / 2, size.height / 2],
      });

      // Create marker
      const marker = L.marker([report.latitude, report.longitude], {
        icon: customIcon,
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: ${color};">
            ${report.severity} - Ngập lụt
          </h3>
          <div style="margin-bottom: 4px;">
            <strong>Địa điểm:</strong> ${report.street_name || 'N/A'}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Người báo:</strong> ${report.reporter_username || 'Anonymous'}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>Trạng thái:</strong> ${report.status || 'Active'}
          </div>
          ${report.description ? `
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <strong>Chi tiết:</strong><br/>
              ${report.description}
            </div>
          ` : ''}
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            ${new Date(report.created_at || '').toLocaleString('vi-VN')}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      floodReportMarkersRef.current.push(marker);
    });
  }, [floodReports, mapReady, mapRef]);

  // Render flood monitoring sensor markers
  useEffect(() => {
    // Clear existing markers
    floodMonitoringMarkersRef.current.forEach((marker) => {
      if (mapRef.current && marker) {
        mapRef.current.removeLayer(marker);
      }
    });
    floodMonitoringMarkersRef.current = [];

    // Wait for map to be ready
    if (!mapReady || !mapRef.current) return;

    if (!floodMonitoringData.length) return;

    console.log('Rendering flood monitoring sensors:', floodMonitoringData.length);

    const map = mapRef.current;

    // Add new sensor markers
    floodMonitoringData.forEach((sensor) => {
      if (!sensor.location?.value?.coordinates) {
        console.warn('Sensor missing coordinates:', sensor);
        return;
      }

      const [lng, lat] = sensor.location.value.coordinates;
      const waterLevel = sensor.waterLevel?.value || sensor.currentLevel?.value || 0;
      const alertLevel = sensor.alertLevel?.value || 0;
      const dangerLevel = sensor.dangerLevel?.value || 0;
      const status = sensor.floodLevelStatus?.value || 'normal';
      const stationID = sensor.stationID?.value || sensor.id.split(':').pop() || sensor.id;
      const address = sensor.address?.value?.streetAddress || 'N/A';

      // Determine color based on flood level status
      let sensorColor = '#10b981'; // green
      let statusText = 'Bình thường';
      
      if (status.toLowerCase() === 'danger' || waterLevel >= dangerLevel) {
        sensorColor = '#ef4444'; // red
        statusText = 'Nguy hiểm';
      } else if (status.toLowerCase() === 'alert' || waterLevel >= alertLevel) {
        sensorColor = '#f59e0b'; // yellow
        statusText = 'Cảnh báo';
      }

      // Create custom icon for flood sensor
      const sensorIcon = L.divIcon({
        className: 'custom-flood-sensor-marker',
        html: `
          <div style="
            background: linear-gradient(135deg, ${sensorColor} 0%, ${sensorColor}dd 100%);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3), 0 0 0 3px ${sensorColor}33;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 20px;
            cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            💧
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      // Create marker
      const marker = L.marker([lat, lng], {
        icon: sensorIcon,
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="min-width: 220px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: ${sensorColor}; display: flex; align-items: center; gap: 6px;">
            💧 Trạm ngập lụt
          </h3>
          <div style="background: ${sensorColor}22; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
            <div style="font-weight: bold; color: ${sensorColor}; margin-bottom: 4px;">
              ${statusText}
            </div>
            <div style="font-size: 24px; font-weight: bold; color: ${sensorColor};">
              ${waterLevel.toFixed(2)} m
            </div>
          </div>
          <div style="margin-bottom: 4px;">
            <strong>📍 Địa điểm:</strong> ${address}
          </div>
          <div style="margin-bottom: 4px;">
            <strong>⚠️ Mức cảnh báo:</strong> ${alertLevel.toFixed(2)} m
          </div>
          <div style="margin-bottom: 4px;">
            <strong>🚨 Mức nguy hiểm:</strong> ${dangerLevel.toFixed(2)} m
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
            <div style="font-size: 11px; color: #6b7280;">
              Trạm: ${stationID}
            </div>
            ${sensor.dateObserved?.value?.['@value'] ? `
              <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">
                Cập nhật: ${new Date(sensor.dateObserved.value['@value']).toLocaleString('vi-VN')}
              </div>
            ` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      floodMonitoringMarkersRef.current.push(marker);
    });
  }, [floodMonitoringData, mapReady, mapRef]);

  return (
    <div id="flood-map" className="h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden shadow-sm" />
  );
}
