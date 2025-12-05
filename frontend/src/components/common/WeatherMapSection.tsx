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
    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color }} />
    <div>
      <div className="font-semibold">{range}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  </div>
);

export default function WeatherMapSection({ 
  showStations, 
  onToggle 
}: WeatherMapControlsProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <span>🗺️</span>
          Bản đồ thời tiết - OpenStreetMap
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị trạm quan trắc:</span>
          <button
            onClick={() => onToggle(!showStations)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
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
      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <div className="flex items-start gap-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Hướng dẫn sử dụng</h3>
            <ul className="text-sm text-blue-800 space-y-1">
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
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm">Chú thích nhiệt độ:</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <TemperatureLegendItem color="#3b82f6" range="< 25°C" label="Mát mẻ" />
          <TemperatureLegendItem color="#f59e0b" range="25-30°C" label="Ấm áp" />
          <TemperatureLegendItem color="#ef4444" range="> 30°C" label="Nóng bức" />
        </div>
      </div>
    </>
  );
}
