/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function HeroSection() {
  const t = useTranslations('introduction');

  return (
    <section className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-scale-in">
            {t('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-3 md:mb-4 text-emerald-50 animate-fade-in delay-200">
            {t('hero.subtitle')}
          </p>
          <p className="text-base md:text-lg mb-6 md:mb-8 text-emerald-100 animate-fade-in delay-300">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-slide-up delay-400">
            <Link 
              href="/traffic" 
              className="bg-white text-emerald-600 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-all transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-2xl"
            >
              {t('hero.cta')}
            </Link>
            <a 
              href="#about" 
              className="bg-emerald-700 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-all transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-2xl border-2 border-white/30"
            >
              {t('hero.learnMore')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
