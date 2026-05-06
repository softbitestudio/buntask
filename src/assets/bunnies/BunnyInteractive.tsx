interface Props { className?: string }

export function BunnyInteractive({ className }: Props) {
  return (
    <svg
      className={`bunny-svg ${className ?? ''}`}
      viewBox="0 0 100 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bunny waiting to be petted"
      role="img"
      width="90"
      height="108"
    >
      {/* tall perky ears, slightly splayed invitingly */}
      <ellipse cx="31" cy="20" rx="6" ry="15" fill="#fef3c7" transform="rotate(-8 31 20)" />
      <ellipse cx="31" cy="20" rx="3" ry="11" fill="#fda4af" transform="rotate(-8 31 20)" />
      <ellipse cx="64" cy="20" rx="6" ry="15" fill="#fef3c7" transform="rotate(8 64 20)" />
      <ellipse cx="64" cy="20" rx="3" ry="11" fill="#fda4af" transform="rotate(8 64 20)" />

      {/* sitting body — round and comfy */}
      <ellipse cx="48" cy="85" rx="22" ry="24" fill="#fef3c7" />

      {/* front paws extended outward, asking for pets */}
      <ellipse cx="22" cy="98" rx="10" ry="6" fill="#fef3c7" transform="rotate(-15 22 98)" />
      <ellipse cx="74" cy="98" rx="10" ry="6" fill="#fef3c7" transform="rotate(15 74 98)" />
      {/* little paw toes */}
      <ellipse cx="14" cy="101" rx="4" ry="3" fill="#fef3c7" />
      <ellipse cx="80" cy="101" rx="4" ry="3" fill="#fef3c7" />

      {/* head — slightly tilted, looking up hopefully */}
      <circle cx="48" cy="50" r="20" fill="#fef3c7" />

      {/* generous blush */}
      <ellipse cx="35" cy="55" rx="7" ry="4" fill="#fecdd3" opacity="0.6" />
      <ellipse cx="61" cy="55" rx="7" ry="4" fill="#fecdd3" opacity="0.6" />

      {/* big round sparkly eyes */}
      <circle cx="40" cy="47" r="5" fill="#1c1917" />
      <circle cx="56" cy="47" r="5" fill="#1c1917" />
      {/* sparkle highlights */}
      <circle cx="42" cy="45" r="1.8" fill="white" />
      <circle cx="58" cy="45" r="1.8" fill="white" />
      <circle cx="39" cy="49" r="0.8" fill="white" />
      <circle cx="55" cy="49" r="0.8" fill="white" />

      {/* nose */}
      <ellipse cx="48" cy="55" rx="2.8" ry="1.8" fill="#fb7185" />

      {/* little hopeful smile */}
      <path d="M 43 59 Q 48 64 53 59" fill="none" stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" />

      {/* tail peeping out at back */}
      <circle cx="70" cy="80" r="8" fill="white" />
    </svg>
  )
}
