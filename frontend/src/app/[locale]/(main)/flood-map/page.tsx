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
import FloodReportForm, { FloodReport } from '@/components/common/FloodReportForm';
import FloodReportsList from '@/components/common/FloodReportsList';
import FloodMonitoringList from '@/components/common/FloodMonitoringList';
import { getFloodReports, submitFloodReport } from '@/services/floodReportService';
import { getLatestFloodMonitoring, FloodMonitoringData } from '@/services/floodMonitoringService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

// Dynamically import Map component with no SSR to avoid window/document issues
const FloodMapDynamic = dynamic(() => import('@/components/common/FloodMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  ),
});

export default function FloodMapPage() {
  const t = useTranslations('sidebar');
  const tTitle = useTranslations('pageTitles');
  const tFlood = useTranslations('floodMap');
  const [showReportForm, setShowReportForm] = useState(false);
  const [citizenReports, setCitizenReports] = useState<FloodReport[]>([]);
  const [floodMonitoringData, setFloodMonitoringData] = useState<FloodMonitoringData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Reported' | 'Verified'>('All');

  // Update document title
  useEffect(() => {
    document.title = `Open-Terra - ${tTitle('floodMap')}`;
  }, [tTitle]);

  // Fetch flood reports on mount and when filter changes
  useEffect(() => {
    fetchFloodReports();
  }, [statusFilter]);

  // Fetch flood monitoring data on mount and periodically
  useEffect(() => {
    fetchFloodMonitoringData();
    
    // Refresh flood monitoring data every 30 seconds
    const interval = setInterval(fetchFloodMonitoringData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchFloodReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = statusFilter === 'All' ? undefined : statusFilter;
      const reports = await getFloodReports(0, 50, status);
      console.log('Fetched flood reports:', reports);
      setCitizenReports(reports);
    } catch (err) {
      setError(tFlood('errorLoadReports'));
      console.error('Error fetching flood reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFloodMonitoringData = async () => {
    try {
      const monitoringData = await getLatestFloodMonitoring();
      console.log('Fetched flood monitoring data:', monitoringData);
      setFloodMonitoringData(monitoringData);
    } catch (err) {
      toast.error(tFlood('errorLoadMonitoring'));
    }
  };

  const handleSubmitReport = async (report: Omit<FloodReport, 'id' | 'timestamp' | 'status'>) => {
    try {
      const newReport = await submitFloodReport(report);
      setCitizenReports([newReport, ...citizenReports]);
      setShowReportForm(false);
      toast.success(tFlood('reportSuccess'));
      fetchFloodReports();
    } catch (err) {
      toast.error(tFlood('reportError'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                {t('floodMap')}
              </h1>
              <p className="text-gray-600">
                {tFlood('subtitle')}
              </p>
            </div>
            <button
              onClick={() => setShowReportForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 whitespace-nowrap"
            >
              {tFlood('reportButton')}
            </button>
          </div>
        </div>

      {/* Main Map */}
      <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold text-gray-700 flex items-center gap-2 mb-4">
          {tFlood('mapTitle')}
        </h2>
        <FloodMapDynamic 
          floodReports={citizenReports}
          floodMonitoringData={floodMonitoringData}
        />
      </div>

      {/* Flood Monitoring Sensors List */}
      <div className="mt-8">
        <FloodMonitoringList sensors={floodMonitoringData} />
      </div>

      {/* Citizen Reports */}
      <div className="mt-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700 mr-2">{tFlood('filterTitle')}</span>
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                statusFilter === 'All'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tFlood('filterAll')}
            </button>
            <button
              onClick={() => setStatusFilter('Reported')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                statusFilter === 'Reported'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tFlood('filterReported')}
            </button>
            <button
              onClick={() => setStatusFilter('Verified')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                statusFilter === 'Verified'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tFlood('filterVerified')}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchFloodReports}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              {tFlood('retryButton')}
            </button>
          </div>
        ) : citizenReports.length > 0 ? (
          <FloodReportsList reports={citizenReports} />
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">{tFlood('noReports')}</p>
          </div>
        )}
      </div>

      {/* Warnings */}
      {/* <FloodWarnings warnings={floodWarnings} /> */}

      {/* Statistics */}
      {/* <FloodStatistics statsByTime={floodStatsByTime} stations={floodStations} /> */}

      {/* Safety Tips */}
      <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg shadow-md p-6 border-l-4 border-red-500">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
           {tFlood('safety.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
               {tFlood('safety.avoid.title')}
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{tFlood('safety.avoid.tip1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{tFlood('safety.avoid.tip2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{tFlood('safety.avoid.tip3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>{tFlood('safety.avoid.tip4')}</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
               {tFlood('safety.should.title')}
            </h3>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{tFlood('safety.should.tip1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{tFlood('safety.should.tip2')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{tFlood('safety.should.tip3')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>{tFlood('safety.should.tip4')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

        {/* Report Form Modal */}
        {showReportForm && (
          <FloodReportForm
            onSubmit={handleSubmitReport}
            onClose={() => setShowReportForm(false)}
          />
        )}
      </div>
    </div>
  );
}
