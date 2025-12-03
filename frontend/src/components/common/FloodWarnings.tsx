import { FloodWarning } from '@/constants/floodMockData';

interface FloodWarningsProps {
  warnings: FloodWarning[];
}

export default function FloodWarnings({ warnings }: FloodWarningsProps) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'warning':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'danger':
        return 'bg-orange-100 border-orange-400 text-orange-800';
      case 'critical':
        return 'bg-red-100 border-red-400 text-red-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
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

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'warning':
        return '⚠️';
      case 'danger':
        return '🔶';
      case 'critical':
        return '🚨';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>⚠️</span> Cảnh báo ngập lụt
      </h2>
      <div className="space-y-4">
        {warnings.map((warning) => (
          <div
            key={warning.id}
            className={`border-l-4 p-4 rounded ${getLevelColor(warning.level)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{getLevelIcon(warning.level)}</span>
                  <h3 className="font-semibold text-lg">{warning.location}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-white/50 font-medium">
                    {getLevelText(warning.level)}
                  </span>
                </div>
                <p className="text-sm mb-2">{warning.message}</p>
                <p className="text-xs opacity-75">
                  {new Date(warning.timestamp).toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
