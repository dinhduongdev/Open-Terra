/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';
import LogoIcon from '../icon/LogoIcon';


const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className=" rounded-lg p-2 flex items-center justify-center w-16 h-16">
        <LogoIcon />
      </div>
      <h1 className="text-2xl font-bold">OPEN TERRA</h1>
    </div>
  );
};

export default Logo;