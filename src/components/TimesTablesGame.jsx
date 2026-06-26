import { useState, useEffect, useCallback, useRef } from 'react'
import MoleHole from './MoleHole'
import Confetti from './Confetti'
import { getFactAccuracy } from '../utils/storage'
import { getMnemonic } from '../data/mnemonics'

// Weighted random question selection — prefer facts with low accuracy
function pickQuestion(factAccuracy) {
  const facts = []
  for (let a = 1; a <= 12; a++) {
    for (let b = a; b <= 12; b++) {
      const key = `${a}x${b}`
      const d = factAccuracy[key]
      const accuracy = d && d.attempts > 0 ? d.correct / d.attempts : 0
      // Weight: unseen/wrong facts get higher weight
      const weight = d ? Math.max(1, 5 - Math.floor(accuracy * 5)) : 5
      facts.push({ a, b, weight })
    }
  }
  const totalWeight = facts.reduce((s, f) => s + f.weight, 0)
  let r = Math.random() * totalWeight
  for (const f of facts) {
    r -= f.weight
    if (r <= 0) return f
  }
  return facts[0]
}

// Generate near-miss decoys
function generateDecoys(a, b, count) {
  const correct = a * b
  const decoys = new Set()

  // Neighboring multiples
  for (let delta of [-2, -1, 1, 2]) {
    const v = correct + delta * a
    if (v > 0 && v !== correct) decoys.add(v)
    const v2 = correct + delta * b
    if (v2 > 0 && v2 !== correct) decoys.add(v2)
  }
  // Common mistakes: swap digits, off-by-one
  decoys.add(correct + 1)
  decoys.add(correct - 1)
  decoys.add((a + 1) * b)
  decoys.add(a * (b + 1))
  decoys.add(a * b + a)
  decoys.add(a * b - b)

  const arr = [...decoys].filter(v => v > 0 && v !== correct && v <= 144)
  // Shuffle and take `count`
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, count)
}

function buildHoles(a, b) {
  const correct = a * b
  const decoyCount = 8 // 9 total holes including correct
  const decoys = generateDecoys(a, b, decoyCount)
  const all = [{ value: correct, isCorrect: true }, ...decoys.map(v => ({ value: v, isCorrect: false }))]
  // Shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }
  return all
}

export default function TimesTablesGame({ gameData, navigate }) {
  const { data, handleFactResult } = gameData
  const [question, setQuestion] = useState(null)
  const [holes, setHoles] = useState([])
  const [holeStates, setHoleStates] = useState({})
  const [showMnemonic, setShowMnemonic] = useState(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)

  const nextQuestion = useCallback(() => {
    const acc = getFactAccuracy()
    const q = pickQuestion(acc)
    const h = buildHoles(q.a, q.b)
    setQuestion(q)
    setHoles(h)
    setHoleStates({})
    setShowMnemonic(null)
    setFeedbackMsg('')
    setIsAnimating(false)
  }, [])

  useEffect(() => { nextQuestion() }, [])

  const handleHoleTap = useCallback((idx, hole) => {
    if (isAnimating || Object.keys(holeStates).length > 0) return
    setIsAnimating(true)

    if (hole.isCorrect) {
      setHoleStates({ [idx]: 'correct' })
      setShowConfetti(true)
      const result = handleFactResult(question.a, question.b, true)
      const streakMsg = result.streak >= 3 ? ` 🔥 ${result.streak} streak!` : ''
      setFeedbackMsg(`✨ ${question.a} × ${question.b} = ${question.a * question.b}!${streakMsg}`)
      const mnemonic = getMnemonic(Math.min(question.a, question.b))
      setShowMnemonic(mnemonic)
      setTimeout(() => setShowConfetti(false), 1500)
    } else {
      // Find correct hole index
      const correctIdx = holes.findIndex(h => h.isCorrect)
      setHoleStates({ [idx]: 'wrong', [correctIdx]: 'revealed' })
      handleFactResult(question.a, question.b, false)
      setFeedbackMsg(`Keep going! ${question.a} × ${question.b} = ${question.a * question.b} 💪`)
      setTimeout(() => {
        nextQuestion()
      }, 2000)
    }
  }, [isAnimating, holeStates, holes, question, handleFactResult, nextQuestion])

  const handleNextAfterCorrect = () => {
    nextQuestion()
  }

  if (!question) return null

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-6 gap-4 min-h-screen">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => navigate('home')}
          className="bg-white rounded-2xl px-4 py-2 shadow text-purple-700 font-bold active:scale-95 transition-transform"
        >
          ← Home
        </button>
        <div className="flex gap-2">
          <span className="bg-yellow-100 text-yellow-700 rounded-xl px-3 py-1 font-bold text-sm">⭐ {data.points}</span>
          <span className="bg-orange-100 text-orange-700 rounded-xl px-3 py-1 font-bold text-sm">🔥 {data.streak}</span>
        </div>
        <button
          onClick={() => navigate('board')}
          className="bg-white rounded-2xl px-4 py-2 shadow text-purple-700 font-bold text-sm active:scale-95 transition-transform"
        >
          📊 Board
        </button>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow-xl px-8 py-5 text-center w-full">
        <p className="text-gray-500 font-semibold text-sm mb-1">What is...</p>
        <p className="font-fun text-5xl text-purple-700">
          {question.a} × {question.b} = ?
        </p>
      </div>

      {/* Feedback message */}
      {feedbackMsg && (
        <div className={`rounded-2xl px-4 py-2 font-bold text-center text-sm animate-pop-in w-full ${
          Object.values(holeStates)[0] === 'correct'
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {feedbackMsg}
        </div>
      )}

      {/* Mole holes grid */}
      <div className="grid grid-cols-3 gap-3 w-full mt-2">
        {holes.map((hole, i) => (
          <div key={i} className="flex justify-center">
            <MoleHole
              value={hole.value}
              onClick={() => handleHoleTap(i, hole)}
              state={holeStates[i] || null}
              cosmetic={data.activeCosmetic}
              delay={i * 60}
            />
          </div>
        ))}
      </div>

      {/* Mnemonic card shown on correct answer */}
      {showMnemonic && (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-purple-200 rounded-3xl p-4 w-full animate-pop-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{showMnemonic.emoji}</span>
            <span className="font-bold text-purple-700">Memory Trick!</span>
          </div>
          <p className="text-gray-700 text-sm font-semibold">{showMnemonic.trick}</p>
          <p className="text-purple-600 text-sm mt-1 font-mono">{showMnemonic.example}</p>
          <button
            onClick={handleNextAfterCorrect}
            className="mt-3 w-full bg-purple-600 text-white rounded-2xl py-3 font-fun text-xl active:scale-95 transition-transform shadow-md"
          >
            Next Question! →
          </button>
        </div>
      )}
    </div>
  )
}
