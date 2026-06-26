import { useState, useEffect } from 'react'

const MOLE_STATES = {
  idle: '🦔',
  correct: '🤩',
  wrong: '😵',
  revealed: '👆',
}

export default function MoleHole({ value, onClick, state, cosmetic = 'default', delay = 0 }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  const idleColors = {
    default:  'bg-amber-400 border-amber-600',
    ocean:    'bg-blue-400 border-blue-600',
    blossom:  'bg-pink-400 border-pink-600',
    forest:   'bg-green-500 border-green-700',
    galaxy:   'bg-purple-400 border-purple-600',
    sunset:   'bg-orange-400 border-red-500',
    arctic:   'bg-cyan-300 border-blue-500',
    lava:     'bg-red-500 border-red-700',
    midnight: 'bg-indigo-600 border-indigo-900',
    crown:    'bg-yellow-400 border-amber-500',
  }

  const bgColor = state === 'correct'
    ? 'bg-green-400 border-green-600'
    : state === 'wrong'
    ? 'bg-orange-300 border-orange-500'
    : state === 'revealed'
    ? 'bg-green-300 border-green-500'
    : idleColors[cosmetic] || idleColors.default

  const emoji = state ? MOLE_STATES[state] || MOLE_STATES.idle : MOLE_STATES.idle

  const animClass = state === 'correct'
    ? 'animate-pop-in'
    : state === 'wrong'
    ? 'animate-dazed'
    : visible
    ? 'animate-mole-rise'
    : 'opacity-0'

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={onClick}
        disabled={!!state}
        className={`
          relative rounded-full border-4 flex flex-col items-center justify-center
          shadow-lg active:scale-90 transition-transform select-none
          ${bgColor} ${animClass}
        `}
        style={{ width: 70, height: 70, minWidth: 70, minHeight: 70 }}
      >
        <span className="text-2xl leading-none">{emoji}</span>
        <span className="font-fun text-white text-lg font-bold leading-tight drop-shadow">{value}</span>
      </button>
      {/* hole */}
      <div className="w-14 h-3 bg-amber-900 rounded-full opacity-40" />
    </div>
  )
}
