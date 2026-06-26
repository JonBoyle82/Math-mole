import { useState, useCallback } from 'react'
import PizzaFraction from './PizzaFraction'
import Confetti from './Confetti'
import { FRACTION_TIERS, getExplanation } from '../data/fractions'

function pickPuzzle(tier) {
  const t = FRACTION_TIERS.find(t => t.id === tier) || FRACTION_TIERS[0]
  return t.puzzles[Math.floor(Math.random() * t.puzzles.length)]
}

function getOptions(puzzle) {
  const correct = puzzle.options.filter(o => o.correct)
  const wrong = puzzle.options.filter(o => !o.correct)
  const shuffle = arr => [...arr].sort(() => Math.random() - 0.5)
  // 1 correct + 4 wrong (enough wrong options to not repeat)
  const chosen = [...shuffle(correct).slice(0, 1), ...shuffle(wrong).slice(0, 4)]
  // Attach a stable random rotation to each option so equivalent fractions
  // don't look identical — forces counting slices rather than pattern-matching
  return shuffle(chosen).map(opt => ({
    ...opt,
    rotation: Math.floor(Math.random() * 12) * 30, // multiples of 30° to stay clean
  }))
}

export default function FractionsGame({ gameData, navigate }) {
  const { data, handleFractionResult } = gameData
  const [tier, setTier] = useState('tier1')
  const [puzzle, setPuzzle] = useState(() => pickPuzzle('tier1'))
  const [options, setOptions] = useState(() => getOptions(pickPuzzle('tier1')))
  const [selected, setSelected] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [explanation, setExplanation] = useState('')

  const nextPuzzle = useCallback((newTier) => {
    const t = newTier || tier
    const p = pickPuzzle(t)
    setPuzzle(p)
    setOptions(getOptions(p))
    setSelected(null)
    setExplanation('')
  }, [tier])

  const handleSelect = useCallback((opt, idx) => {
    if (selected !== null) return
    setSelected(idx)
    handleFractionResult(tier, opt.correct)
    if (opt.correct) {
      setShowConfetti(true)
      setExplanation(getExplanation(puzzle.target, opt))
      setTimeout(() => setShowConfetti(false), 1500)
    } else {
      setExplanation(`Not quite! Count the orange slices carefully — find the one that matches ${puzzle.target.num}/${puzzle.target.den} 🍕`)
    }
  }, [selected, puzzle, tier, handleFractionResult])

  const changeTier = (t) => {
    setTier(t)
    nextPuzzle(t)
  }

  const isAnswered = selected !== null
  const selectedOpt = selected !== null ? options[selected] : null

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-6 gap-4">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <button onClick={() => navigate('home')} className="bg-white rounded-2xl px-4 py-2 shadow text-pink-700 font-bold active:scale-95 transition-transform">
          ← Home
        </button>
        <div className="flex gap-2">
          <span className="bg-yellow-100 text-yellow-700 rounded-xl px-3 py-1 font-bold text-sm">⭐ {data.points}</span>
          <span className="bg-orange-100 text-orange-700 rounded-xl px-3 py-1 font-bold text-sm">🔥 {data.streak}</span>
        </div>
      </div>

      <h2 className="font-fun text-3xl text-pink-600">Pizza Match! 🍕</h2>

      {/* Tier selector */}
      <div className="flex gap-2">
        {FRACTION_TIERS.map(t => (
          <button
            key={t.id}
            onClick={() => changeTier(t.id)}
            className={`px-4 py-2 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
              tier === t.id
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-pink-700 border-2 border-pink-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Target pizza — label always shown, no rotation */}
      <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center gap-3 w-full">
        <p className="font-bold text-gray-600 text-sm">Find a pizza that shows the same amount as...</p>
        <PizzaFraction num={puzzle.target.num} den={puzzle.target.den} size={130} highlighted showLabel />
        <p className="font-fun text-3xl text-pink-600">{puzzle.target.num}/{puzzle.target.den}</p>
      </div>

      {/* Hint strip */}
      {!isAnswered && (
        <p className="text-xs text-gray-400 font-semibold text-center">
          Count the orange slices — labels hidden to make you think! 🧠
        </p>
      )}

      {/* Options — rotated, labels hidden until answered */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {options.map((opt, i) => {
          let correct = null
          if (isAnswered) {
            if (i === selected) correct = opt.correct
            else if (opt.correct) correct = true
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(opt, i)}
              disabled={isAnswered}
              className={`bg-white rounded-2xl p-3 flex flex-col items-center shadow-md active:scale-95 transition-transform border-2 ${
                isAnswered && i === selected && !opt.correct ? 'border-orange-400' :
                isAnswered && opt.correct ? 'border-green-400' :
                'border-transparent'
              }`}
              style={{ minHeight: 60 }}
            >
              <PizzaFraction
                num={opt.num}
                den={opt.den}
                size={80}
                correct={correct}
                selected={i === selected}
                rotate={opt.rotation}
                showLabel={isAnswered}
              />
            </button>
          )
        })}
      </div>

      {/* Explanation */}
      {explanation && (
        <div className={`rounded-3xl p-4 w-full animate-pop-in ${
          selectedOpt?.correct ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50 border-2 border-blue-200'
        }`}>
          <p className={`font-bold text-sm ${selectedOpt?.correct ? 'text-green-700' : 'text-blue-700'}`}>
            {selectedOpt?.correct ? '🎉 ' : '💡 '}{explanation}
          </p>
          {isAnswered && (
            <button
              onClick={() => nextPuzzle()}
              className="mt-3 w-full bg-pink-500 text-white rounded-2xl py-3 font-fun text-xl active:scale-95 transition-transform shadow"
            >
              Next Pizza! →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
