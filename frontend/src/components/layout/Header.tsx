/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import CitySelector from './CitySelector';
import LanguageSwitcher from './LanguageSwitcher';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCityChange = () => {
    console.log('Change city clicked');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-emerald-500 text-white shadow-md relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <CitySelector city="TP Hồ Chí Minh" onCityChange={handleCityChange} />
            {/* <Link 
              href="/login" 
              className="bg-white text-emerald-500 px-4 py-2 rounded-md font-medium hover:bg-emerald-50 transition-colors"
            >
              Đăng nhập
            </Link> */}
          </div>

          {/* Mobile Buttons */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Sidebar Toggle */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            
            {/* Mobile Settings Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Toggle settings"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-emerald-500 shadow-lg transition-all duration-300 ease-in-out transform origin-top z-50 ${
          isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-4 border-t border-emerald-400">
          <div className="flex flex-col gap-3">
            <LanguageSwitcher />
            <CitySelector city="TP Hồ Chí Minh" onCityChange={handleCityChange} />
            {/* <Link 
              href="/login" 
              className="bg-white text-emerald-500 px-4 py-2 rounded-md font-medium hover:bg-emerald-50 transition-colors text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Đăng nhập
            </Link> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;