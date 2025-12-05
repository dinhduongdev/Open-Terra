/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import React from 'react';

export default function AdminInfrastructurePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý Cơ sở Hạ tầng</h1>
        <p className="text-gray-600">Theo dõi và bảo trì hạ tầng thông minh</p>
      </div>

      {/* Infrastructure Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Tổng thiết bị</p>
              <p className="text-3xl font-bold text-gray-800">1,248</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-2">Đang hoạt động</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Tình trạng tốt</p>
              <p className="text-3xl font-bold text-gray-800">1,089</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">87.3% tổng số</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Cần bảo trì</p>
              <p className="text-3xl font-bold text-gray-800">142</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-yellow-600 mt-2">11.4% tổng số</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Hỏng hóc</p>
              <p className="text-3xl font-bold text-gray-800">17</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">Cần thay thế khẩn cấp</p>
        </div>
      </div>

      {/* Infrastructure Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Phân loại thiết bị</h2>
          <div className="space-y-3">
            {[
              { name: 'Cảm biến giao thông', count: 428, icon: '🚗' },
              { name: 'Camera giám sát', count: 312, icon: '📹' },
              { name: 'Đèn đường thông minh', count: 245, icon: '💡' },
              { name: 'Trạm đo môi trường', count: 98, icon: '🌡️' },
              { name: 'Hệ thống tưới tiêu', count: 165, icon: '💧' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-full">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lịch bảo trì định kỳ</h2>
          <div className="space-y-3">
            <div className="border-l-4 border-emerald-500 pl-4 py-3 bg-emerald-50 rounded-r">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">Bảo trì hệ thống đèn đường</h3>
                  <p className="text-sm text-gray-600 mt-1">Khu vực: Quận 1 - Đường Nguyễn Huệ</p>
                  <p className="text-sm text-emerald-600 mt-1">Ngày 5/12/2025 - 08:00 AM</p>
                </div>
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                  Sắp tới
                </span>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">Kiểm tra camera giám sát</h3>
                  <p className="text-sm text-gray-600 mt-1">Khu vực: Quận 3 - Khu trung tâm</p>
                  <p className="text-sm text-blue-600 mt-1">Ngày 7/12/2025 - 02:00 PM</p>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  Đã lên lịch
                </span>
              </div>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">Hiệu chuẩn cảm biến môi trường</h3>
                  <p className="text-sm text-gray-600 mt-1">Khu vực: Toàn thành phố</p>
                  <p className="text-sm text-yellow-600 mt-1">Ngày 10/12/2025 - 06:00 AM</p>
                </div>
                <span className="px-3 py-1 bg-yellow-600 text-white text-xs font-semibold rounded-full">
                  Chờ xác nhận
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Device Status Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Danh sách thiết bị</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Tìm kiếm thiết bị..." 
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
              Thêm thiết bị
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên thiết bị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bảo trì lần cuối</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#TF-001</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Cảm biến giao thông A1</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Cảm biến</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Nguyễn Huệ, Q1</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Hoạt động
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15/11/2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-emerald-600 hover:text-emerald-900 font-medium">Chi tiết</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#CM-042</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Camera giám sát B12</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Camera</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Lê Lợi, Q1</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Cần bảo trì
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20/10/2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-emerald-600 hover:text-emerald-900 font-medium">Chi tiết</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#LT-128</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Đèn thông minh C5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Đèn đường</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Hùng Vương, Q5</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Lỗi
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">01/12/2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-emerald-600 hover:text-emerald-900 font-medium">Chi tiết</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
