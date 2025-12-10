/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

"use client";
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import ProgressLink from '../common/ProgressLink';
import DashboardIcon from '../icon/DashboardIcon';
import TrafficIcon from '../icon/TrafficIcon';
import AlertIcon from '../icon/AlertIcon';
import FloodIcon from '../icon/FloodIcon';
import AirQualityIcon from '../icon/AirQualityIcon';
import WeatherIcon from '../icon/WeatherIcon';
import FeedbackIcon from '../icon/FeedbackIcon';


const menuItems = [
  {
    titleKey: 'dashboard',
    icon: DashboardIcon,
    href: '/admin/dashboard',
  },
  {
    titleKey: 'traffic',
    icon: TrafficIcon,
    href: '/admin/traffic',
  },
  {
    titleKey: 'flood',
    icon: FloodIcon,
    href: '/admin/flood',
  },
  {
    titleKey: 'airQuality',
    icon: AirQualityIcon,
    href: '/admin/air-quality',
  },
  {
    titleKey: 'weather',
    icon: WeatherIcon,
    href: '/admin/weather',
  },
  {
    titleKey: 'feedback',
    icon: FeedbackIcon,
    href: '/admin/feedback',
  },
  // {
  //   titleKey: 'alerts',
  //   icon: AlertIcon,
  //   href: '/admin/alerts',
  // },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const t = useTranslations('adminSidebar');

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-gradient-to-b from-emerald-600 to-emerald-700 text-white transition-all duration-300 flex flex-col shadow-xl`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-between border-b border-emerald-500">
        {!isCollapsed && (
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-xs text-emerald-200 mt-1">{t('subtitle')}</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-emerald-500 rounded-lg transition-colors"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname?.includes(item.href);
          return (
            <ProgressLink
              key={item.href}
              href={item.href}
              className={`flex items-center ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-white text-emerald-600 shadow-md'
                  : 'hover:bg-emerald-500 text-white'
              }`}
            >
              <item.icon
                className={`w-6 h-6 ${isActive ? 'text-emerald-600' : 'text-white'}`}
              />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{t(`menu.${item.titleKey}`)}</span>
              )}
            </ProgressLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-emerald-500">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-10 h-10 bg-emerald-400 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">AD</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t('user.role')}</p>
              <p className="text-xs text-emerald-200 truncate">{t('user.email')}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
