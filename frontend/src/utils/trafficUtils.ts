import { TrafficStatus, IncidentSeverity } from '@/types/traffic';

export const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase() as TrafficStatus;
  
  const colorMap: Record<TrafficStatus | string, string> = {
    smooth: 'bg-green-100 text-green-800 border-green-300',
    moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    congested: 'bg-orange-100 text-orange-800 border-orange-300',
    heavy: 'bg-red-100 text-red-800 border-red-300',
  };

  return colorMap[statusLower] || 'bg-gray-100 text-gray-800 border-gray-300';
};

export const getSeverityColor = (severity: IncidentSeverity | string): string => {
  const severityMap: Record<IncidentSeverity | string, string> = {
    minor: 'bg-blue-100 text-blue-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return severityMap[severity] || 'bg-gray-100 text-gray-800';
};

export const getCongestionColor = (congestion: number): string => {
  if (congestion > 60) return 'bg-red-500';
  if (congestion > 40) return 'bg-orange-500';
  if (congestion > 20) return 'bg-yellow-500';
  return 'bg-green-500';
};
