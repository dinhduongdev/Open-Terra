'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

// Dynamically import Map component with no SSR to avoid window/document issues
const Map = dynamic(() => import('@/components/common/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full bg-gray-100 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

export default function TrafficPage() {
  const t = useTranslations('sidebar');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {t('traffic')}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Traffic Map - OpenStreetMap
        </h2>
        <Map />
      </div>

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Traffic Information
        </h3>
        <p className="text-gray-600">
          Real-time traffic data will be displayed here.
        </p>
      </div>
    </div>
  );
}
