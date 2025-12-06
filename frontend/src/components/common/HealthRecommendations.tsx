/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

import { getHealthRecommendation } from '@/constants/airQualityMockData';

interface HealthRecommendationsProps {
  aqi: number;
}

export default function HealthRecommendations({ aqi }: HealthRecommendationsProps) {
  const recommendations = getHealthRecommendation(aqi);

  const getAlertColor = () => {
    if (aqi <= 50) return 'from-green-50 to-green-100 border-green-500';
    if (aqi <= 100) return 'from-yellow-50 to-yellow-100 border-yellow-500';
    if (aqi <= 150) return 'from-orange-50 to-orange-100 border-orange-500';
    if (aqi <= 200) return 'from-red-50 to-red-100 border-red-500';
    if (aqi <= 300) return 'from-purple-50 to-purple-100 border-purple-500';
    return 'from-red-100 to-red-200 border-red-700';
  };

  return (
    <div className="mt-6 md:mt-8">
      <div className={`bg-gradient-to-r ${getAlertColor()} rounded-lg shadow-md p-4 md:p-6 border-l-4`}>
        <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
          <span>🏥</span>
          Khuyến nghị sức khỏe
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* General Population */}
          <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              <span className="text-xl md:text-2xl">👥</span>
              Người dân nói chung
            </h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{recommendations.general}</p>
          </div>

          {/* Sensitive Groups */}
          <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              <span className="text-xl md:text-2xl">⚕️</span>
              Nhóm nhạy cảm
            </h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{recommendations.sensitive}</p>
            <p className="text-[10px] md:text-xs text-gray-500 mt-2">
              (Người bệnh tim phổi, hen suyễn, phụ nữ mang thai)
            </p>
          </div>

          {/* Children */}
          <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              <span className="text-xl md:text-2xl">👶</span>
              Trẻ em
            </h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{recommendations.children}</p>
          </div>

          {/* Elderly */}
          <div className="bg-white rounded-lg p-4 md:p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              <span className="text-xl md:text-2xl">👴</span>
              Người cao tuổi
            </h3>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed">{recommendations.elderly}</p>
          </div>
        </div>

        {/* General Tips */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-white rounded-lg p-3 md:p-4">
            <h3 className="font-semibold text-green-700 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              <span>✅</span> Biện pháp phòng ngừa
            </h3>
            <ul className="text-xs md:text-sm text-gray-700 space-y-1.5 md:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Đeo khẩu trang chống bụi mịn khi ra ngoài (N95, N99)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Sử dụng máy lọc không khí trong nhà</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Đóng cửa sổ khi chất lượng không khí xấu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Tăng cường rửa tay, mắt, mũi thường xuyên</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">•</span>
                <span>Uống nhiều nước, ăn nhiều rau xanh, trái cây</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg p-3 md:p-4">
            <h3 className="font-semibold text-red-700 mb-2 md:mb-3 flex items-center gap-2 text-sm md:text-base">
              <span>⚠️</span> Cần tránh
            </h3>
            <ul className="text-xs md:text-sm text-gray-700 space-y-1.5 md:space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Tập thể dục ngoài trời khi chất lượng không khí xấu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Để trẻ em và người cao tuổi tiếp xúc lâu với không khí ô nhiễm</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Đi xe máy không đeo khẩu trang bảo vệ</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Đốt rác, đốt lửa góp phần làm ô nhiễm không khí</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Hút thuốc lá và tiếp xúc với khói thuốc</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Contact */}
        {aqi > 200 && (
          <div className="mt-4 p-3 md:p-4 bg-red-100 border-l-4 border-red-600 rounded">
            <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2 text-sm md:text-base">
              <span>🚨</span> Cảnh báo khẩn cấp
            </h3>
            <p className="text-xs md:text-sm text-red-800 mb-2">
              Chất lượng không khí ở mức nguy hại. Nếu có triệu chứng khó thở, đau ngực, hoặc bất
              thường, hãy liên hệ ngay:
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm font-semibold text-red-800">
              <span>📞 Cấp cứu 115</span>
              <span>📞 Y tế 114</span>
              <span>📞 Môi trường 1800-6169</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
