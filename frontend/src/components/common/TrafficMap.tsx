'use client';

import { RoutePoint, RouteResult } from '@/services/routingService';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useTrafficData } from '@/hooks/useTrafficData';
import { useMapInitialization } from '@/hooks/useMapInitialization';
import { useTrafficLayer } from '@/hooks/useTrafficLayer';
import { useRouting } from '@/hooks/useRouting';

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
}: MapProps) {
  // Custom hooks for managing map functionality
  const { userLocation, locationError } = useUserLocation(center);
  const trafficData = useTrafficData(30000);

  const mapCenter = center || userLocation;

  const { mapRef, trafficLayerRef, routeLayerRef, legendRef } = useMapInitialization({
    center: mapCenter,
    zoom,
    locationError,
    showTrafficLayer,
  });

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

  return <div id="map" className={className} />;
}
