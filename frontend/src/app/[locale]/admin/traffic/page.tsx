/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';

export default function AdminTrafficPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Giao thông</h1>
        <p className="text-gray-600">Theo dõi và quản lý hệ thống giao thông thông minh</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Tổng số cảm biến</p>
              <p className="text-3xl font-bold text-gray-800">248</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2">↑ 12% so với tháng trước</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Tuyến đường đang giám sát</p>
              <p className="text-3xl font-bold text-gray-800">156</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Hoạt động bình thường</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Cảnh báo hiện tại</p>
              <p className="text-3xl font-bold text-gray-800">23</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-yellow-600 mt-2">Cần xử lý</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Sự cố nghiêm trọng</p>
              <p className="text-3xl font-bold text-gray-800">3</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">Khẩn cấp</p>
        </div>
      </div>

      {/* Traffic Flow Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lưu lượng giao thông theo thời gian</h2>
          <div className="h-64">
            {(() => {
              const trafficData = [
                { time: '06:00', vehicles: 280, status: 'smooth' },
                { time: '08:00', vehicles: 520, status: 'heavy' },
                { time: '10:00', vehicles: 380, status: 'moderate' },
                { time: '12:00', vehicles: 450, status: 'heavy' },
                { time: '14:00', vehicles: 340, status: 'moderate' },
                { time: '16:00', vehicles: 480, status: 'heavy' },
                { time: '18:00', vehicles: 580, status: 'congested' },
                { time: '20:00', vehicles: 320, status: 'moderate' },
              ];
              const maxVehicles = Math.max(...trafficData.map(d => d.vehicles));
              
              return (
                <div className="h-full flex items-end justify-between gap-3 px-2">
                  {trafficData.map((data, index) => {
                    const height = (data.vehicles / maxVehicles) * 85;
                    let barColor = 'bg-emerald-500';
                    if (data.status === 'heavy') barColor = 'bg-yellow-500';
                    if (data.status === 'congested') barColor = 'bg-red-500';
                    
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full relative" style={{ height: '220px' }}>
                          <div 
                            className={`w-full ${barColor} rounded-t absolute bottom-0 transition-all duration-500 hover:opacity-80`}
                            style={{ height: `${height}%` }}
                          >
                            <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded shadow">
                              {data.vehicles}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 font-semibold">{data.time}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded"></div>
              <span className="text-gray-600 font-medium">Thông thoáng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-600 font-medium">Đông đúc</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-600 font-medium">Kẹt xe</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Tình trạng cảm biến</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Hoạt động tốt</span>
                <span className="text-sm font-semibold text-emerald-600">89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{width: '89%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Cần bảo trì</span>
                <span className="text-sm font-semibold text-yellow-600">8%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{width: '8%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Lỗi</span>
                <span className="text-sm font-semibold text-red-600">3%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '3%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Incidents Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Sự cố gần đây</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại sự cố</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mức độ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">14:32</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nguyễn Huệ - Lê Lợi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Tai nạn giao thông</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Cao
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Đang xử lý
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">13:15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Hùng Vương - Trần Phú</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kẹt xe</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Trung bình
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    Đã giải quyết
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
