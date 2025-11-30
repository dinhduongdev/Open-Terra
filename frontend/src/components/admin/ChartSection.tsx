"use client";
import React from 'react';

interface ChartSectionProps {
  title: string;
  description: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default ChartSection;
