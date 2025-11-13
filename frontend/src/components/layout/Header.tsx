"use client";
import React from 'react';
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
        </div>
      </div>
    </header>
  );
};

export default Header;