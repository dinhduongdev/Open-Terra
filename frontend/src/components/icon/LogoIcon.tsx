

interface LogoIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

function LogoIcon({ className = "w-8 h-8", width, height }: LogoIconProps) {
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
      <path
        d="M5 10h14M5 14h14M12 3v18M8 3h8a3 3 0 013 3v12a3 3 0 01-3 3H8a3 3 0 01-3-3V6a3 3 0 013-3z"
        className="stroke-emerald-500"
      />
    </svg>
  );
}

export default LogoIcon;