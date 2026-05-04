interface Props { className?: string }

export function BunnyRoaming({ className }: Props) {
  return (
    <svg
      className={`bunny-svg ${className ?? ''}`}
      viewBox="0 0 110 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Free roaming bunny"
      role="img"
      width="90"
      height="98"
    >
      {/* ears — perky, slightly forward-tilted */}
      <ellipse cx="33" cy="18" rx="6" ry="14" fill="#fef3c7" transform="rotate(-5 33 18)" />
      <ellipse cx="33" cy="18" rx="3" ry="10" fill="#fda4af" transform="rotate(-5 33 18)" />
      <ellipse cx="57" cy="16" rx="6" ry="14" fill="#fef3c7" transform="rotate(5 57 16)" />
      <ellipse cx="57" cy="16" rx="3" ry="10" fill="#fda4af" transform="rotate(5 57 16)" />

      {/* body slightly forward-leaning */}
      <ellipse cx="48" cy="78" rx="19" ry="22" fill="#fef3c7" transform="rotate(5 48 78)" />

      {/* arm reaching forward toward strawberry */}
      <line x1="63" y1="72" x2="78" y2="68" stroke="#fef3c7" strokeWidth="7" strokeLinecap="round" />
      <circle cx="80" cy="67" r="5" fill="#fef3c7" />

      {/* head */}
      <circle cx="46" cy="48" r="18" fill="#fef3c7" />
      <ellipse cx="36" cy="52" rx="5" ry="3" fill="#fecdd3" opacity="0.5" />
      <ellipse cx="56" cy="52" rx="5" ry="3" fill="#fecdd3" opacity="0.5" />
      {/* content half-closed eyes */}
      <path d="M 38 46 Q 41 49 44 46" fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
      <path d="M 49 46 Q 52 49 55 46" fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
      {/* nose */}
      <ellipse cx="46" cy="53" rx="2.5" ry="1.5" fill="#fb7185" />
      {/* happy little smile */}
      <path d="M 42 57 Q 46 61 50 57" fill="none" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" />

      {/* tail */}
      <circle cx="67" cy="74" r="7" fill="white" />

      {/* walking legs — one forward, one back */}
      <ellipse cx="36" cy="100" rx="10" ry="5" fill="#fef3c7" transform="rotate(-15 36 100)" />
      <ellipse cx="58" cy="102" rx="10" ry="5" fill="#fef3c7" transform="rotate(15 58 102)" />

      {/* strawberry being nibbled */}
      <g transform="translate(82, 55)">
        {/* berry */}
        <ellipse cx="0" cy="5" rx="7" ry="8" fill="#ef4444" />
        {/* seeds */}
        <ellipse cx="-2" cy="4" rx="0.8" ry="1" fill="#fca5a5" />
        <ellipse cx="2" cy="7" rx="0.8" ry="1" fill="#fca5a5" />
        <ellipse cx="0" cy="2" rx="0.8" ry="1" fill="#fca5a5" />
        {/* leaves */}
        <path d="M -4 0 Q 0 -8 4 0" fill="#16a34a" />
        <path d="M -2 -2 Q 0 -6 2 -2" fill="#4ade80" />
      </g>
    </svg>
  )
}
