'use client';

import { FloodStatsByTime, FloodStation } from '@/constants/floodMockData';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

interface FloodStatisticsProps {
  statsByTime: FloodStatsByTime[];
  stations: FloodStation[];
}

export default function FloodStatistics({ statsByTime, stations }: FloodStatisticsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'danger':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal':
        return 'Bình thường';
      case 'warning':
        return 'Cảnh báo';
      case 'danger':
        return 'Nguy hiểm';
      case 'critical':
        return 'Rất nguy hiểm';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Water level chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📊</span> Biểu đồ mực nước & lượng mưa
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={statsByTime}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#3b82f6"
              label={{ value: 'Mực nước (m)', angle: -90, position: 'insideLeft', style: { fontSize: '12px' } }}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#10b981"
              label={{ value: 'Lượng mưa (mm)', angle: 90, position: 'insideRight', style: { fontSize: '12px' } }}
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px'
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="waterLevel" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Mực nước (m)"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Bar 
              yAxisId="right"
              dataKey="rainfall" 
              fill="#10b981" 
              name="Lượng mưa (mm)"
              radius={[4, 4, 0, 0]}
              opacity={0.7}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Stations status */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>🌊</span> Trạm đo mực nước
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {stations.map((station) => {
            // Calculate alert level percentage
            const alertPercentage = Math.min(
              Math.round((station.waterLevel / station.alertLevel3) * 100),
              100
            );

            const chartData = [
              {
                name: station.name,
                value: alertPercentage,
                fill:
                  station.status === 'normal'
                    ? '#10b981'
                    : station.status === 'warning'
                    ? '#f59e0b'
                    : '#ef4444',
              },
            ];

            return (
              <div key={station.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{station.name}</h3>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      station.status === 'normal'
                        ? 'bg-green-100 text-green-800'
                        : station.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {station.status === 'normal'
                      ? '✓'
                      : station.status === 'warning'
                      ? '⚠'
                      : '🚨'}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <ResponsiveContainer width={100} height={100}>
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="90%"
                        data={chartData}
                        startAngle={90}
                        endAngle={-270}
                      >
                        <PolarAngleAxis
                          type="number"
                          domain={[0, 100]}
                          angleAxisId={0}
                          tick={false}
                        />
                        <RadialBar
                          background
                          dataKey="value"
                          cornerRadius={10}
                          fill={chartData[0].fill}
                        />
                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-lg font-bold"
                          fill="#1f2937"
                        >
                          {alertPercentage}%
                        </text>
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Hiện tại:</span>
                      <span className="font-semibold text-gray-900">
                        {station.waterLevel.toFixed(2)}m
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Mức 3:</span>
                      <span className="font-semibold text-gray-900">
                        {station.alertLevel3}m
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Trạng thái:</span>
                      <span
                        className={`font-semibold ${
                          station.status === 'normal'
                            ? 'text-green-600'
                            : station.status === 'warning'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {station.status === 'normal'
                          ? 'Bình thường'
                          : station.status === 'warning'
                          ? 'Cảnh báo'
                          : 'Nguy hiểm'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
