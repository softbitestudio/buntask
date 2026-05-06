interface Props { className?: string }

export function BunnyDancing({ className }: Props) {
  return (
    <svg
      className={`bunny-svg ${className ?? ''}`}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Dancing bunny"
      role="img"
      width="90"
      height="108"
    >
      {/* tall perky ears */}
      <ellipse cx="33" cy="18" rx="6" ry="15" fill="#fef3c7" />
      <ellipse cx="33" cy="18" rx="3" ry="11" fill="#fda4af" />
      <ellipse cx="62" cy="18" rx="6" ry="15" fill="#fef3c7" />
      <ellipse cx="62" cy="18" rx="3" ry="11" fill="#fda4af" />

      {/* body — upright */}
      <ellipse cx="48" cy="82" rx="17" ry="22" fill="#fef3c7" />

      {/* arms raised in celebration */}
      <line x1="31" y1="72" x2="18" y2="55" stroke="#fef3c7" strokeWidth="7" strokeLinecap="round" />
      <line x1="65" y1="72" x2="78" y2="55" stroke="#fef3c7" strokeWidth="7" strokeLinecap="round" />
      {/* little paws */}
      <circle cx="17" cy="53" r="5" fill="#fef3c7" />
      <circle cx="79" cy="53" r="5" fill="#fef3c7" />

      {/* head */}
      <circle cx="48" cy="50" r="19" fill="#fef3c7" />
      <ellipse cx="37" cy="54" rx="5" ry="3" fill="#fecdd3" opacity="0.6" />
      <ellipse cx="59" cy="54" rx="5" ry="3" fill="#fecdd3" opacity="0.6" />
      {/* happy ^ eyes */}
      <path d="M 39 48 Q 42 44 45 48" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 51 48 Q 54 44 57 48" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
      {/* nose */}
      <ellipse cx="48" cy="55" rx="2.5" ry="1.5" fill="#fb7185" />
      {/* big grin */}
      <path d="M 41 60 Q 48 67 55 60" fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />

      {/* tail */}
      <circle cx="66" cy="78" r="7" fill="white" />

      {/* feet spread in dance */}
      <ellipse cx="38" cy="103" rx="9" ry="5" fill="#fef3c7" transform="rotate(10 38 103)" />
      <ellipse cx="60" cy="103" rx="9" ry="5" fill="#fef3c7" transform="rotate(-10 60 103)" />

      {/* sparkle stars */}
      <text x="6" y="38" fontSize="12" fill="#fbbf24">✦</text>
      <text x="76" y="34" fontSize="10" fill="#f9a8d4">✦</text>
      <text x="12" y="72" fontSize="8" fill="#86efac">✦</text>
    </svg>
  )
}
