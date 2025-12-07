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
}: MapProps) {
  // Custom hooks for managing map functionality
  const { userLocation, locationError } = useUserLocation(center);
  const trafficData = useTrafficData(30000);
  const trafficReportMarkersRef = useRef<any[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const mapCenter = center || userLocation;

  const { mapRef, trafficLayerRef, routeLayerRef, legendRef } = useMapInitialization({
    center: mapCenter,
    zoom,
    locationError,
    showTrafficLayer,
  });

  // Wait for map to be ready
  useEffect(() => {
    if (mapRef.current) {
      setMapReady(true);
    }
  }, [mapRef]);

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
    if (!mapReady || !mapRef.current) {
      console.log('Map not ready yet, mapReady:', mapReady, 'mapRef.current:', !!mapRef.current);
      return;
    }

    // Clear existing markers
    trafficReportMarkersRef.current.forEach(marker => marker.remove());
    trafficReportMarkersRef.current = [];

    if (!trafficReports.length) {
      console.log('No traffic reports to display');
      return;
    }

    console.log('Rendering markers for', trafficReports.length, 'reports');

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
        
        // Create custom icon with pulsing animation for Critical
        const pulseAnimation = report.severity === 'Critical' 
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
        }).addTo(mapRef.current);

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
        const legend = L.control({ position: 'bottomright' });
        
        legend.onAdd = function () {
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
              <div style="display: flex; align-items: center;">
                <div style="width: 16px; height: 16px; background-color: #dc2626; border-radius: 50%; margin-right: 8px; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                <span>Nghiêm trọng</span>
              </div>
            </div>
          `;
          return div;
        };
        
        legend.addTo(mapRef.current);
        trafficReportMarkersRef.current.push({ remove: () => legend.remove() });
      }
    });

    // Cleanup function
    return () => {
      trafficReportMarkersRef.current.forEach(marker => marker.remove());
      trafficReportMarkersRef.current = [];
    };
  }, [trafficReports, mapReady, mapRef]);

  return <div id="map" className={className} />;
}
