/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';

export default function AdminServicesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Dịch vụ Công</h1>
        <p className="text-gray-600">Theo dõi và quản lý các dịch vụ công cộng</p>
      </div>

      {/* Services Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Tổng dịch vụ</p>
              <p className="text-3xl font-bold text-gray-800">28</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2">Đang hoạt động</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Yêu cầu hôm nay</p>
              <p className="text-3xl font-bold text-gray-800">1,542</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">↑ 18% so với hôm qua</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Đang xử lý</p>
              <p className="text-3xl font-bold text-gray-800">342</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">Thời gian xử lý TB: 2.5h</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Hoàn thành</p>
              <p className="text-3xl font-bold text-gray-800">1,200</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">Tỷ lệ hoàn thành: 77.8%</p>
        </div>
      </div>

      {/* Service Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh mục dịch vụ</h2>
          <div className="space-y-3">
            {[
              { name: 'Giao thông công cộng', count: 456, color: 'emerald', icon: '🚌' },
              { name: 'Thu gom rác', count: 289, color: 'blue', icon: '♻️' },
              { name: 'Chiếu sáng công cộng', count: 178, color: 'yellow', icon: '💡' },
              { name: 'Công viên & cây xanh', count: 234, color: 'green', icon: '🌳' },
              { name: 'Bảo trì đường bộ', count: 385, color: 'orange', icon: '🛣️' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.count} yêu cầu/tháng</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Yêu cầu gần đây</h2>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Đèn đường hỏng</h3>
                    <p className="text-sm text-gray-600 mt-1">Đường Lê Lợi, Quận 1 - Cần xử lý khẩn cấp</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">ID: #SR-2024-1542</span>
                      <span className="text-xs text-gray-500">10 phút trước</span>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                  Khẩn cấp
                </span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Thu gom rác không đúng giờ</h3>
                    <p className="text-sm text-gray-600 mt-1">Khu vực phường 5, Quận 3</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">ID: #SR-2024-1541</span>
                      <span className="text-xs text-gray-500">1 giờ trước</span>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                  Đang xử lý
                </span>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Cây xanh cần tỉa cành</h3>
                    <p className="text-sm text-gray-600 mt-1">Công viên 30/4, Quận 1</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">ID: #SR-2024-1540</span>
                      <span className="text-xs text-gray-500">2 giờ trước</span>
                    </div>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Hoàn thành
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Performance */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Hiệu suất xử lý theo dịch vụ</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yêu cầu/Tháng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đang xử lý</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hoàn thành</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">TG xử lý TB</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🚌</span>
                    <span className="text-sm font-medium text-gray-900">Giao thông công cộng</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">456</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">42</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">414</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2.1h</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★☆</span>
                    <span className="ml-2 text-sm text-gray-600">4.2/5</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">♻️</span>
                    <span className="text-sm font-medium text-gray-900">Thu gom rác</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">289</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">28</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">261</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.5h</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="ml-2 text-sm text-gray-600">4.8/5</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">💡</span>
                    <span className="text-sm font-medium text-gray-900">Chiếu sáng công cộng</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">178</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">163</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3.2h</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★☆</span>
                    <span className="ml-2 text-sm text-gray-600">4.1/5</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
