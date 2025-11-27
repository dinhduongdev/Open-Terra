"use client";
import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import CitySelector from './CitySelector';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const handleCityChange = () => {
    console.log('Change city clicked');
  };

  return (
    <header className="bg-emerald-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <CitySelector city="TP Hồ Chí Minh" onCityChange={handleCityChange} />
          <Link 
            href="/login" 
            className="bg-white text-emerald-500 px-4 py-2 rounded-md font-medium hover:bg-emerald-50 transition-colors"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;