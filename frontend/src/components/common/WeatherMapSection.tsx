/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

interface WeatherMapControlsProps {
  showStations: boolean;
  onToggle: (show: boolean) => void;
}

const TemperatureLegendItem = ({ 
  color, 
  range, 
  label 
}: { 
  color: string; 
  range: string; 
  label: string;
}) => (
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
    <div>
      <div className="font-semibold text-xs sm:text-sm">{range}</div>
      <div className="text-gray-600 text-xs">{label}</div>
    </div>
  </div>
);

export default function WeatherMapSection({ 
  showStations, 
  onToggle 
}: WeatherMapControlsProps) {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 flex items-center gap-2">
          <span>🗺️</span>
          <span className="break-words">Bản đồ thời tiết - OpenStreetMap</span>
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Hiển thị trạm:</span>
          <button
            onClick={() => onToggle(!showStations)}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
              showStations
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showStations ? '✓ Đang bật' : 'Tắt'}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-4 p-3 sm:p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <div className="flex items-start gap-2 sm:gap-3">
          <div>
            <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Hướng dẫn sử dụng</h3>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
              <li>• Click vào các điểm tròn màu để xem chi tiết trạm quan trắc</li>
              <li>
                • Màu sắc thể hiện nhiệt độ (Đỏ = Nóng &gt;30°C, Cam = Ấm 25-30°C, Xanh =
                Mát &lt;25°C)
              </li>
              <li>• Số hiển thị là nhiệt độ hiện tại tại trạm</li>
              <li>• Sử dụng nút bật/tắt để ẩn/hiện các trạm quan trắc</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Temperature Legend */}
      <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-sm">Chú thích nhiệt độ:</h3>
        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs">
          <TemperatureLegendItem color="#3b82f6" range="< 25°C" label="Mát mẻ" />
          <TemperatureLegendItem color="#f59e0b" range="25-30°C" label="Ấm áp" />
          <TemperatureLegendItem color="#ef4444" range="> 30°C" label="Nóng bức" />
        </div>
      </div>
    </>
  );
}
