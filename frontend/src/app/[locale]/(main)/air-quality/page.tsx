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
import {
  getLatestAirQuality,
  calculateAirQualityOverview,
  extractPollutantsData,
  formatStationForDisplay,
} from '@/services/airQualityService';
import { AirQualityStation } from '@/types/airQuality';
import AirQualityOverviewComponent from '@/components/common/AirQualityOverview';
import AirQualityStationsList from '@/components/common/AirQualityStationsList';
import PollutantsOverview from '@/components/common/PollutantsOverview';
import AirQualityStatistics from '@/components/common/AirQualityStatistics';
import HealthRecommendations from '@/components/common/HealthRecommendations';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import StationSelector from '@/components/common/StationSelector';
import ExportDataDialog from '@/components/export/ExportDataDialog';

// Dynamically import Map component with no SSR to avoid window/document issues
const AirQualityMapDynamic = dynamic(() => import('@/components/common/AirQualityMap'), {
  ssr: false,
  loading: () => {
    const tAir = useTranslations('airQuality');
    return (
      <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">{tAir('loading')}</p>
      </div>
    );
  },
});

export default function AirQualityPage() {
  const t = useTranslations('sidebar');
  const tExport = useTranslations('export');
  const tTitle = useTranslations('pageTitles');
  const tAir = useTranslations('airQuality');
  const [showStations, setShowStations] = useState(true);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [stations, setStations] = useState<AirQualityStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Update document title
  useEffect(() => {
    document.title = `Open-Terra - ${tTitle('airQuality')}`;
  }, [tTitle]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLatestAirQuality();
        setStations(data);
      } catch (err) {
        console.error('Failed to fetch air quality data:', err);
        setError(err instanceof Error ? err.message : tAir('errorLoad'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Calculate derived data from stations
  const overview = calculateAirQualityOverview(stations);
  const pollutants = extractPollutantsData(stations);
  const formattedStations = stations.map(formatStationForDisplay);

  // Extract station IDs for selector
  const stationOptions = stations.map((station) => {
    // Extract numeric ID from URN format: "urn:ngsi-ld:AirQualityObserved:airquality:3276359:latest"
    const idMatch = station.id.match(/:(\d+):/);
    const numericId = idMatch ? idMatch[1] : station.id;
    
    return {
      id: numericId,
      name: station.name,
      areaServed: station.areaServed,
    };
  });

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {tAir('retryButton')}
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2 md:gap-3">
          {t('airQuality')}
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          {tAir('subtitle')}
        </p>
      </div>

      {/* Overview Stats */}
      <AirQualityOverviewComponent data={overview} />

      {/* No data message */}
      {stations.length === 0 && (
        <div className="mt-6 md:mt-8 bg-yellow-50 border-l-4 border-yellow-500 p-4 md:p-6 rounded-lg">
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-2xl md:text-3xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1 text-sm md:text-base">{tAir('noData')}</h3>
              <p className="text-yellow-800 text-xs md:text-sm">
                {tAir('noDataMessage')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Map */}
      {stations.length > 0 && (
        <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 flex items-center gap-2">
              {tAir('title')} - OpenStreetMap
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-gray-600">{tAir('stationsList.title')}:</span>
              <button
                onClick={() => setShowStations(!showStations)}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  showStations
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {showStations ? `✓ ${tAir('overview.active')}` : tAir('overview.active').replace('Đang hoạt động', 'Tắt')}
              </button>
            </div>
          </div>

        {/* Instructions */}
        <div className="mb-4 p-3 md:p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <div className="flex items-start gap-2 md:gap-3">
            <div>
              <h3 className="font-semibold text-blue-900 mb-1 text-sm md:text-base">{tAir('instructions.title')}</h3>
              <ul className="text-xs md:text-sm text-blue-800 space-y-1">
                <li>• {tAir('instructions.clickStation')}</li>
                <li>• {tAir('instructions.colorMeaning')}</li>
                <li>• {tAir('instructions.aqiDisplay')}</li>
                <li>• {tAir('instructions.toggleButton')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* AQI Scale Legend */}
        <div className="mb-4 p-3 md:p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">{tAir('aqiScale.title')}:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#00e400' }}></div>
              <div>
                <div className="font-semibold text-black">0-50</div>
                <div className="text-gray-600">{tAir('aqiScale.good')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#f5a623' }}></div>
              <div>
                <div className="font-semibold text-black">51-100</div>
                <div className="text-gray-600">{tAir('aqiScale.moderate')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ff7e00' }}></div>
              <div>
                <div className="font-semibold text-black">101-150</div>
                <div className="text-gray-600">{tAir('aqiScale.unhealthySensitive')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#ff0000' }}></div>
              <div>
                <div className="font-semibold text-black">151-200</div>
                <div className="text-gray-600">{tAir('aqiScale.unhealthy')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#8f3f97' }}></div>
              <div>
                <div className="font-semibold text-black">201-300</div>
                <div className="text-gray-600">{tAir('aqiScale.veryUnhealthy')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#7e0023' }}></div>
              <div>
                <div className="font-semibold text-black">300+</div>
                <div className="text-gray-600">{tAir('aqiScale.hazardous')}</div>
              </div>
            </div>
          </div>
        </div>

          <AirQualityMapDynamic
            stations={formattedStations}
            showStations={showStations}
            onStationLayerToggle={setShowStations}
          />
          
          {/* Export Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowExportDialog(true)}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2 text-sm"
            >
              {tExport('button')}
            </button>
          </div>
        </div>
      )}

      {/* Station Selector - View individual station details */}
      {stations.length > 0 && <StationSelector stations={stationOptions} />}

      {/* Stations List */}
      {stations.length > 0 && <AirQualityStationsList stations={formattedStations} />}

      {/* Pollutants Overview */}
      {pollutants.length > 0 && <PollutantsOverview pollutants={pollutants} />}

      {/* Statistics - Show only if we have historical data */}
      {/* <AirQualityStatistics statsByTime={airQualityStatsByTime} /> */}

      {/* Health Recommendations */}
      {overview.averageAqi > 0 && <HealthRecommendations aqi={overview.averageAqi} />}

      {/* Additional Info */}
      <div className="mt-6 md:mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-4 md:p-6 border-l-4 border-blue-500">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2">
          {tAir('additionalInfo.title')}
        </h2>
        <div className="space-y-2 md:space-y-3 text-xs md:text-sm text-gray-700">
          <p>
            {tAir('additionalInfo.definition')}
          </p>
          <p>
            {tAir('additionalInfo.calculation')}
          </p>
          <p>
            {tAir('additionalInfo.dataSource')}
          </p>
          <div className="pt-3 border-t border-blue-200">
            <p className="font-semibold text-blue-900">{tAir('additionalInfo.references')}:</p>
            <ul className="mt-2 space-y-1 text-gray-600">
              <li>• {tAir('additionalInfo.who')}</li>
              <li>• {tAir('additionalInfo.epa')}</li>
              <li>• {tAir('additionalInfo.vietnam')}</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDataDialog
          onClose={() => setShowExportDialog(false)}
          defaultEntityType="AirQualityObserved"
        />
      )}
    </div>
  );
}
