/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';

export default function AdminEnvironmentPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Môi trường</h1>
        <p className="text-gray-600">Giám sát chất lượng không khí và môi trường</p>
      </div>

      {/* Air Quality Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Chỉ số AQI trung bình</p>
              <p className="text-3xl font-bold text-gray-800">68</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">Tốt - An toàn</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">PM2.5 (μg/m³)</p>
              <p className="text-3xl font-bold text-gray-800">25.4</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">↓ 8% so với hôm qua</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Trạm giám sát</p>
              <p className="text-3xl font-bold text-gray-800">42</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">Tất cả hoạt động</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Cảnh báo môi trường</p>
              <p className="text-3xl font-bold text-gray-800">5</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-orange-600 mt-2">Cần theo dõi</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Xu hướng AQI 7 ngày</h2>
          <div className="h-64 relative">
            {(() => {
              const aqiData = [
                { day: 'T2', aqi: 65, status: 'good' },
                { day: 'T3', aqi: 72, status: 'moderate' },
                { day: 'T4', aqi: 58, status: 'good' },
                { day: 'T5', aqi: 68, status: 'good' },
                { day: 'T6', aqi: 85, status: 'moderate' },
                { day: 'T7', aqi: 78, status: 'moderate' },
                { day: 'CN', aqi: 62, status: 'good' },
              ];
              const maxAqi = 100;
              
              return (
                <>
                  <div className="absolute inset-0 flex items-end justify-between gap-2 px-4 pb-8">
                    {aqiData.map((data, index) => {
                      const height = (data.aqi / maxAqi) * 85;
                      const color = data.status === 'good' ? 'bg-green-500' : 'bg-yellow-500';
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 relative">
                          <div className="w-full relative" style={{ height: '200px' }}>
                            <div 
                              className={`w-full ${color} rounded-t absolute bottom-0 transition-all duration-500 hover:opacity-80`}
                              style={{ height: `${height}%` }}
                            >
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded shadow whitespace-nowrap">
                                AQI {data.aqi}
                              </span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-600 font-semibold">{data.day}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 text-xs text-gray-500">
                    <span>100</span>
                    <span>75</span>
                    <span>50</span>
                    <span>25</span>
                    <span>0</span>
                  </div>
                </>
              );
            })()}
          </div>
          <div className="mt-4 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600 font-medium">Tốt (0-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-600 font-medium">TB (51-100)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Phân bố chất lượng không khí</h2>
          <div className="h-64 flex items-center justify-center">
            {(() => {
              const distributionData = [
                { label: 'Tốt', percentage: 65, color: 'bg-green-500', textColor: 'text-green-600' },
                { label: 'Trung bình', percentage: 28, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
                { label: 'Kém', percentage: 7, color: 'bg-orange-500', textColor: 'text-orange-600' },
              ];
              
              return (
                <div className="w-full space-y-6">
                  {/* Circular representation */}
                  <div className="flex justify-center">
                    <div className="relative w-48 h-48">
                      {distributionData.map((item, index) => {
                        const total = distributionData.reduce((sum, d) => sum + d.percentage, 0);
                        const startAngle = distributionData.slice(0, index).reduce((sum, d) => sum + (d.percentage / total) * 360, 0);
                        const angle = (item.percentage / total) * 360;
                        
                        return (
                          <div
                            key={index}
                            className={`absolute inset-0 rounded-full ${item.color} transition-all duration-500`}
                            style={{
                              clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((startAngle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle - 90) * Math.PI / 180)}%, ${50 + 50 * Math.cos((startAngle + angle - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((startAngle + angle - 90) * Math.PI / 180)}%)`,
                            }}
                          />
                        );
                      })}
                      <div className="absolute inset-6 bg-white rounded-full flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-800">42</p>
                          <p className="text-xs text-gray-500">Trạm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="space-y-2">
                    {distributionData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${item.color} rounded`}></div>
                          <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                        </div>
                        <span className={`text-sm font-bold ${item.textColor}`}>{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Pollutants Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Nồng độ các chất ô nhiễm</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chất ô nhiễm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nồng độ hiện tại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới hạn an toàn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Xu hướng</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PM2.5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">25.4 μg/m³</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">35 μg/m³</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Tốt
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">↓ 8%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">PM10</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">48.2 μg/m³</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50 μg/m³</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Trung bình
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">↑ 3%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">O3</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">82.1 μg/m³</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100 μg/m³</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Tốt
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">→ 0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
