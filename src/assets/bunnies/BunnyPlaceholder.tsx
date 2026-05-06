import type { BunnyState } from '../../types'

const STATE_STYLE: Record<BunnyState, { bg: string; border: string; emoji: string; label: string }> = {
  trapped:     { bg: '#fff1f2', border: '#fda4af', emoji: '🐇', label: 'trapped'     },
  breaking:    { bg: '#fffbeb', border: '#fcd34d', emoji: '🐇', label: 'breaking'    },
  dancing:     { bg: '#f0fdf4', border: '#86efac', emoji: '🐇', label: 'dancing'     },
  interactive: { bg: '#fefce8', border: '#fde047', emoji: '🐇', label: 'interactive' },
  roaming:     { bg: '#f0fdf4', border: '#4ade80', emoji: '🐇', label: 'roaming'     },
}

interface Props {
  state: BunnyState
  className?: string
}

function BunnyPlaceholder({ state, className }: Props) {
  const s = STATE_STYLE[state]
  return (
    <div
      className={`bunny-svg flex flex-col items-center justify-center gap-1 rounded-2xl select-none ${className ?? ''}`}
      style={{
        width: 90,
        height: 108,
        background: s.bg,
        border: `2px dashed ${s.border}`,
      }}
    >
      <span style={{ fontSize: 36 }}>{s.emoji}</span>
      <span style={{ fontSize: 10, color: '#9ca3af', fontFamily: 'monospace' }}>{s.label}</span>
    </div>
  )
}

export const BunnyTrapped     = (p: { className?: string }) => <BunnyPlaceholder state="trapped"     {...p} />
export const BunnyBreaking    = (p: { className?: string }) => <BunnyPlaceholder state="breaking"    {...p} />
export const BunnyDancing     = (p: { className?: string }) => <BunnyPlaceholder state="dancing"     {...p} />
export const BunnyInteractive = (p: { className?: string }) => <BunnyPlaceholder state="interactive" {...p} />
export const BunnyRoaming     = (p: { className?: string }) => <BunnyPlaceholder state="roaming"     {...p} />
