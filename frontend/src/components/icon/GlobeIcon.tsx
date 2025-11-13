import React from 'react';

interface GlobeIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

function GlobeIcon({ className = "w-5 h-5", width, height }: GlobeIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="2"
      width={width}
      height={height}
    >
      <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path d="M12 3v18M3 12h18" />
    </svg>
  );
}

export default GlobeIcon;