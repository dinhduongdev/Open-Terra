'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useTranslations } from 'next-intl';
import ProgressLink from '@/components/common/ProgressLink';
import DashboardIcon from '@/components/icon/DashboardIcon';
import TrafficIcon from '@/components/icon/TrafficIcon';
import FloodIcon from '@/components/icon/FloodIcon';
import TrafficJamIcon from '@/components/icon/TrafficJamIcon';
import AirQualityIcon from '@/components/icon/AirQualityIcon';
import EnvironmentIcon from '@/components/icon/EnvironmentIcon';
import PublicServiceIcon from '@/components/icon/PublicServiceIcon';
import InfrastructureIcon from '@/components/icon/InfrastructureIcon';
import WeatherIcon from '@/components/icon/WeatherIcon';
import ParkingIcon from '@/components/icon/ParkingIcon';
import AnalyticsIcon from '@/components/icon/AnalyticsIcon';
import AlertIcon from '@/components/icon/AlertIcon';

interface MenuItem {
  id: string;
  labelKey: string;
  href: string;
  icon: React.ReactNode;
}

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('sidebar');

  const menuItems: MenuItem[] = [
    {
      id: 'introduction',
      labelKey: 'introduction',
      href: '/',
      icon: <DashboardIcon />,
    },
    {
      id: 'traffic',
      labelKey: 'traffic',
      href: '/traffic',
      icon: <TrafficIcon />,
    },
    {
      id: 'flood-map',
      labelKey: 'floodMap',
      href: '/flood-map',
      icon: <FloodIcon />,
    },
    // {
    //   id: 'traffic-jam',
    //   labelKey: 'trafficJam',
    //   href: '/traffic-jam',
    //   icon: <TrafficJamIcon />,
    // },
    {
      id: 'air-quality',
      labelKey: 'airQuality',
      href: '/air-quality',
      icon: <AirQualityIcon />,
    },
    {
      id: 'environment',
      labelKey: 'environment',
      href: '/environment',
      icon: <EnvironmentIcon />,
    },
    {
      id: 'public-services',
      labelKey: 'publicServices',
      href: '/public-services',
      icon: <PublicServiceIcon />,
    },
    {
      id: 'infrastructure',
      labelKey: 'infrastructure',
      href: '/infrastructure',
      icon: <InfrastructureIcon />,
    },
    {
      id: 'weather',
      labelKey: 'weather',
      href: '/weather',
      icon: <WeatherIcon />,
    },
    {
      id: 'parking',
      labelKey: 'parking',
      href: '/parking',
      icon: <ParkingIcon />,
    },
    {
      id: 'analytics',
      labelKey: 'analytics',
      href: '/analytics',
      icon: <AnalyticsIcon />,
    },
    {
      id: 'alerts',
      labelKey: 'alerts',
      href: '/alerts',
      icon: <AlertIcon />,
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id}>
                <ProgressLink
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{t(item.labelKey)}</span>
                </ProgressLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
