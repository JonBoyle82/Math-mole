import { useState, useCallback, useEffect } from 'react'
import MoleHole from './MoleHole'
import PercentageGrid from './PercentageGrid'
import Confetti from './Confetti'
import {
  MART_TIERS, pickMartPuzzle, buildMartHoles,
  EQUIVALENTS, PERCENT_TRICKS, REVERSE_TRICK,
} from '../data/percentages'

// All candidate grid shapes. Scattered = filled cells are random, not top-left.
const GRID_SHAPES = [
  { rows: 10, cols: 10, scattered: false, label: '100 squares' },
  { rows: 10, cols: 10, scattered: true,  label: '100 squares' },
  { rows: 5,  cols: 4,  scattered: false, label: '20 squares'  },
  { rows: 5,  cols: 4,  scattered: true,  label: '20 squares'  },
  { rows: 4,  cols: 5,  scattered: false, label: '20 squares'  },
  { rows: 4,  cols: 5,  scattered: true,  label: '20 squares'  },
  { rows: 2,  cols: 5,  scattered: false, label: '10 squares'  },
  { rows: 2,  cols: 5,  scattered: true,  label: '10 squares'  },
  { rows: 1,  cols: 10, scattered: false, label: '10 squares'  },
  { rows: 2,  cols: 10, scattered: false, label: '20 squares'  },
  { rows: 2,  cols: 10, scattered: true,  label: '20 squares'  },
]

