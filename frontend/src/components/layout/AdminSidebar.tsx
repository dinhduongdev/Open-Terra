"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DashboardIcon from '../icon/DashboardIcon';
import TrafficIcon from '../icon/TrafficIcon';
import EnvironmentIcon from '../icon/EnvironmentIcon';
import AlertIcon from '../icon/AlertIcon';
import AnalyticsIcon from '../icon/AnalyticsIcon';
import InfrastructureIcon from '../icon/InfrastructureIcon';
import PublicServiceIcon from '../icon/PublicServiceIcon';


const menuItems = [
  {
    title: 'Dashboard',
    icon: DashboardIcon,
    href: '/dashboard',
  },
  {
    title: 'Giao thông',
    icon: TrafficIcon,
    href: '/traffic',
  },
  {
    title: 'Môi trường',
    icon: EnvironmentIcon,
    href: '/environment',
  },
  {
    title: 'Cảnh báo',
    icon: AlertIcon,
    href: '/alerts',
  },
  {
    title: 'Phân tích',
    icon: AnalyticsIcon,
    href: '/analytics',
  },
  {
    title: 'Cơ sở hạ tầng',
    icon: InfrastructureIcon,
    href: '/infrastructure',
  },
  {
    title: 'Dịch vụ công',
    icon: PublicServiceIcon,
    href: '/services',
  },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
            <h1 className="text-2xl font-bold">Smart City</h1>
            <p className="text-xs text-emerald-200 mt-1">Admin Panel</p>
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
            <Link
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
                <span className="ml-3 font-medium">{item.title}</span>
              )}
            </Link>
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
              <p className="text-sm font-medium truncate">Admin</p>
              <p className="text-xs text-emerald-200 truncate">admin@smartcity.vn</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
