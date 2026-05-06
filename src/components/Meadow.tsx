import type { Task } from '../types'
import { BunnyRoaming } from '../assets/bunnies/BunnyPlaceholder'
import { InteractiveBunny } from './InteractiveBunny'

interface Props {
  roamingTasks: Task[]
  interactiveTasks: Task[]
  onRelease: (id: string) => void
}

const STRAWBERRY_POSITIONS = [8, 18, 32, 48, 58, 72, 84, 93]
const STRAWBERRY_DELAYS    = [0, 0.6, 1.2, 0.3, 0.9, 1.5, 0.4, 1.1]

export function Meadow({ roamingTasks, interactiveTasks, onRelease }: Props) {
  const hasInteractive = interactiveTasks.length > 0

  return (
    <div className="relative w-full overflow-hidden">
      {/* ── Reward zone: interactive bunnies ── */}
      {hasInteractive && (
        <div className="relative bg-gradient-to-b from-yellow-50 to-lime-50 border-t-2 border-yellow-200 py-5 px-4">
          <p className="text-center text-yellow-700 font-semibold text-sm mb-4">
            🌟 Reward time! Your bunny wants to say thank you!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {interactiveTasks.map(task => (
              <InteractiveBunny key={task.id} task={task} onRelease={onRelease} />
            ))}
          </div>
        </div>
      )}

      {/* ── Sky strip ── */}
      <div className="w-full h-8 bg-sky-200" />

      {/* ── Green meadow ── */}
      <div
        className="relative w-full"
        style={{
          minHeight: '150px',
          background: 'linear-gradient(to bottom, #86efac 0%, #4ade80 40%, #16a34a 100%)',
        }}
      >
        {/* decorative strawberries */}
        {STRAWBERRY_POSITIONS.map((left, i) => (
          <span
            key={i}
            className="strawberry-deco select-none"
            style={{
              left: `${left}%`,
              bottom: `${10 + (i % 3) * 8}px`,
              animationDelay: `${STRAWBERRY_DELAYS[i]}s`,
            }}
          >
            🍓
          </span>
        ))}

        {/* roaming bunnies */}
        {roamingTasks.map((task, i) => (
          <div
            key={task.id}
            className="bunny-roaming-wrap"
            style={{
              animationDuration: `${12 + i * 3.5}s`,
              animationDelay: `${-i * 2.8}s`,
              bottom: `${24 + (i % 3) * 14}px`,
            }}
          >
            <BunnyRoaming />
          </div>
        ))}

        {roamingTasks.length === 0 && !hasInteractive && (
          <p className="absolute inset-0 flex items-center justify-center text-green-700/60 text-sm font-medium pointer-events-none">
            Complete tasks to free your bunnies into the meadow! 🌿
          </p>
        )}
      </div>
    </div>
  )
}
