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
import { useState, useEffect } from 'react';
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
import TrafficReportForm, { TrafficReport } from '@/components/common/TrafficReportForm';
import TrafficReportsList from '@/components/common/TrafficReportsList';
import { getTrafficReports, submitTrafficReport } from '@/services/trafficReportService';
import LoadingSpinner from '@/components/common/LoadingSpinner';

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
  const [showReportForm, setShowReportForm] = useState(false);
  const [trafficReports, setTrafficReports] = useState<TrafficReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Reported' | 'Verified'>('All');

  // Fetch traffic reports on mount and when filter changes
  useEffect(() => {
    fetchTrafficReports();
  }, [statusFilter]);

  const fetchTrafficReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = statusFilter === 'All' ? undefined : statusFilter;
      const reports = await getTrafficReports(0, 50, status);
      console.log('Fetched traffic reports:', reports);
      setTrafficReports(reports);
    } catch (err) {
      setError('Không thể tải báo cáo giao thông');
      console.error('Error fetching traffic reports:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmitReport = async (report: Omit<TrafficReport, 'id' | 'timestamp' | 'status'>) => {
    try {
      const newReport = await submitTrafficReport(report);
      setTrafficReports([newReport, ...trafficReports]);
      setShowReportForm(false);
      alert('Báo cáo đã được gửi thành công! Cảm ơn bạn đã đóng góp thông tin cho cộng đồng.');
      // Refresh reports list
      fetchTrafficReports();
    } catch (err) {
      alert('Không thể gửi báo cáo. Vui lòng thử lại!');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="text-4xl">🚦</span>
              {t('traffic')}
            </h1>
            <p className="text-gray-600">
              Theo dõi tình trạng giao thông và tìm đường tối ưu
            </p>
          </div>
          <button
            onClick={() => setShowReportForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg hover:from-red-600 hover:to-orange-600 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-xl">🚗</span>
            Báo cáo kẹt xe
          </button>
        </div>
      </div>

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

      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700">
            Traffic Map - OpenStreetMap
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-gray-600">Lớp giao thông real-time:</span>
            <button
              onClick={() => setShowTrafficLayer(!showTrafficLayer)}
              className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
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
          trafficReports={trafficReports}
        />
      </div>

      <TrafficOverview data={trafficOverview} hotspotCount={trafficHotspots.length} />

      {/* Traffic Reports */}
      <div className="mt-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 mr-2">Lọc theo trạng thái:</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                statusFilter === 'All'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setStatusFilter('Reported')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                statusFilter === 'Reported'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đã báo cáo
            </button>
            <button
              onClick={() => setStatusFilter('Verified')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                statusFilter === 'Verified'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Đã xác minh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchTrafficReports}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Thử lại
          </button>
        </div>
      ) : trafficReports.length > 0 ? (
        <TrafficReportsList reports={trafficReports} />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">Chưa có báo cáo kẹt xe nào</p>
        </div>
      )}
      </div>

      {/* <TrafficHotspots hotspots={trafficHotspots} /> */}
      {/* <TrafficIncidents incidents={trafficIncidents} /> */}
      {/* <TrafficStatistics statsByTime={trafficStatsByTime} routeStats={routeStatistics} /> */}

      {/* Report Form Modal */}
      {showReportForm && (
        <TrafficReportForm
          onSubmit={handleSubmitReport}
          onClose={() => setShowReportForm(false)}
        />
      )}
    </div>
  );
}
