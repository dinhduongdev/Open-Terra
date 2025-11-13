'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '');
    // Navigate to new locale
    router.push(`/${newLocale}${pathnameWithoutLocale}`);
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
      <button
        onClick={() => handleLanguageChange('vi')}
        className={`px-3 py-1 rounded transition-colors ${
          locale === 'vi'
            ? 'bg-emerald-500 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        VI
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded transition-colors ${
          locale === 'en'
            ? 'bg-emerald-500 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
    </div>
  );
}
