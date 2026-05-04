interface Props { className?: string }

export function BunnyBreaking({ className }: Props) {
  return (
    <svg
      className={`bunny-svg ${className ?? ''}`}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bunny breaking free"
      role="img"
      width="90"
      height="108"
    >
      {/* perky ears, one bent back with motion */}
      <ellipse cx="32" cy="22" rx="6" ry="14" fill="#fef3c7" transform="rotate(-10 32 22)" />
      <ellipse cx="32" cy="22" rx="3" ry="10" fill="#fda4af" transform="rotate(-10 32 22)" />
      <ellipse cx="65" cy="18" rx="6" ry="14" fill="#fef3c7" transform="rotate(30 65 18)" />
      <ellipse cx="65" cy="18" rx="3" ry="10" fill="#fda4af" transform="rotate(30 65 18)" />

      {/* body — more upright, leaning forward */}
      <ellipse cx="48" cy="80" rx="18" ry="20" fill="#fef3c7" transform="rotate(-5 48 80)" />

      {/* head */}
      <circle cx="50" cy="52" r="18" fill="#fef3c7" />
      <ellipse cx="40" cy="55" rx="5" ry="3" fill="#fecdd3" opacity="0.5" />
      <ellipse cx="60" cy="55" rx="5" ry="3" fill="#fecdd3" opacity="0.5" />
      {/* wide open surprised eyes */}
      <circle cx="43" cy="50" r="3.5" fill="#1c1917" />
      <circle cx="57" cy="50" r="3.5" fill="#1c1917" />
      <circle cx="44" cy="49" r="1" fill="white" />
      <circle cx="58" cy="49" r="1" fill="white" />
      {/* nose */}
      <ellipse cx="50" cy="56" rx="2.5" ry="1.5" fill="#fb7185" />
      {/* open mouth — effort */}
      <path d="M 45 61 Q 50 66 55 61" fill="#fda4af" stroke="#1c1917" strokeWidth="1" />

      {/* tail */}
      <circle cx="68" cy="75" r="7" fill="white" />

      {/* leg raised and extended — breaking free */}
      <ellipse cx="38" cy="100" rx="9" ry="5" fill="#fef3c7" />
      <ellipse cx="62" cy="90" rx="9" ry="5" fill="#fef3c7" transform="rotate(-30 62 90)" />

      {/* broken rope segments flying outward */}
      <line x1="55" y1="100" x2="42" y2="112" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="98" x2="72" y2="113" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round" />
      {/* fraying ends */}
      <line x1="42" y1="112" x2="38" y2="116" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="112" x2="40" y2="118" stroke="#92400e" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
