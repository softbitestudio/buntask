import { useState } from 'react'

interface Props {
  onAdd: (label: string) => void
  taskCount: number
}

export function TaskInput({ onAdd, taskCount }: Props) {
  const [value, setValue] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue('')
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="What needs doing? 🐇"
          className="flex-1 px-4 py-3 rounded-2xl border-2 border-green-300 bg-white/80 backdrop-blur text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-500 text-lg shadow-sm"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="px-6 py-3 rounded-2xl bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold text-lg shadow-sm transition-colors"
        >
          Add
        </button>
      </form>

      {taskCount < 2 && taskCount > 0 && (
        <p className="mt-2 text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          Add one more task — bunnies need a friend before they can be freed! 🐇
        </p>
      )}

      {taskCount === 0 && (
        <p className="mt-2 text-center text-sm text-green-700">
          Add at least 2 tasks to start freeing your bunnies 🌿
        </p>
      )}
    </div>
  )
}
