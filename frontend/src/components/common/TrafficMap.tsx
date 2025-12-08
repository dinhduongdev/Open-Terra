/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { RoutePoint, RouteResult } from '@/services/routingService';
import { TrafficReport } from './TrafficReportForm';
import { TrafficFlowData } from '@/services/trafficFlowService';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useTrafficData } from '@/hooks/useTrafficData';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useTrafficLayer } from '@/hooks/useTrafficLayer';
import { useRouting } from '@/hooks/useRouting';
import { useEffect, useRef, useState } from 'react';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  showTrafficLayer?: boolean;
  onTrafficLayerToggle?: (enabled: boolean) => void;
  enableRouting?: boolean;
  routeOrigin?: RoutePoint;
  routeDestination?: RoutePoint;
  onRouteCalculated?: (route: RouteResult | null) => void;
  trafficReports?: TrafficReport[];
  trafficFlowData?: TrafficFlowData[];
}

export default function TrafficMap({
  center,
  zoom = 13,
  className = 'h-[600px] w-full',
  showTrafficLayer = false,
  enableRouting = false,
  routeOrigin,
  routeDestination,
  onRouteCalculated,
  trafficReports = [],
  trafficFlowData = [],
}: MapProps) {
  // Custom hooks for managing map functionality
  const { userLocation, locationError } = useUserLocation(center);
  const trafficData = useTrafficData(30000);
  const trafficReportMarkersRef = useRef<any[]>([]);
  const trafficFlowMarkersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const mapCenter = center || userLocation;

  const { mapRef, trafficLayerRef, routeLayerRef, legendRef } = useMapInitialization({
    center: mapCenter,
    zoom,
    locationError,
    showTrafficLayer,
  });

  // Wait for map to be ready - check periodically
  useEffect(() => {
    const checkMapReady = setInterval(() => {
      if (mapRef.current && !mapReady) {
        console.log('Map is ready!');
        setMapReady(true);
        clearInterval(checkMapReady);
      }
    }, 100);

    return () => clearInterval(checkMapReady);
  }, [mapReady]);

  useTrafficLayer({
    mapRef,
    trafficLayerRef,
    legendRef,
    trafficData,
    showTrafficLayer,
  });

  useRouting({
    mapRef,
    routeLayerRef,
    enableRouting,
    routeOrigin,
    routeDestination,
    onRouteCalculated,
  });

  // Render traffic report markers
  useEffect(() => {
    // Clear existing markers first
    trafficReportMarkersRef.current.forEach(marker => marker.remove());
    trafficReportMarkersRef.current = [];

    if (!mapReady || !mapRef.current) {
      console.log('Map not ready yet, mapReady:', mapReady, 'mapRef.current:', !!mapRef.current);
      return;
    }

    if (!trafficReports.length) {
      console.log('No traffic reports to display');
      return;
    }

    console.log('Rendering markers for', trafficReports.length, 'reports');

    // Store reference to avoid null issues
    const map = mapRef.current;

    // Function to get marker color based on severity
    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'Critical': return '#dc2626'; // red-600
        case 'High': return '#ea580c'; // orange-600
        case 'Medium': return '#ca8a04'; // yellow-600
        case 'Low': return '#16a34a'; // green-600
        default: return '#6b7280'; // gray-500
      }
    };

    const getSeveritySize = (severity: string) => {
      switch (severity) {
        case 'Critical': return { width: 56, height: 56, fontSize: 28 };
        case 'High': return { width: 48, height: 48, fontSize: 24 };
        case 'Medium': return { width: 44, height: 44, fontSize: 22 };
        case 'Low': return { width: 40, height: 40, fontSize: 20 };
        default: return { width: 44, height: 44, fontSize: 22 };
      }
    };

    // Import Leaflet dynamically
    import('leaflet').then((L) => {
      trafficReports.forEach((report) => {
        if (!report.latitude || !report.longitude) {
          console.warn('Report missing coordinates:', report);
          return;
        }

        const color = getSeverityColor(report.severity);
        const size = getSeveritySize(report.severity);
        
        // Create custom icon with pulsing animation for High severity
        const pulseAnimation = report.severity === 'High' 
          ? 'animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;'
          : '';
        
        const customIcon = L.divIcon({
          className: 'custom-traffic-marker',
          html: `
            <style>
              @keyframes pulse {
                0%, 100% {
                  opacity: 1;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.7;
                  transform: scale(1.1);
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
              🚗
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
              ${report.severity} - Kẹt xe
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
            ${report.created_at || report.timestamp ? `
              <div style="margin-top: 8px; font-size: 12px; color: #6b7280;">
                ${new Date(report.created_at || report.timestamp).toLocaleString('vi-VN')}
              </div>
            ` : ''}
          </div>
        `;

        marker.bindPopup(popupContent);
        trafficReportMarkersRef.current.push(marker);
      });

      // Add legend for traffic reports if there are any
      if (trafficReports.length > 0) {
        const Legend = L.Control.extend({
          options: { position: 'bottomright' },
          onAdd: function () {
            const div = L.DomUtil.create('div', 'traffic-legend');
            div.innerHTML = `
              <div style="
                background: white;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                font-size: 12px;
                line-height: 1.6;
              ">
                <div style="font-weight: bold; margin-bottom: 8px; color: #374151;">Mức độ kẹt xe:</div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <div style="width: 16px; height: 16px; background-color: #16a34a; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                  <span>Nhẹ</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <div style="width: 16px; height: 16px; background-color: #ca8a04; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                  <span>Trung bình</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <div style="width: 16px; height: 16px; background-color: #ea580c; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                  <span>Nặng</span>
                </div>
              </div>
            `;
            return div;
          },
        });
        
        const legend = new Legend();
        legend.addTo(map);
        trafficReportMarkersRef.current.push({ remove: () => legend.remove() });
      }
    });

    // Cleanup function
    return () => {
      trafficReportMarkersRef.current.forEach(marker => marker.remove());
      trafficReportMarkersRef.current = [];
    };
  }, [trafficReports, mapReady]);

  // Render traffic flow sensor markers
  useEffect(() => {
    // Clear existing markers first
    trafficFlowMarkersRef.current.forEach(marker => marker.remove());
    trafficFlowMarkersRef.current = [];

    if (!mapReady || !mapRef.current) {
      return;
    }

    if (!trafficFlowData.length) {
      return;
    }

    console.log('Rendering traffic flow sensors:', trafficFlowData.length);

    const map = mapRef.current;

    // Import Leaflet dynamically
    import('leaflet').then((L) => {
      trafficFlowData.forEach((sensor) => {
        if (!sensor.location?.value?.coordinates) {
          console.warn('Sensor missing coordinates:', sensor);
          return;
        }

        const [lng, lat] = sensor.location.value.coordinates;
        const speed = sensor.averageVehicleSpeed?.value || 0;
        const congested = sensor.congested?.value || false;
        const intensity = sensor.intensity?.value || 0;
        const occupancy = sensor.occupancy?.value || 0;
        const laneId = sensor.laneId?.value || 'N/A';

        // Determine color based on congestion status
        const sensorColor = congested ? '#ef4444' : speed > 40 ? '#10b981' : speed > 25 ? '#f59e0b' : '#ef4444';
        const statusText = congested ? 'Tắc nghẽn' : speed > 40 ? 'Thông thoáng' : speed > 25 ? 'Chậm' : 'Kẹt';
        
        // Create custom icon for traffic sensor
        const sensorIcon = L.divIcon({
          className: 'custom-sensor-marker',
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
              font-size: 18px;
              cursor: pointer;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
              📡
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
              Cảm biến giao thông
            </h3>
            <div style="background: ${sensorColor}22; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
              <div style="font-weight: bold; color: ${sensorColor}; margin-bottom: 4px;">
                ${statusText}
              </div>
              <div style="font-size: 24px; font-weight: bold; color: ${sensorColor};">
                ${speed.toFixed(1)} km/h
              </div>
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Cường độ:</strong> ${intensity} xe/phút
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Mật độ:</strong> ${(occupancy * 100).toFixed(0)}%
            </div>
            <div style="margin-bottom: 4px;">
              <strong>Làn đường:</strong> ${laneId}
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
              <div style="font-size: 11px; color: #6b7280;">
                ID: ${sensor.id.split(':').pop()}
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
        trafficFlowMarkersRef.current.push(marker);
      });

      // Add legend for traffic flow sensors if there are any
      if (trafficFlowData.length > 0) {
        const SensorLegend = L.Control.extend({
          options: { position: 'topright' },
          onAdd: function () {
            const div = L.DomUtil.create('div', 'sensor-legend');
            div.innerHTML = `
              <div style="
                background: white;
                padding: 12px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                font-size: 12px;
                line-height: 1.6;
                color: black;
              ">
                <div style="font-weight: bold; margin-bottom: 8px; color: #374151;">Cảm biến giao thông:</div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <div style="width: 16px; height: 16px; background-color: #10b981; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                  <span>Thông thoáng (>40 km/h)</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 4px;">
                  <div style="width: 16px; height: 16px; background-color: #f59e0b; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                  <span>Chậm (25-40 km/h)</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <div style="width: 16px; height: 16px; background-color: #ef4444; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                  <span>Kẹt/Tắc (<25 km/h)</span>
                </div>
              </div>
            `;
            return div;
          },
        });
        
        const sensorLegend = new SensorLegend();
        sensorLegend.addTo(map);
        trafficFlowMarkersRef.current.push({ remove: () => sensorLegend.remove() });
      }
    });

    // Cleanup function
    return () => {
      trafficFlowMarkersRef.current.forEach(marker => marker.remove());
      trafficFlowMarkersRef.current = [];
    };
  }, [trafficFlowData, mapReady]);

  return <div id="map" className={className} />;
}
