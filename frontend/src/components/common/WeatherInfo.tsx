/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

export default function WeatherInfo() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-blue-500">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
        Thông tin về dữ liệu thời tiết
      </h2>
      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
        <p>
          <strong>Dữ liệu thời tiết</strong> được thu thập từ các trạm quan trắc khí tượng thủy
          văn tự động phân bố trên khắp thành phố, cung cấp thông tin chính xác và cập nhật theo
          thời gian thực.
        </p>
        <p>
          Các thông số đo lường bao gồm: nhiệt độ, độ ẩm không khí, áp suất khí quyển, tốc độ và
          hướng gió, lượng mưa, độ che phủ mây, chỉ số UV và tầm nhìn xa.
        </p>
        <p>
          <strong>Dự báo thời tiết</strong> được tính toán dựa trên các mô hình khí tượng hiện
          đại, kết hợp dữ liệu từ vệ tinh, radar thời tiết và mạng lưới quan trắc mặt đất.
        </p>
        <div className="pt-3 border-t border-blue-200">
          <p className="font-semibold text-blue-900 mb-2">Liên hệ và thông tin:</p>
          <ul className="space-y-1 text-gray-600">
            <li>• Trung tâm Khí tượng Thủy văn Quốc gia</li>
            <li>• Tổng cục Khí tượng Thủy văn Việt Nam</li>
            <li>• Hotline cảnh báo khẩn cấp: 1900-xxxx</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
