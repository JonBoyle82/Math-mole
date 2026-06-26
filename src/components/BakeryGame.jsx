import { useState, useCallback } from 'react'
import MeasuringCup from './MeasuringCup'
import Confetti from './Confetti'
import { BAKERY_TIERS, pickBakeryPuzzle, buildBakeryCups, fractionSumEquals, getBakeryExplanation } from '../data/bakery'

export default function BakeryGame({ gameData, navigate }) {
  const { data, handleFractionSumResult } = gameData
  const [tierId, setTierId] = useState('tier1')
  const [puzzle, setPuzzle] = useState(() => pickBakeryPuzzle('tier1'))
  const [cups, setCups] = useState(() => buildBakeryCups(pickBakeryPuzzle('tier1')))
  const [firstPick, setFirstPick] = useState(null)   // index into cups[]
  const [result, setResult] = useState(null)          // null | 'correct' | 'wrong'
  const [correctIndices, setCorrectIndices] = useState([])
  const [explanation, setExplanation] = useState('')
  const [showConfetti, setShowConfetti] = useState(false)

  const nextPuzzle = useCallback((newTierId) => {
    const tid = newTierId || tierId
    const p = pickBakeryPuzzle(tid)
    setPuzzle(p)
    setCups(buildBakeryCups(p))
    setFirstPick(null)
    setResult(null)
    setCorrectIndices([])
    setExplanation('')
  }, [tierId])

  const changeTier = (tid) => {
    setTierId(tid)
    nextPuzzle(tid)
  }

  const handleCupTap = useCallback((idx) => {
    if (result !== null) return

    if (firstPick === null) {
      // First selection
      setFirstPick(idx)
      return
    }

    if (firstPick === idx) {
      // Deselect
      setFirstPick(null)
      return
    }

    // Second selection — evaluate
    const a = cups[firstPick]
    const b = cups[idx]
    const correct = fractionSumEquals(a, b, puzzle.target)

    if (correct) {
      setResult('correct')
      setCorrectIndices([firstPick, idx])
      setShowConfetti(true)
      setExplanation(getBakeryExplanation(a, b))
      handleFractionSumResult(tierId, true)
      setTimeout(() => setShowConfetti(false), 1500)
    } else {
      // Find a correct pair to highlight
      const correctPair = findCorrectPair(cups, puzzle.target)
      setResult('wrong')
      setCorrectIndices(correctPair)
      setExplanation(`Not quite — but keep going! Look for two cups that fill up to ${puzzle.target.num}/${puzzle.target.den} together. 💪`)
      handleFractionSumResult(tierId, false)
      setTimeout(() => nextPuzzle(), 2500)
    }
  }, [result, firstPick, cups, puzzle, tierId, handleFractionSumResult, nextPuzzle])

  function findCorrectPair(cupList, target) {
    for (let i = 0; i < cupList.length; i++) {
      for (let j = i + 1; j < cupList.length; j++) {
        if (fractionSumEquals(cupList[i], cupList[j], target)) return [i, j]
      }
    }
    return []
  }

  function getCupState(idx) {
    if (result === 'correct' && correctIndices.includes(idx)) return 'correct'
    if (result === 'wrong' && correctIndices.includes(idx)) return 'revealed'
    if (result === 'wrong' && (idx === firstPick)) return 'wrong'
    return null
  }

  if (!puzzle) return null

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-6 gap-4">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => navigate('home')}
          className="bg-white rounded-2xl px-4 py-2 shadow text-orange-700 font-bold active:scale-95 transition-transform"
        >
          ← Home
        </button>
        <div className="flex gap-2">
          <span className="bg-yellow-100 text-yellow-700 rounded-xl px-3 py-1 font-bold text-sm">⭐ {data.points}</span>
          <span className="bg-orange-100 text-orange-700 rounded-xl px-3 py-1 font-bold text-sm">🔥 {data.streak}</span>
        </div>
      </div>

      <h2 className="font-fun text-3xl text-orange-600">Fraction Bakery 🧁</h2>

      {/* Tier selector */}
      <div className="flex gap-2">
        {BAKERY_TIERS.map(t => (
          <button
            key={t.id}
            onClick={() => !t.comingSoon && changeTier(t.id)}
            disabled={t.comingSoon}
            className={`px-3 py-2 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
              t.comingSoon
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : tierId === t.id
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-orange-700 border-2 border-orange-200'
            }`}
          >
            {t.comingSoon ? `🔒 ${t.label}` : t.label}
          </button>
        ))}
      </div>

      {/* Order ticket — target */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-orange-200 rounded-3xl p-4 w-full flex flex-col items-center gap-2">
        <p className="font-bold text-orange-700 text-sm">🧾 Fill the order — you need exactly:</p>
        <div className="flex items-center gap-4">
          <MeasuringCup num={puzzle.target.num} den={puzzle.target.den} size={90} highlighted />
          <div className="text-center">
            <p className="font-fun text-4xl text-orange-600">
              {puzzle.target.num}/{puzzle.target.den}
            </p>
            <p className="text-xs text-orange-500 font-semibold">cup of flour</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold mt-1">Tap TWO cups that add up to this amount</p>
      </div>

      {/* First pick indicator */}
      {firstPick !== null && result === null && (
        <div className="bg-purple-100 text-purple-700 rounded-2xl px-4 py-2 font-bold text-sm animate-pop-in w-full text-center">
          ✅ {cups[firstPick].num}/{cups[firstPick].den} selected — now pick a second cup!
        </div>
      )}

      {/* Cup grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {cups.map((cup, i) => {
          const state = getCupState(i)
          const isSelected = firstPick === i && result === null
          const isCorrectState = state === 'correct'
          const isRevealedState = state === 'revealed'
          const isWrongState = state === 'wrong'

          return (
            <button
              key={i}
              onClick={() => handleCupTap(i)}
              disabled={result !== null}
              className={`
                bg-white rounded-2xl p-2 flex flex-col items-center shadow-md
                transition-transform active:scale-90 border-2
                ${isSelected ? 'border-purple-400 bg-purple-50 scale-105' : ''}
                ${isCorrectState ? 'border-green-400 bg-green-50' : ''}
                ${isRevealedState ? 'border-green-300 bg-green-50' : ''}
                ${isWrongState ? 'border-orange-400 bg-orange-50' : ''}
                ${!isSelected && state === null ? 'border-transparent' : ''}
              `}
              style={{ minHeight: 60 }}
            >
              <MeasuringCup
                num={cup.num}
                den={cup.den}
                size={78}
                selected={isSelected}
                correct={isCorrectState ? true : isWrongState ? false : isRevealedState ? true : null}
              />
            </button>
          )
        })}
      </div>

      {/* Explanation / feedback */}
      {explanation && (
        <div className={`rounded-3xl p-4 w-full animate-pop-in ${
          result === 'correct'
            ? 'bg-green-50 border-2 border-green-200'
            : 'bg-blue-50 border-2 border-blue-200'
        }`}>
          <p className={`font-bold text-sm ${result === 'correct' ? 'text-green-700' : 'text-blue-700'}`}>
            {result === 'correct' ? '🎉 ' : '💡 '}{explanation}
          </p>
          {result === 'correct' && (
            <button
              onClick={() => nextPuzzle()}
              className="mt-3 w-full bg-orange-500 text-white rounded-2xl py-3 font-fun text-xl active:scale-95 transition-transform shadow"
            >
              Next Order! →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
