'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Next.js
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export default function Map({ 
  center = [21.0285, 105.8542], 
  zoom = 13,
  className = 'h-[600px] w-full'
}: MapProps) {
  useEffect(() => {
    const map = L.map('map').setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);


    L.marker(center)
      .addTo(map)
      .bindPopup('Hanoi, Vietnam')
      .openPopup();

    return () => {
      map.remove();
    };
  }, [center, zoom]);

  return <div id="map" className={className} />;
}
