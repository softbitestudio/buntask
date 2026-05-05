import type { Task, BunnyState } from '../types'
import { BunnyTrapped, BunnyBreaking, BunnyDancing, BunnyRoaming, BunnyInteractive } from '../assets/bunnies/BunnyPlaceholder'
import type { ComponentType } from 'react'

interface BunnySVGProps { className?: string }

const BUNNY_MAP: Record<BunnyState, ComponentType<BunnySVGProps>> = {
  trapped:     BunnyTrapped,
  breaking:    BunnyBreaking,
  dancing:     BunnyDancing,
  interactive: BunnyInteractive,
  roaming:     BunnyRoaming,
}

interface Props {
  task: Task
  onComplete: (id: string) => void
  canComplete: boolean
}

const STATE_BG: Record<BunnyState, string> = {
  trapped:  'bg-rose-50   border-rose-200',
  breaking: 'bg-amber-50  border-amber-300',
  dancing:     'bg-green-50  border-green-300',
  interactive: 'bg-yellow-50 border-yellow-300',
  roaming:     'bg-white     border-gray-200',
}

export function BunnyCard({ task, onComplete, canComplete }: Props) {
  const BunnySVG = BUNNY_MAP[task.state]
  const isDone = task.state === 'roaming'
  const isPending = task.state === 'trapped'

  return (
    <div
      className={[
        'relative rounded-3xl border-2 p-5 flex flex-col items-center gap-3 shadow-sm transition-all duration-500',
        STATE_BG[task.state],
        task.state === 'breaking' ? 'card-breaking' : '',
        task.state === 'dancing'  ? 'card-dancing'  : '',
        isDone ? 'opacity-60 scale-95' : '',
      ].join(' ')}
    >
      {/* dancing stars */}
      {task.state === 'dancing' && (
        <>
          <span className="dancing-star">✦</span>
          <span className="dancing-star">✦</span>
          <span className="dancing-star">✦</span>
        </>
      )}

      <p className="font-semibold text-gray-700 text-center text-base leading-snug">
        {task.label}
      </p>

      <div className={`bunny-${task.state}`}>
        <BunnySVG />
      </div>

      {isPending && (
        <button
          onClick={() => onComplete(task.id)}
          disabled={!canComplete}
          title={!canComplete ? 'Add one more task first!' : ''}
          className="mt-1 px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-sm shadow-sm transition-colors"
        >
          Free this bunny! 🐇
        </button>
      )}

      {task.state === 'dancing' && (
        <p className="text-green-600 font-semibold text-sm animate-bounce">Yay! Bunny is free! 🎉</p>
      )}

      {isDone && (
        <p className="text-gray-400 text-xs">Roaming the meadow 🌿</p>
      )}
    </div>
  )
}
