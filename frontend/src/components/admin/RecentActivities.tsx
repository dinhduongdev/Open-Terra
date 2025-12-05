/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

"use client";
import React from 'react';

const RecentActivities: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Hoạt động gần đây</h2>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-semibold">{item}</span>
              </div>
              <div>
                <p className="text-gray-800 font-medium">Cập nhật thiết bị #{item}</p>
                <p className="text-sm text-gray-500">5 phút trước</p>
              </div>
            </div>
            <span className="text-sm text-emerald-600 font-medium">Hoàn thành</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;
