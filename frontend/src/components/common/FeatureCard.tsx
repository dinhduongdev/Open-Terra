/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  delay: string;
}

export default function FeatureCard({ icon, title, description, colorClass, delay }: FeatureCardProps) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up ${delay}`}>
      <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}
