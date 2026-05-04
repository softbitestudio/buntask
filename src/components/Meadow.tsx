import type { Task } from '../types'
import { BunnyRoaming } from '../assets/bunnies/BunnyRoaming'

interface Props {
  roamingTasks: Task[]
}

const STRAWBERRY_POSITIONS = [8, 18, 32, 48, 58, 72, 84, 93]
const STRAWBERRY_DELAYS    = [0, 0.6, 1.2, 0.3, 0.9, 1.5, 0.4, 1.1]

export function Meadow({ roamingTasks }: Props) {
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '180px' }}>
      {/* sky strip */}
      <div className="w-full h-8 bg-sky-200" />

      {/* ground */}
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

        {roamingTasks.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-green-700/60 text-sm font-medium pointer-events-none">
            Complete tasks to free your bunnies into the meadow! 🌿
          </p>
        )}
      </div>
    </div>
  )
}
