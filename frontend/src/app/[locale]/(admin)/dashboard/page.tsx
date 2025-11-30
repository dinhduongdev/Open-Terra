import StatsCard from '@/components/admin/StatsCard';
import ChartSection from '@/components/admin/ChartSection';
import RecentActivities from '@/components/admin/RecentActivities';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Tổng số thiết bị',
      value: '1,234',
      change: '+12%',
      iconName: 'dashboard',
      color: 'bg-blue-500',
    },
    {
      title: 'Giao thông',
      value: '567',
      change: '+8%',
      iconName: 'traffic',
      color: 'bg-green-500',
    },
    {
      title: 'Môi trường',
      value: '89',
      change: '-3%',
      iconName: 'environment',
      color: 'bg-yellow-500',
    },
    {
      title: 'Cảnh báo',
      value: '23',
      change: '+5%',
      iconName: 'alert',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Tổng quan hệ thống Smart City</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            iconName={stat.iconName}
            color={stat.color}
            index={index}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection title="Lưu lượng giao thông" description="Biểu đồ giao thông" />
        <ChartSection title="Chất lượng môi trường" description="Biểu đồ môi trường" />
      </div>

      {/* Recent Activities */}
      <RecentActivities />
    </div>
  );
}
