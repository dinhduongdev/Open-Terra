"use client";
import React from 'react';

interface ChartSectionProps {
  title: string;
  description: string;
}

// Mock data for traffic chart
const trafficData = [
  { time: '00:00', vehicles: 120 },
  { time: '04:00', vehicles: 80 },
  { time: '08:00', vehicles: 450 },
  { time: '12:00', vehicles: 380 },
  { time: '16:00', vehicles: 520 },
  { time: '20:00', vehicles: 340 },
  { time: '23:59', vehicles: 180 },
];

// Mock data for environment chart
const environmentData = [
  { parameter: 'PM2.5', value: 35, max: 50, color: 'bg-green-500' },
  { parameter: 'PM10', value: 45, max: 100, color: 'bg-yellow-500' },
  { parameter: 'CO2', value: 380, max: 500, color: 'bg-green-500' },
  { parameter: 'NO2', value: 28, max: 40, color: 'bg-orange-500' },
];

const ChartSection: React.FC<ChartSectionProps> = ({ title, description }) => {
  const isTrafficChart = title.includes('giao thông');
  
  if (isTrafficChart) {
    const maxVehicles = Math.max(...trafficData.map(d => d.vehicles));
    
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="h-64 flex items-end justify-between gap-2 px-4">
          {trafficData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '200px' }}>
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t absolute bottom-0 transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                  style={{ height: `${(data.vehicles / maxVehicles) * 100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700">
                    {data.vehicles}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-600 font-medium">{data.time}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Phương tiện/giờ</span>
        </div>
      </div>
    );
  }
  
  // Environment chart
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="h-64 flex flex-col justify-center gap-4 px-4">
        {environmentData.map((data, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">{data.parameter}</span>
              <span className="text-sm text-gray-600">
                {data.value} / {data.max} {data.parameter === 'CO2' ? 'ppm' : 'μg/m³'}
              </span>
            </div>
            <div className="relative w-full bg-gray-100 rounded-full h-3">
              <div 
                className={`${data.color} h-3 rounded-full transition-all duration-700`}
                style={{ width: `${(data.value / data.max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Tốt</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Trung bình</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span>Cảnh báo</span>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
