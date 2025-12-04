import { WeatherAlert } from '@/constants/weatherMockData';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

export default function WeatherAlertsComponent({ alerts }: WeatherAlertsProps) {
  if (alerts.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">✅</span>
          <div>
            <h3 className="font-semibold text-green-800">Không có cảnh báo</h3>
            <p className="text-sm text-green-600">Thời tiết hiện tại trong điều kiện bình thường</p>
          </div>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      default:
        return 'bg-blue-100 border-blue-500 text-blue-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '⚡';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <span>⚠️</span>
        Cảnh báo thời tiết
      </h2>

      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-lg p-6 border-l-4 ${getSeverityColor(alert.severity)}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-3xl">{getSeverityIcon(alert.severity)}</span>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">{alert.title}</h3>
              <p className="text-sm mb-3">{alert.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Thời gian:</span>
                  <span>
                    {new Date(alert.startTime).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {' → '}
                    {new Date(alert.endTime).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                
                <div className="flex items-start gap-2">
                  <span className="font-medium">Khu vực:</span>
                  <span>{alert.affectedAreas.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