function pickGridConfig(pct) {
  const valid = GRID_SHAPES.filter(s => {
    const total = s.rows * s.cols
    return Number.isInteger(pct * total / 100)
  })
  const shape = valid[Math.floor(Math.random() * valid.length)]
  const total = shape.rows * shape.cols
  const filledCount = Math.round(pct * total / 100)

  let fillIndices
  if (shape.scattered) {
    const indices = Array.from({ length: total }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    fillIndices = indices.slice(0, filledCount).sort((a, b) => a - b)
  } else {
    fillIndices = Array.from({ length: filledCount }, (_, i) => i)
  }

  return { ...shape, fillIndices, filledCount }
}

export default function MoleMartGame({ gameData, navigate }) {
  const { data, handlePercentageResult } = gameData
  const [tierId, setTierId] = useState('tier1')
  const [puzzle, setPuzzle] = useState(null)
  const [gridConfig, setGridConfig] = useState(null)
  const [holes, setHoles] = useState([])
  const [holeStates, setHoleStates] = useState({})
  const [showConfetti, setShowConfetti] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState('')
  const [trickCard, setTrickCard] = useState(null)

  const loadPuzzle = useCallback((tid) => {
    const p = pickMartPuzzle(tid)
    if (!p) return
    let answer, distractors
    if (tid === 'tier1') {
      answer = p.pct
      distractors = p.distractors
      setGridConfig(pickGridConfig(p.pct))
    } else if (tid === 'tier2') {
      answer = p.answer
      distractors = p.distractors
      setGridConfig(null)
    } else if (tid === 'tier3') {
      answer = p.salePrice
      distractors = p.distractors
      setGridConfig(null)
    } else if (tid === 'tier4') {
      answer = p.answer
      distractors = p.distractors
      setGridConfig(null)
    }
    setPuzzle(p)
    setHoles(buildMartHoles(answer, distractors, 9))
    setHoleStates({})
    setFeedbackMsg('')
    setTrickCard(null)
  }, [])

  useEffect(() => {
    loadPuzzle(tierId)
  }, [tierId])

  const getCorrectAnswer = () => {
    if (!puzzle) return null
    if (tierId === 'tier1') return puzzle.pct
    if (tierId === 'tier2') return puzzle.answer
    if (tierId === 'tier3') return puzzle.salePrice
    if (tierId === 'tier4') return puzzle.answer
    return null
  }

  const handleHoleTap = useCallback((idx, value) => {
    if (Object.keys(holeStates).length > 0) return
    const correct = value === getCorrectAnswer()
    const correctIdx = holes.findIndex(h => h === getCorrectAnswer())

    if (correct) {
      setHoleStates({ [idx]: 'correct' })
      setShowConfetti(true)
      handlePercentageResult(tierId, true)
      const streak = data.streak + 1
      const streakMsg = streak >= 3 ? ` 🔥 ${streak} streak!` : ''

      if (tierId === 'tier1') {
        const equiv = EQUIVALENTS[puzzle.pct]
        setFeedbackMsg(equiv
          ? `✨ ${puzzle.pct}% = ${equiv.fraction} = ${equiv.decimal}${streakMsg}`
          : `✨ ${puzzle.pct}% — well spotted!${streakMsg}`)
      } else if (tierId === 'tier2') {
        setFeedbackMsg(`✨ ${puzzle.pct}% of ${puzzle.of} = ${puzzle.answer}!${streakMsg}`)
        setTrickCard(PERCENT_TRICKS[puzzle.pct] || null)
      } else if (tierId === 'tier3') {
        setFeedbackMsg(`✨ R${puzzle.salePrice}! (R${puzzle.price} − R${puzzle.discountAmt} = R${puzzle.salePrice})${streakMsg}`)
      } else if (tierId === 'tier4') {
        setFeedbackMsg(`✨ ${puzzle.part} ÷ ${puzzle.whole} × 100 = ${puzzle.answer}%${streakMsg}`)
        setTrickCard(REVERSE_TRICK)
      }
      setTimeout(() => setShowConfetti(false), 1500)
    } else {
      setHoleStates({ [idx]: 'wrong', [correctIdx]: 'revealed' })
      handlePercentageResult(tierId, false)
      if (tierId === 'tier1') {
        setFeedbackMsg(`The answer is ${puzzle.pct}% — count the orange squares! 💪`)
      } else if (tierId === 'tier2') {
        setFeedbackMsg(`${puzzle.pct}% of ${puzzle.of} = ${puzzle.answer} — check the trick below! 💪`)
        setTrickCard(PERCENT_TRICKS[puzzle.pct] || null)
      } else if (tierId === 'tier3') {
        setFeedbackMsg(`${puzzle.discountPct}% off R${puzzle.price}: R${puzzle.price} − R${puzzle.discountAmt} = R${puzzle.salePrice} 💡`)
      } else if (tierId === 'tier4') {
        setFeedbackMsg(`${puzzle.part} ÷ ${puzzle.whole} × 100 = ${puzzle.answer}% — check the trick! 💪`)
        setTrickCard(REVERSE_TRICK)
      }
      setTimeout(() => loadPuzzle(tierId), 2500)
    }
  }, [holeStates, holes, puzzle, tierId, data.streak, handlePercentageResult, loadPuzzle])

  const isAnswered = Object.keys(holeStates).length > 0
  const wasCorrect = isAnswered && Object.values(holeStates).includes('correct')

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-6 gap-4 min-h-screen">
      <Confetti active={showConfetti} />

      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <button
          onClick={() => navigate('home')}
          className="bg-white rounded-2xl px-4 py-2 shadow text-green-700 font-bold active:scale-95 transition-transform"
        >
          ← Home
        </button>
        <div className="flex gap-2">
          <span className="bg-yellow-100 text-yellow-700 rounded-xl px-3 py-1 font-bold text-sm">⭐ {data.points}</span>
          <span className="bg-orange-100 text-orange-700 rounded-xl px-3 py-1 font-bold text-sm">🔥 {data.streak}</span>
        </div>
      </div>

      <h2 className="font-fun text-3xl text-green-600">Mole Mart 🛒</h2>

      {/* Tier selector */}
      <div className="flex gap-2 w-full justify-center flex-wrap">
        {MART_TIERS.map(t => (
          <button
            key={t.id}
            onClick={() => setTierId(t.id)}
            className={`px-3 py-2 rounded-2xl font-bold text-xs transition-all active:scale-95 ${
              tierId === t.id
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-white text-green-700 border-2 border-green-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Puzzle area */}
      {puzzle && (
        <>
          {/* Tier 1 — varied grid */}
          {tierId === 'tier1' && gridConfig && (
            <div className="bg-white rounded-3xl shadow-xl p-4 flex flex-col items-center gap-2 w-full">
              <p className="font-bold text-gray-600 text-sm">What percentage is shaded? 🟧</p>
              <PercentageGrid
                rows={gridConfig.rows}
                cols={gridConfig.cols}
                fillIndices={gridConfig.fillIndices}
                width={Math.min(320, gridConfig.cols * 32)}
              />
              <p className="text-xs text-gray-400 font-semibold">
                {gridConfig.filledCount} of {gridConfig.rows * gridConfig.cols} squares shaded
              </p>
            </div>
          )}

          {/* Tier 2 — % of number */}
          {tierId === 'tier2' && (
            <div className="bg-white rounded-3xl shadow-xl px-8 py-6 text-center w-full">
              <p className="text-gray-500 font-semibold text-sm mb-1">What is...</p>
              <p className="font-fun text-5xl text-green-700">
                {puzzle.pct}% of {puzzle.of}?
              </p>
            </div>
          )}

          {/* Tier 3 — discount */}
          {tierId === 'tier3' && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-5 w-full">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{puzzle.emoji}</span>
                <div>
                  <p className="font-fun text-2xl text-green-700">{puzzle.item}</p>
                  <p className="text-gray-500 font-bold text-sm line-through">R{puzzle.price}</p>
                  <p className="text-red-500 font-bold text-lg">{puzzle.discountPct}% OFF!</p>
                </div>
              </div>
              <p className="text-center font-bold text-green-800 mt-3 text-sm">
                What's the sale price? 🏷️
              </p>
            </div>
          )}

          {/* Tier 4 — reverse % */}
          {tierId === 'tier4' && (
            <div className="bg-white rounded-3xl shadow-xl px-8 py-6 text-center w-full">
              <p className="text-gray-500 font-semibold text-sm mb-1">What percentage?</p>
              <p className="font-fun text-4xl text-green-700 leading-tight">
                {puzzle.part} is ___% of {puzzle.whole}
              </p>
            </div>
          )}

          {/* Feedback */}
          {feedbackMsg && (
            <div className={`rounded-2xl px-4 py-2 font-bold text-sm text-center animate-pop-in w-full ${
              wasCorrect ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {feedbackMsg}
            </div>
          )}

          {/* Mole holes */}
          <div className="grid grid-cols-3 gap-3 w-full mt-1">
            {holes.map((value, i) => (
              <div key={i} className="flex justify-center">
                <MoleHole
                  value={
                    tierId === 'tier3' ? `R${value}` :
                    tierId === 'tier1' ? `${value}%` :
                    tierId === 'tier4' ? `${value}%` :
                    `${value}`
                  }
                  onClick={() => handleHoleTap(i, value)}
                  state={holeStates[i] || null}
                  cosmetic={data.activeCosmetic}
                  delay={i * 60}
                />
              </div>
            ))}
          </div>

          {/* Trick card (Tier 2 & 4) */}
          {trickCard && (
            <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-3xl p-4 w-full animate-pop-in">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{trickCard.emoji}</span>
                <span className="font-bold text-green-700">% Trick!</span>
              </div>
              <p className="text-gray-700 text-sm font-semibold">{trickCard.trick}</p>
              <p className="text-green-600 text-sm mt-1 font-mono">{trickCard.example}</p>
              {wasCorrect && (
                <button
                  onClick={() => loadPuzzle(tierId)}
                  className="mt-3 w-full bg-green-600 text-white rounded-2xl py-3 font-fun text-xl active:scale-95 transition-transform shadow-md"
                >
                  Next Question! →
                </button>
              )}
            </div>
          )}

          {/* Next button for tiers without a trick card */}
          {wasCorrect && !trickCard && (
            <button
              onClick={() => loadPuzzle(tierId)}
              className="w-full bg-green-600 text-white rounded-2xl py-4 font-fun text-xl active:scale-95 transition-transform shadow-md"
            >
              Next Question! →
            </button>
          )}
        </>
      )}
    </div>
  )
}
