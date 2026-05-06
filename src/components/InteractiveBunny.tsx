import { useState, useEffect, useRef, useCallback } from 'react'
import type { Task } from '../types'
import { BunnyInteractive } from '../assets/bunnies/BunnyPlaceholder'

const REWARD_SECONDS = 30
const MAX_PETS = 4
const MAX_FEEDS = 2

interface Props {
  task: Task
  onRelease: (id: string) => void
}

interface FloatingReaction {
  id: number
  type: 'heart' | 'berry'
}

export function InteractiveBunny({ task, onRelease }: Props) {
  const [timeLeft, setTimeLeft] = useState(REWARD_SECONDS)
  const [petCount, setPetCount] = useState(0)
  const [feedCount, setFeedCount] = useState(0)
  const [reactions, setReactions] = useState<FloatingReaction[]>([])
  const [bunnyClass, setBunnyClass] = useState('')
  const [releasing, setReleasing] = useState(false)
  const reactionKey = useRef(0)

  useEffect(() => {
    if (timeLeft <= 0) {
      handleRelease()
      return
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft])

  const addReaction = useCallback((type: 'heart' | 'berry') => {
    const id = ++reactionKey.current
    setReactions(prev => [...prev, { id, type }])
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 1000)
  }, [])

  const triggerBunnyAnim = useCallback((cls: string) => {
    setBunnyClass(cls)
    setTimeout(() => setBunnyClass(''), 600)
  }, [])

  function handlePet() {
    if (petCount >= MAX_PETS) return
    setPetCount(c => c + 1)
    addReaction('heart')
    triggerBunnyAnim('bunny-squish')
  }

  function handleFeed() {
    if (feedCount >= MAX_FEEDS) return
    setFeedCount(c => c + 1)
    addReaction('berry')
    triggerBunnyAnim('bunny-nibble')
  }

  function handleRelease() {
    if (releasing) return
    setReleasing(true)
    setTimeout(() => onRelease(task.id), 650)
  }

  const petsLeft  = MAX_PETS  - petCount
  const feedsLeft = MAX_FEEDS - feedCount
  const timerPct  = (timeLeft / REWARD_SECONDS) * 100

  return (
    <div className="bunny-interactive-wrap flex flex-col items-center gap-3 bg-white/70 backdrop-blur rounded-3xl border-2 border-yellow-300 shadow-lg px-5 py-4 w-48">
      <p className="text-xs font-semibold text-green-700 text-center leading-tight">
        ✨ {task.label}
      </p>

      {/* bunny + floating reactions */}
      <div className={`bunny-interactive relative`}>
        <div className={bunnyClass}>
          <BunnyInteractive />
        </div>

        {reactions.map(r => (
          r.type === 'heart'
            ? <span key={r.id} className="heart-float">💖</span>
            : <span key={r.id} className="berry-fly" style={{ left: '55%', top: '40%' }}>🍓</span>
        ))}
      </div>

      {/* action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handlePet}
          disabled={petsLeft <= 0}
          title={petsLeft <= 0 ? 'No more pets left!' : `Pet (${petsLeft} left)`}
          className="flex flex-col items-center px-3 py-2 rounded-xl bg-pink-100 hover:bg-pink-200 disabled:opacity-40 disabled:cursor-not-allowed text-pink-700 text-xs font-semibold transition-colors gap-0.5"
        >
          <span className="text-lg">🤚</span>
          <span>{petsLeft > 0 ? `×${petsLeft}` : '✓'}</span>
        </button>
        <button
          onClick={handleFeed}
          disabled={feedsLeft <= 0}
          title={feedsLeft <= 0 ? 'All fed!' : `Feed strawberry (${feedsLeft} left)`}
          className="flex flex-col items-center px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 disabled:opacity-40 disabled:cursor-not-allowed text-red-700 text-xs font-semibold transition-colors gap-0.5"
        >
          <span className="text-lg">🍓</span>
          <span>{feedsLeft > 0 ? `×${feedsLeft}` : '✓'}</span>
        </button>
      </div>

      {/* countdown bar */}
      <div className="w-full">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-linear"
            style={{
              width: `${timerPct}%`,
              background: timerPct > 50 ? '#4ade80' : timerPct > 20 ? '#fbbf24' : '#f87171',
            }}
          />
        </div>
        <p className="text-center text-gray-400 text-xs mt-0.5">{timeLeft}s</p>
      </div>

      <button
        onClick={handleRelease}
        disabled={releasing}
        className="text-xs text-green-600 hover:text-green-800 underline transition-colors"
      >
        Off you go! 🌿
      </button>
    </div>
  )
}
