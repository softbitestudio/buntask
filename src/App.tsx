import { useState, useCallback } from 'react'
import type { Task } from './types'
import { TaskInput } from './components/TaskInput'
import { BunnyCard } from './components/BunnyCard'
import { Meadow } from './components/Meadow'

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [tooFewWarning, setTooFewWarning] = useState(false)

  const addTask = useCallback((label: string) => {
    setTasks(prev => [
      ...prev,
      { id: crypto.randomUUID(), label, state: 'trapped', createdAt: Date.now() },
    ])
  }, [])

  const completeTask = useCallback((id: string) => {
    const pendingCount = tasks.filter(t => t.state === 'trapped').length
    if (pendingCount < 2) {
      setTooFewWarning(true)
      setTimeout(() => setTooFewWarning(false), 2000)
      return
    }

    setTasks(prev => prev.map(t => t.id === id ? { ...t, state: 'breaking' } : t))

    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, state: 'dancing' } : t))
    }, 600)

    setTimeout(() => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, state: 'roaming' } : t))
    }, 1800)
  }, [tasks])

  const pendingCount   = tasks.filter(t => t.state === 'trapped').length
  const visibleTasks   = tasks.filter(t => t.state !== 'roaming')
  const roamingTasks   = tasks.filter(t => t.state === 'roaming')
  const completedCount = roamingTasks.length

  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="pt-10 pb-6 text-center">
        <h1 className="text-5xl font-extrabold text-green-700 tracking-tight drop-shadow-sm">
          🐇 BunTask
        </h1>
        <p className="mt-1 text-green-600 text-lg font-medium">
          A BunTask is a Done Task!
        </p>
        {completedCount > 0 && (
          <p className="mt-1 text-green-500 text-sm">
            {completedCount} {completedCount === 1 ? 'bunny' : 'bunnies'} free in the meadow 🌿
          </p>
        )}
      </header>

      {/* main content */}
      <main className="flex-1 px-4 pb-8">
        <TaskInput onAdd={addTask} taskCount={tasks.length} />

        {tooFewWarning && (
          <div className="max-w-xl mx-auto mt-3 px-4 py-2 bg-rose-100 border border-rose-300 text-rose-700 rounded-xl text-sm text-center">
            Your bunny needs at least one companion before it can be freed! 🐇
          </div>
        )}

        {visibleTasks.length > 0 && (
          <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {visibleTasks.map(task => (
              <BunnyCard
                key={task.id}
                task={task}
                onComplete={completeTask}
                canComplete={pendingCount >= 2}
              />
            ))}
          </section>
        )}

        {tasks.length === 0 && (
          <div className="mt-16 text-center text-green-600/70">
            <p className="text-6xl mb-4">🐇</p>
            <p className="text-lg font-medium">No tasks yet!</p>
            <p className="text-sm">Add some tasks above to populate the meadow.</p>
          </div>
        )}
      </main>

      {/* meadow — always visible at the bottom */}
      <Meadow roamingTasks={roamingTasks} />
    </div>
  )
}
