interface LogoIconProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

function LogoIcon({ className = "w-8 h-8", width, height }: LogoIconProps) {
  return (
    <svg
      width="340"
      height="380"
      viewBox="0 0 340 380"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="oceanGrad" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#E9FAFF" />
          <stop offset="60%" stopColor="#B6EBFF" />
          <stop offset="100%" stopColor="#4FB5E3" />
        </radialGradient>

        <radialGradient id="sunGlow" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      <circle cx="170" cy="170" r="140" fill="url(#oceanGrad)" />
      <circle cx="170" cy="170" r="140" fill="url(#sunGlow)" opacity="0.55" />

      <path
        d="
        M125 145
        C145 120, 185 118, 212 140
        C228 155, 225 178, 205 195
        C178 215, 145 210, 130 185
        C118 168, 118 155, 125 145Z"
        fill="#53C88F"
        opacity="0.92"
      />

      <path
        d="
        M160 80
        C175 78, 190 88, 192 100
        C180 108, 165 108, 158 95
        C156 88, 156 83, 160 80Z"
        fill="#48BA80"
        opacity="0.9"
      />

      <path
        d="M90 135
           C105 128, 118 135, 115 148
           C103 155, 92 150, 88 142Z"
        fill="#48BA80"
        opacity="0.9"
      />

      <path
        d="M245 145
           C258 150, 265 163, 256 172
           C242 168, 237 158, 245 145Z"
        fill="#45AF76"
        opacity="0.88"
      />

      <path
        d="M110 245
           C125 253, 134 267, 127 278
           C112 273, 102 258, 105 248Z"
        fill="#4CBB83"
        opacity="0.88"
      />

      <path
        d="M228 248
           C240 255, 248 270, 240 280
           C225 275, 218 260, 222 252Z"
        fill="#43AD72"
        opacity="0.88"
      />
      <path
        d="M165 265
           C175 268, 182 278, 175 288
           C165 287, 158 275, 160 268Z"
        fill="#3EA96C"
        opacity="0.88"
      />

      <circle cx="170" cy="170" r="22" fill="#1F8EF1" opacity="0.12" />

      <circle
        cx="130"
        cy="110"
        r="12"
        fill="#4DD6FF"
        stroke="#FFFFFF"
        stroke-width="2"
      />
      <circle
        cx="130"
        cy="240"
        r="12"
        fill="#4DD6FF"
        stroke="#FFFFFF"
        stroke-width="2"
      />

      <circle
        cx="230"
        cy="110"
        r="12"
        fill="#3498DB"
        stroke="#FFFFFF"
        stroke-width="2"
      />
      <circle
        cx="230"
        cy="240"
        r="12"
        fill="#3498DB"
        stroke="#FFFFFF"
        stroke-width="2"
      />

      <circle
        cx="170"
        cy="170"
        r="15"
        fill="#1F8EF1"
        stroke="#FFFFFF"
        stroke-width="2"
      />

      <line
        x1="130"
        y1="110"
        x2="170"
        y2="170"
        stroke="#1F8EF1"
        stroke-width="4"
        opacity="0.85"
      />
      <line
        x1="230"
        y1="110"
        x2="170"
        y2="170"
        stroke="#1F8EF1"
        stroke-width="4"
        opacity="0.85"
      />
      <line
        x1="130"
        y1="240"
        x2="170"
        y2="170"
        stroke="#1F8EF1"
        stroke-width="4"
        opacity="0.85"
      />
      <line
        x1="230"
        y1="240"
        x2="170"
        y2="170"
        stroke="#1F8EF1"
        stroke-width="4"
        opacity="0.85"
      />

      <text
        x="170"
        y="350"
        fontSize="42"
        textAnchor="middle"
        fill="#1E2E3D"
        style={{ letterSpacing: "1.5px", fontWeight: 700 }}
      >
        OpenTerra
      </text>

      <text
        x="170"
        y="372"
        fontSize="15"
        textAnchor="middle"
        fill="#7F8C8D"
        style={{ letterSpacing: "0.5px" }}
      >
        Smart City Open Data Platform
      </text>
    </svg>
  );
}

export default LogoIcon;
