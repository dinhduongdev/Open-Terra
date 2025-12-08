/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';
import GlobeIcon from '../icon/GlobeIcon';

interface CitySelectorProps {
  city: string;
  onCityChange?: () => void;
}

const CitySelector: React.FC<CitySelectorProps> = ({ city, onCityChange }) => {
  return (
    <div 
      className="flex items-center gap-2 bg-white text-emerald-500 px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-emerald-50 transition"
      onClick={onCityChange}
    >
      <GlobeIcon />
      <span>{city}</span>
    </div>
  );
};

export default CitySelector;