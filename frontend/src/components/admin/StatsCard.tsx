"use client";
import React from 'react';
import DashboardIcon from '@/components/icon/DashboardIcon';
import TrafficIcon from '@/components/icon/TrafficIcon';
import EnvironmentIcon from '@/components/icon/EnvironmentIcon';
import AlertIcon from '@/components/icon/AlertIcon';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  iconName: string;
  color: string;
  index: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, iconName, color, index }) => {
  const getIcon = () => {
    switch (iconName) {
      case 'dashboard':
        return <DashboardIcon className="w-8 h-8 text-white" />;
      case 'traffic':
        return <TrafficIcon className="w-8 h-8 text-white" />;
      case 'environment':
        return <EnvironmentIcon className="w-8 h-8 text-white" />;
      case 'alert':
        return <AlertIcon className="w-8 h-8 text-white" />;
      default:
        return <DashboardIcon className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          <p className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change} so với tháng trước
          </p>
        </div>
        <div className={`${color} p-4 rounded-lg`}>
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
