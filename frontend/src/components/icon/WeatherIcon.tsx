interface IconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function WeatherIcon({ className = 'w-5 h-5', width, height }: IconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
      />
    </svg>
  );
}
