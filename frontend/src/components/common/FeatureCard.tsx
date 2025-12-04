import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string;
  delay: string;
}

export default function FeatureCard({ icon, title, description, colorClass, delay }: FeatureCardProps) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up ${delay}`}>
      <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}
