const WeatherTipCard = ({ 
  icon, 
  title, 
  tips, 
  gradient 
}: { 
  icon: string; 
  title: string; 
  tips: string[]; 
  gradient: string;
}) => (
  <div className={`${gradient} rounded-lg shadow-md p-6 border-l-4 ${
    icon === '☀️' ? 'border-orange-500' : 'border-blue-500'
  }`}>
    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <span>{icon}</span>
      {title}
    </h2>
    <ul className="space-y-2 text-sm text-gray-700">
      {tips.map((tip, index) => (
        <li key={index} className="flex items-start gap-2">
          <span>•</span>
          <span>{tip}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function WeatherTips() {
  const sunProtectionTips = [
    'Sử dụng kem chống nắng SPF 30+ khi ra ngoài',
    'Đội mũ, đeo kính râm để bảo vệ da và mắt',
    'Hạn chế hoạt động ngoài trời từ 11h-15h khi chỉ số UV cao',
    'Uống đủ nước, tránh mất nước trong ngày nóng',
    'Mặc quần áo mỏng, thoáng mát, màu sáng',
  ];

  const rainProtectionTips = [
    'Mang theo áo mưa hoặc ô khi ra ngoài',
    'Kiểm tra dự báo thời tiết trước khi di chuyển xa',
    'Tránh đi qua vùng ngập sâu, nước chảy xiết',
    'Lái xe chậm và cẩn thận khi trời mưa',
    'Tránh xa các cột điện, dây điện khi có sấm sét',
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WeatherTipCard
        icon="☀️"
        title="Khuyến nghị phòng tránh nắng"
        tips={sunProtectionTips}
        gradient="bg-gradient-to-br from-yellow-50 to-orange-50"
      />
      <WeatherTipCard
        icon="🌧️"
        title="Khuyến nghị khi có mưa"
        tips={rainProtectionTips}
        gradient="bg-gradient-to-br from-blue-50 to-cyan-50"
      />
    </div>
  );
}
