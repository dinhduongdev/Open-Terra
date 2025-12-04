import { useTranslations } from 'next-intl';

interface AboutCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  animation: string;
  iconDelay?: string;
}

function AboutCard({ icon, title, description, colorClass, animation, iconDelay }: AboutCardProps) {
  return (
    <div className={`bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${animation}`}>
      <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4 animate-bounce-in ${iconDelay || ''}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default function AboutSection() {
  const t = useTranslations('introduction');

  const cards = [
    {
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      titleKey: 'about.mission.title',
      descriptionKey: 'about.mission.description',
      colorClass: 'bg-emerald-100',
      animation: 'animate-slide-in-left'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      titleKey: 'about.vision.title',
      descriptionKey: 'about.vision.description',
      colorClass: 'bg-blue-100',
      animation: 'animate-slide-in-right',
      iconDelay: 'delay-200'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            {t('about.title')}
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            {t('about.description')}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {cards.map((card, index) => (
              <AboutCard
                key={index}
                icon={card.icon}
                title={t(card.titleKey)}
                description={t(card.descriptionKey)}
                colorClass={card.colorClass}
                animation={card.animation}
                iconDelay={card.iconDelay}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
