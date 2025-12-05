/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

'use client';

interface Pollutant {
  name: string;
  value: number;
  unit: string;
  trend: number;
}

interface PollutantsOverviewProps {
  pollutants: Pollutant[];
}

// WHO Air Quality Guidelines (2021)
const WHO_STANDARDS: { [key: string]: number } = {
  PM25: 15, // µg/m³ (annual mean)
  PM10: 45, // µg/m³ (annual mean)
  PM1: 10, // µg/m³ (estimated)
  O3: 60, // ppb (8-hour mean)
  NO2: 25, // ppb (annual mean)
  SO2: 40, // ppb (24-hour mean)
  CO: 4, // ppm (8-hour mean)
};

export default function PollutantsOverview({ pollutants }: PollutantsOverviewProps) {
  const getPollutantLevel = (name: string, value: number): string => {
    const standard = WHO_STANDARDS[name];
    if (!standard) return 'Không rõ';
    
    const percentage = (value / standard) * 100;
    if (percentage <= 50) return 'Tốt';
    if (percentage <= 100) return 'Trung bình';
    if (percentage <= 150) return 'Kém';
    return 'Rất kém';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Tốt':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Trung bình':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Kém':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Rất kém':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 100) return 'bg-yellow-500';
    if (percentage <= 150) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const calculatePercentage = (name: string, value: number): number => {
    const standard = WHO_STANDARDS[name];
    if (!standard) return 0;
    return Math.round((value / standard) * 100);
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <span>🧪</span>
        Các chất ô nhiễm chính
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pollutants.map((pollutant, index) => {
          const level = getPollutantLevel(pollutant.name, pollutant.value);
          const percentage = calculatePercentage(pollutant.name, pollutant.value);
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{pollutant.name}</h3>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {pollutant.value} <span className="text-sm text-gray-500">{pollutant.unit}</span>
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelColor(level)}`}
                >
                  {level}
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>So với tiêu chuẩn WHO</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all ${getProgressColor(percentage)}`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                    }}
                  ></div>
                </div>
            </div>

            {WHO_STANDARDS[pollutant.name] && (
              <div className="text-xs text-gray-500 mt-3">
                Tiêu chuẩn WHO: <strong>{WHO_STANDARDS[pollutant.name]} {pollutant.unit}</strong>
              </div>
            )}

            {pollutant.trend !== 0 && (
              <div className="flex items-center gap-1 text-xs mt-2">
                {pollutant.trend > 0 ? (
                  <span className="text-red-600">↑ Tăng {Math.abs(pollutant.trend)}%</span>
                ) : (
                  <span className="text-green-600">↓ Giảm {Math.abs(pollutant.trend)}%</span>
                )}
              </div>
            )}
          </div>
        );
        })}
      </div>

      {/* Pollutants Info */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Giải thích các chất ô nhiễm</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>PM2.5:</strong> Bụi mịn có đường kính ≤ 2.5 micromet, nguy hiểm vì có thể xâm nhập sâu vào phổi.</p>
          <p><strong>PM10:</strong> Bụi có đường kính ≤ 10 micromet, gây kích ứng đường hô hấp.</p>
          <p><strong>O₃ (Ozone):</strong> Khí ozone ở tầng mặt đất, gây kích ứng phổi và đường hô hấp.</p>
          <p><strong>NO₂:</strong> Nitơ dioxide từ khí thải xe, gây viêm đường hô hấp.</p>
          <p><strong>SO₂:</strong> Lưu huỳnh dioxide từ đốt nhiên liệu hóa thạch.</p>
          <p><strong>CO:</strong> Carbon monoxide, khí không màu không mùi, nguy hiểm ở nồng độ cao.</p>
        </div>
      </div>
    </div>
  );
}
