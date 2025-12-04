

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
