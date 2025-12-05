import { WeatherData } from '@/types/weather';

interface WeatherCurrentCardProps {
  weatherData: WeatherData;
}

const formatWeatherType = (weatherType: string | number): string => {
  return String(weatherType)
    .replace(/\\u00e2/g, 'â')
    .replace(/\\u1ee5/g, 'ụ')
    .replace(/\\u00ea/g, 'ê')
    .replace(/\\u1ed3/g, 'ồ');
};

const WeatherDetailCard = ({ 
  icon, 
  label, 
  value, 
  subtitle 
}: { 
  icon: string; 
  label: string; 
  value: string | number; 
  subtitle?: string;
}) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
    <div className="flex items-center gap-1.5 mb-1 text-white/80">
      <span className="text-lg">{icon}</span>
      <span className="text-xs">{label}</span>
    </div>
    <p className="text-2xl font-bold">{value}</p>
    {subtitle && <p className="text-xs opacity-75 mt-0.5">{subtitle}</p>}
  </div>
);

export default function WeatherCurrentCard({ weatherData }: WeatherCurrentCardProps) {
  const { result } = weatherData;
//   const temperature = Math.round(Number(result.temperature.value));
  const temperature = result.temperature.value;
  console.log("temperature",temperature);
  
  const feelsLike = Math.round(Number(result.feelsLikeTemperature.value));
  const humidity = (Number(result.relativeHumidity.value) * 100).toFixed(0);
  const windSpeed = Math.round(Number(result.windSpeed.value));
  const visibility = Math.round(Number(result.visibility.value) / 1000);
  const updateTime = new Date(result.dateObserved['@value']).toLocaleTimeString('vi-VN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl shadow-lg overflow-hidden">
      <div className="p-5 md:p-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-sm font-medium opacity-90 mb-0.5">Thời tiết hiện tại</h2>
            <p className="text-xs opacity-75">Cập nhật: {updateTime}</p>
          </div>
          <div className="text-4xl">☁️</div>
        </div>

        {/* Main Temperature */}
        <div className="mb-4">
          <div className="flex items-start">
            <span className="text-6xl md:text-7xl font-bold leading-none">
              {temperature}
            </span>
            <span className="text-3xl font-light ml-2 mt-1">°C</span>
          </div>
          <div className="mt-2 space-y-0.5">
            <p className="text-lg font-medium">
              {formatWeatherType(result.weatherType.value)}
            </p>
            <p className="text-sm opacity-90">
              Cảm giác như {feelsLike}°C
            </p>
          </div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-4 border-t border-white/20">
          <WeatherDetailCard 
            icon="💧" 
            label="Độ ẩm" 
            value={`${humidity}%`} 
          />
          <WeatherDetailCard 
            icon="🌬️" 
            label="Gió" 
            value={`${windSpeed} km/h`}
            subtitle="Đông Nam"
          />
          <WeatherDetailCard 
            icon="☁️" 
            label="Mây che phủ" 
            value="40%" 
          />
          <WeatherDetailCard 
            icon="👁️" 
            label="Tầm nhìn" 
            value={visibility}
            subtitle="km"
          />
        </div>

        {/* Additional Weather Info */}
        <div className="grid grid-cols-2 gap-2.5 mt-2.5">
          <WeatherDetailCard 
            icon="☀️" 
            label="Chỉ số UV" 
            value={result.uVIndexMax.value}
            subtitle="Cao"
          />
          <WeatherDetailCard 
            icon="🌡️" 
            label="Áp suất" 
            value={result.atmosphericPressure.value}
            subtitle="hPa"
          />
        </div>
      </div>
    </div>
  );
}
