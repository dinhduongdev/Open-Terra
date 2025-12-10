/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import CitySelector from './CitySelector';
import LanguageSwitcher from './LanguageSwitcher';
import UserMenu from './UserMenu';
import NotificationIcon from '../icon/NotificationIcon';
import SearchIcon from '../icon/SearchIcon';
import toast from 'react-hot-toast';

const AdminHeader: React.FC = () => {
  const router = useRouter();
  const t = useTranslations('adminHeader');

  const handleCityChange = () => {
    console.log('Change city clicked');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
  
    document.cookie = 'access_token=; path=/; max-age=0';
    document.cookie = 'token_type=; path=/; max-age=0';
    
    toast.success(t('logoutSuccess'));
    router.push('/login');
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl text-gray-800">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <NotificationIcon />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* City Selector */}
          <CitySelector city="TP Hồ Chí Minh" onCityChange={handleCityChange} />

          {/* User Menu */}
          <UserMenu
            userName={t('user.name')}
            userRole={t('user.role')}
            userEmail={t('user.email')}
            userInitials="AD"
            onLogout={handleLogout}
            onProfileClick={handleProfileClick}
            onSettingsClick={handleSettingsClick}
          />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
