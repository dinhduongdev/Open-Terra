/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

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

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isMobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('sidebar');

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  const menuItems: MenuItem[] = [
    {
      id: 'introduction',
      labelKey: 'introduction',
      href: '/',
      icon: <DashboardIcon />,
    },
    {
      id: 'overview',
      labelKey: 'overview',
      href: '/overview',
      icon: <AnalyticsIcon />,
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
    // {
    //   id: 'environment',
    //   labelKey: 'environment',
    //   href: '/environment',
    //   icon: <EnvironmentIcon />,
    // },
    // {
    //   id: 'public-services',
    //   labelKey: 'publicServices',
    //   href: '/public-services',
    //   icon: <PublicServiceIcon />,
    // },
    // {
    //   id: 'infrastructure',
    //   labelKey: 'infrastructure',
    //   href: '/infrastructure',
    //   icon: <InfrastructureIcon />,
    // },
    {
      id: 'weather',
      labelKey: 'weather',
      href: '/weather',
      icon: <WeatherIcon />,
    },
    // {
    //   id: 'parking',
    //   labelKey: 'parking',
    //   href: '/parking',
    //   icon: <ParkingIcon />,
    // },
    // {
    //   id: 'analytics',
    //   labelKey: 'analytics',
    //   href: '/analytics',
    //   icon: <AnalyticsIcon />,
    // },
    // {
    //   id: 'alerts',
    //   labelKey: 'alerts',
    //   href: '/alerts',
    //   icon: <AlertIcon />,
    // },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white shadow-lg h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <ProgressLink
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
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

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[9998]"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.id}>
                  <ProgressLink
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
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
    </>
  );
}
