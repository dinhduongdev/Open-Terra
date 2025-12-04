/*
 * Open-Terra - IoT and Smart City Data Platform
 * @author Vibe Coders / HCMCOU
 * @copyright (C) 2025 Vibe Coders / HCMCOU. All rights reserved
 * @license MIT License
 * @see https://github.com/dinhduongdev/Open-Terra The Open-Terra GitHub project
 */



import HeroSection from '@/components/common/HeroSection';
import FeaturesSection from '@/components/common/FeaturesSection';
import StatsSection from '@/components/common/StatsSection';
import ModulesSection from '@/components/common/ModulesSection';
import AboutSection from '@/components/common/AboutSection';

export default function MainPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <ModulesSection />
      <AboutSection />
    </div>
  );
}
