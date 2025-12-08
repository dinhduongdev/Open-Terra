/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */

import { useTranslations } from 'next-intl';
import TrafficIcon from '@/components/icon/TrafficIcon';
import FloodIcon from '@/components/icon/FloodIcon';
import AirQualityIcon from '@/components/icon/AirQualityIcon';
import WeatherIcon from '@/components/icon/WeatherIcon';
import ParkingIcon from '@/components/icon/ParkingIcon';
import InfrastructureIcon from '@/components/icon/InfrastructureIcon';
import ModuleCard from './ModuleCard';

export default function ModulesSection() {
  const t = useTranslations('introduction');
  const tSidebar = useTranslations('sidebar');

  const modules = [
    {
      href: '/traffic',
      icon: TrafficIcon,
      titleKey: 'traffic',
      descriptionKey: 'modules.traffic',
      colorScheme: {
        border: 'emerald-500',
        bg: 'bg-emerald-100',
        bgHover: 'bg-emerald-500',
        text: 'text-emerald-600',
        iconText: 'text-emerald-600',
        iconTextHover: 'text-white'
      }
    },
    {
      href: '/flood-map',
      icon: FloodIcon,
      titleKey: 'floodMap',
      descriptionKey: 'modules.flood',
      colorScheme: {
        border: 'blue-500',
        bg: 'bg-blue-100',
        bgHover: 'bg-blue-500',
        text: 'text-blue-600',
        iconText: 'text-blue-600',
        iconTextHover: 'text-white'
      }
    },
    {
      href: '/air-quality',
      icon: AirQualityIcon,
      titleKey: 'airQuality',
      descriptionKey: 'modules.air',
      colorScheme: {
        border: 'purple-500',
        bg: 'bg-purple-100',
        bgHover: 'bg-purple-500',
        text: 'text-purple-600',
        iconText: 'text-purple-600',
        iconTextHover: 'text-white'
      }
    },
    {
      href: '/weather',
      icon: WeatherIcon,
      titleKey: 'weather',
      descriptionKey: 'modules.weather',
      colorScheme: {
        border: 'orange-500',
        bg: 'bg-orange-100',
        bgHover: 'bg-orange-500',
        text: 'text-orange-600',
        iconText: 'text-orange-600',
        iconTextHover: 'text-white'
      }
    },
    {
      href: '#',
      icon: ParkingIcon,
      titleKey: 'parking',
      descriptionKey: 'modules.parking',
      colorScheme: {
        border: 'indigo-500',
        bg: 'bg-indigo-100',
        bgHover: 'bg-indigo-500',
        text: 'text-indigo-600',
        iconText: 'text-indigo-600',
        iconTextHover: 'text-white'
      }
    },
    {
      href: '#',
      icon: InfrastructureIcon,
      titleKey: 'infrastructure',
      descriptionKey: 'modules.infrastructure',
      colorScheme: {
        border: 'teal-500',
        bg: 'bg-teal-100',
        bgHover: 'bg-teal-500',
        text: 'text-teal-600',
        iconText: 'text-teal-600',
        iconTextHover: 'text-white'
      }
    }
  ];

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-12">
          {t('modules.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={index}
              href={module.href}
              icon={module.icon}
              title={tSidebar(module.titleKey)}
              description={t(module.descriptionKey)}
              colorScheme={module.colorScheme}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
