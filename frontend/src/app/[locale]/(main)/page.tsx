

import { useTranslations } from 'next-intl';

export default function MainPage() {
  const t = useTranslations('dashboard');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {t('welcome')}
      </h1>
      <p className="text-gray-600">
        {t('description')}
      </p>
    </div>
  );
}
