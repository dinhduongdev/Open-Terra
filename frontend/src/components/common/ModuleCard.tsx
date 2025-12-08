/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import Link from 'next/link';
import React from 'react';

interface ModuleCardProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  colorScheme: {
    border: string;
    bg: string;
    bgHover: string;
    text: string;
    iconText: string;
    iconTextHover: string;
  };
}

export default function ModuleCard({ href, icon: Icon, title, description, colorScheme }: ModuleCardProps) {
  return (
    <Link 
      href={href} 
      className={`group border-2 border-gray-200 rounded-xl p-6 hover:border-${colorScheme.border} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 ${colorScheme.bg} rounded-lg group-hover:${colorScheme.bgHover} transition-all duration-300 transform group-hover:rotate-3 group-hover:scale-110`}>
          <Icon className={`w-6 h-6 ${colorScheme.iconText} group-hover:${colorScheme.iconTextHover} transition-colors`} />
        </div>
        <div>
          <h3 className={`text-lg font-semibold mb-2 text-gray-800 group-hover:${colorScheme.text}`}>
            {title}
          </h3>
          <p className="text-gray-600 text-sm">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
