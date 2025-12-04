/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  RoutePoint,
  RouteResult,
  calculateRoute,
  formatDistance,
  formatDuration,
  calculateArrivalTime,
} from '@/services/routingService';

interface UseRoutingProps {
  mapRef: React.MutableRefObject<L.Map | null>;
  routeLayerRef: React.MutableRefObject<L.LayerGroup | null>;
  enableRouting: boolean;
  routeOrigin?: RoutePoint;
  routeDestination?: RoutePoint;
  onRouteCalculated?: (route: RouteResult | null) => void;
}

export const useRouting = ({
  mapRef,
  routeLayerRef,
  enableRouting,
  routeOrigin,
  routeDestination,
  onRouteCalculated,
}: UseRoutingProps) => {
  const originMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);

  useEffect(() => {
    if (!enableRouting || !mapRef.current || !routeLayerRef.current) return;

    // Clear previous route and markers
    routeLayerRef.current.clearLayers();
    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
      originMarkerRef.current = null;
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }

    // If both origin and destination are set, calculate route
    if (routeOrigin && routeDestination) {
      // Add origin marker (green)
      const originIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #22c55e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      originMarkerRef.current = L.marker([routeOrigin.lat, routeOrigin.lng], {
        icon: originIcon,
      })
        .addTo(mapRef.current)
        .bindPopup(
          `<div style="font-weight: bold;">📍 Điểm xuất phát</div><div>${
            routeOrigin.name || 'Vị trí bắt đầu'
          }</div>`
        );

      // Add destination marker (red)
      const destIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      destinationMarkerRef.current = L.marker(
        [routeDestination.lat, routeDestination.lng],
        { icon: destIcon }
      )
        .addTo(mapRef.current)
        .bindPopup(
          `<div style="font-weight: bold;">🎯 Điểm đến</div><div>${
            routeDestination.name || 'Đích đến'
          }</div>`
        );

      // Calculate route
      calculateRoute(routeOrigin, routeDestination, 'car').then((route) => {
        if (route && routeLayerRef.current && mapRef.current) {
          setCurrentRoute(route);

          // Draw route on map
          const routeLine = L.polyline(route.coordinates, {
            color: '#3b82f6',
            weight: 5,
            opacity: 0.7,
            dashArray: '10, 10',
          });

          routeLine.bindPopup(`
            <div style="min-width: 220px;">
              <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">🚗 Thông tin tuyến đường</div>
              <div style="margin-bottom: 4px;">
                <strong>Khoảng cách:</strong> ${formatDistance(route.distance)}
              </div>
              <div style="margin-bottom: 4px;">
                <strong>Thời gian:</strong> ${formatDuration(route.duration)}
              </div>
              <div style="margin-bottom: 4px;">
                <strong>Dự kiến đến:</strong> ${calculateArrivalTime(
                  route.duration
                ).toLocaleTimeString('vi-VN')}
              </div>
            </div>
          `);

          routeLine.addTo(routeLayerRef.current);

          // Fit map to show entire route
          mapRef.current.fitBounds(routeLine.getBounds(), {
            padding: [50, 50],
          });

          // Notify parent component
          if (onRouteCalculated) {
            onRouteCalculated(route);
          }
        } else {
          setCurrentRoute(null);
          if (onRouteCalculated) {
            onRouteCalculated(null);
          }
        }
      });
    }
  }, [enableRouting, routeOrigin, routeDestination, mapRef, routeLayerRef, onRouteCalculated]);

  return { currentRoute };
};
