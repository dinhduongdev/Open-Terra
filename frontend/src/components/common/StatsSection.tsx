import { useTranslations } from 'next-intl';

interface StatCardProps {
  value: string;
  label: string;
  delay: string;
  animationDelay?: string;
}

function StatCard({ value, label, delay, animationDelay }: StatCardProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 animate-bounce-in ${delay}`}>
      <div className="text-4xl font-bold mb-2 animate-pulse" style={animationDelay ? { animationDelay } : undefined}>
        {value}
      </div>
      <div className="text-emerald-100">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const t = useTranslations('introduction');

  const stats = [
    { value: '3+', labelKey: 'stats.cities', delay: 'delay-100' },
    { value: '500+', labelKey: 'stats.sensors', delay: 'delay-200', animationDelay: '0.2s' },
    { value: '10K+', labelKey: 'stats.users', delay: 'delay-300', animationDelay: '0.4s' },
    { value: '1M+', labelKey: 'stats.dataPoints', delay: 'delay-400', animationDelay: '0.6s' }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">
          {t('stats.title')}
        </h2>
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              value={stat.value}
              label={t(stat.labelKey)}
              delay={stat.delay}
              animationDelay={stat.animationDelay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
