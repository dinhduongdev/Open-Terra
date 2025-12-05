/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { RoutePoint, RouteResult } from '@/services/routingService';
import { PopularLocation } from '@/types/traffic';
import {
  trafficOverview,
  trafficHotspots,
  trafficIncidents,
  trafficStatsByTime,
  routeStatistics,
  popularLocations,
} from '@/constants/trafficMockData';
import RoutingPanel from '@/components/common/RoutingPanel';
import RouteInfo from '@/components/common/RouteInfo';
import TrafficOverview from '@/components/common/TrafficOverview';
import TrafficHotspots from '@/components/common/TrafficHotspots';
import TrafficIncidents from '@/components/common/TrafficIncidents';
import TrafficStatistics from '@/components/common/TrafficStatistics';

// Dynamically import Map component with no SSR to avoid window/document issues
const TrafficMapDynamic = dynamic(() => import('@/components/common/TrafficMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function TrafficPage() {
  const t = useTranslations('sidebar');
  const [showTrafficLayer, setShowTrafficLayer] = useState(true);
  const [enableRouting, setEnableRouting] = useState(false);
  const [routeOrigin, setRouteOrigin] = useState<RoutePoint | undefined>();
  const [routeDestination, setRouteDestination] = useState<RoutePoint | undefined>();
  const [currentRoute, setCurrentRoute] = useState<RouteResult | null>(null);

  const handleRoutingToggle = (enabled: boolean) => {
    setEnableRouting(enabled);
    if (enabled) {
      setShowTrafficLayer(false);
    }
    if (!enabled) {
      setRouteOrigin(undefined);
      setRouteDestination(undefined);
      setCurrentRoute(null);
    }
  };

  const handleSetOrigin = (location: PopularLocation) => {
    setRouteOrigin({ ...location });
  };

  const handleSetDestination = (location: PopularLocation) => {
    setRouteDestination({ ...location });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('traffic')}</h1>

      <RoutingPanel
        enableRouting={enableRouting}
        onRoutingToggle={handleRoutingToggle}
        routeOrigin={routeOrigin}
        routeDestination={routeDestination}
        onSetOrigin={handleSetOrigin}
        onSetDestination={handleSetDestination}
        popularLocations={popularLocations}
      />

      {currentRoute && <RouteInfo route={currentRoute} />}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Traffic Map - OpenStreetMap
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Lớp giao thông real-time:</span>
            <button
              onClick={() => setShowTrafficLayer(!showTrafficLayer)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showTrafficLayer
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {showTrafficLayer ? '✓ Đang bật' : 'Tắt'}
            </button>
          </div>
        </div>
        <TrafficMapDynamic
          showTrafficLayer={showTrafficLayer}
          onTrafficLayerToggle={setShowTrafficLayer}
          enableRouting={enableRouting}
          routeOrigin={routeOrigin}
          routeDestination={routeDestination}
          onRouteCalculated={setCurrentRoute}
        />
      </div>

      <TrafficOverview data={trafficOverview} hotspotCount={trafficHotspots.length} />
      <TrafficHotspots hotspots={trafficHotspots} />
      <TrafficIncidents incidents={trafficIncidents} />
      <TrafficStatistics statsByTime={trafficStatsByTime} routeStats={routeStatistics} />
    </div>
  );
}
