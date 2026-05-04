interface Props { className?: string }

export function BunnyTrapped({ className }: Props) {
  return (
    <svg
      className={`bunny-svg ${className ?? ''}`}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Trapped bunny"
      role="img"
      width="90"
      height="108"
    >
      {/* drooping ears */}
      <ellipse cx="32" cy="28" rx="6" ry="13" fill="#fef3c7" transform="rotate(-25 32 28)" />
      <ellipse cx="32" cy="28" rx="3" ry="9" fill="#fda4af" transform="rotate(-25 32 28)" />
      <ellipse cx="62" cy="26" rx="6" ry="13" fill="#fef3c7" transform="rotate(20 62 26)" />
      <ellipse cx="62" cy="26" rx="3" ry="9" fill="#fda4af" transform="rotate(20 62 26)" />

      {/* crouched body */}
      <ellipse cx="48" cy="82" rx="22" ry="16" fill="#fef3c7" />

      {/* head tilted slightly */}
      <g transform="rotate(-8 48 55)">
        <circle cx="48" cy="55" r="18" fill="#fef3c7" />
        {/* blush */}
        <ellipse cx="38" cy="58" rx="5" ry="3" fill="#fecdd3" opacity="0.5" />
        <ellipse cx="58" cy="58" rx="5" ry="3" fill="#fecdd3" opacity="0.5" />
        {/* sad eyes — upside-down arcs */}
        <path d="M 40 52 Q 43 48 46 52" fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
        <path d="M 50 52 Q 53 48 56 52" fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
        {/* small tears */}
        <ellipse cx="40" cy="55" rx="1" ry="1.5" fill="#93c5fd" opacity="0.8" />
        <ellipse cx="56" cy="55" rx="1" ry="1.5" fill="#93c5fd" opacity="0.8" />
        {/* nose */}
        <ellipse cx="48" cy="59" rx="2.5" ry="1.5" fill="#fb7185" />
        {/* sad mouth */}
        <path d="M 44 63 Q 48 61 52 63" fill="none" stroke="#1c1917" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* tail */}
      <circle cx="70" cy="78" r="7" fill="white" />

      {/* front feet / legs */}
      <ellipse cx="38" cy="96" rx="8" ry="5" fill="#fef3c7" />
      {/* trapped foot with snare */}
      <ellipse cx="58" cy="96" rx="8" ry="5" fill="#fef3c7" />

      {/* snare rope loop around right foot */}
      <circle cx="58" cy="97" r="9" fill="none" stroke="#92400e" strokeWidth="2.5" />
      {/* rope down to stake */}
      <line x1="58" y1="106" x2="58" y2="116" stroke="#92400e" strokeWidth="2" />
      {/* ground stake */}
      <rect x="54" y="114" width="8" height="5" rx="1" fill="#451a03" />
    </svg>
  )
}
