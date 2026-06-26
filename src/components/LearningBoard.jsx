import { useState } from 'react'
import { getFactMasteryLevel } from '../utils/storage'

const MASTERY_COLORS = [
  'bg-gray-100 text-gray-400',
  'bg-red-100 text-red-600',
  'bg-yellow-100 text-yellow-700',
  'bg-green-200 text-green-800',
]
const MASTERY_LABELS = ['Not seen', 'Learning', 'Familiar', 'Mastered ✓']

// Common fraction / decimal / percentage equivalents table
const EQUIV_TABLE = [
  { fraction: '1/2',  decimal: '0.5',   pct: '50%'   },
  { fraction: '1/4',  decimal: '0.25',  pct: '25%'   },
  { fraction: '3/4',  decimal: '0.75',  pct: '75%'   },
  { fraction: '1/5',  decimal: '0.2',   pct: '20%'   },
  { fraction: '2/5',  decimal: '0.4',   pct: '40%'   },
  { fraction: '3/5',  decimal: '0.6',   pct: '60%'   },
  { fraction: '4/5',  decimal: '0.8',   pct: '80%'   },
  { fraction: '1/10', decimal: '0.1',   pct: '10%'   },
  { fraction: '3/10', decimal: '0.3',   pct: '30%'   },
  { fraction: '7/10', decimal: '0.7',   pct: '70%'   },
  { fraction: '1/3',  decimal: '0.333…', pct: '33.3%' },
  { fraction: '2/3',  decimal: '0.667…', pct: '66.7%' },
  { fraction: '1/20', decimal: '0.05',  pct: '5%'    },
  { fraction: '1/100',decimal: '0.01',  pct: '1%'    },
]

export default function LearningBoard({ navigate }) {
  const [tab, setTab] = useState('times')

  return (
    <div className="flex flex-col items-center px-2 pt-4 pb-6 gap-4">
      <div className="flex items-center justify-between w-full px-2">
        <button
          onClick={() => navigate('home')}
          className="bg-white rounded-2xl px-4 py-2 shadow text-purple-700 font-bold active:scale-95"
        >
          ← Home
        </button>
        <h2 className="font-fun text-2xl text-purple-700">Learning Board</h2>
        <div className="w-20" />
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 w-full px-2">
        <button
          onClick={() => setTab('times')}
          className={`flex-1 py-2 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
            tab === 'times'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-white text-purple-700 border-2 border-purple-200'
          }`}
        >
          ✖️ Times Tables
        </button>
        <button
          onClick={() => setTab('equiv')}
          className={`flex-1 py-2 rounded-2xl font-bold text-sm transition-all active:scale-95 ${
            tab === 'equiv'
              ? 'bg-green-600 text-white shadow'
              : 'bg-white text-green-700 border-2 border-green-200'
          }`}
        >
          🍕 % &amp; Fractions
        </button>
      </div>

      {/* Times table grid */}
      {tab === 'times' && (
        <>
          <div className="flex gap-2 flex-wrap justify-center px-2">
            {MASTERY_LABELS.map((label, i) => (
              <span key={i} className={`${MASTERY_COLORS[i]} rounded-xl px-3 py-1 text-xs font-bold`}>
                {label}
              </span>
            ))}
          </div>
          <div className="overflow-auto w-full">
            <table className="mx-auto border-collapse text-center" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th className="w-8 h-8 font-fun text-purple-400">×</th>
                  {Array.from({ length: 12 }, (_, i) => (
                    <th key={i} className="w-8 h-8 font-bold text-purple-700">{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, row) => (
                  <tr key={row}>
                    <td className="font-bold text-purple-700 pr-1">{row + 1}</td>
                    {Array.from({ length: 12 }, (_, col) => {
                      const a = row + 1
                      const b = col + 1
                      const level = getFactMasteryLevel(Math.min(a, b), Math.max(a, b))
                      return (
                        <td key={col} className="p-0.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${MASTERY_COLORS[level]}`}>
                            {a * b}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Fraction / Decimal / Percentage equivalence table */}
      {tab === 'equiv' && (
        <div className="w-full px-2">
          <p className="text-center text-sm text-gray-500 font-semibold mb-3">
            These three ways of writing the same amount — memorise them! 💡
          </p>
          <div className="bg-white rounded-3xl shadow-md overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-green-600 text-white font-fun text-base">
              <div className="py-3 text-center">Fraction 🍕</div>
              <div className="py-3 text-center">Decimal</div>
              <div className="py-3 text-center">Percent %</div>
            </div>
            {/* Rows */}
            {EQUIV_TABLE.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-green-50'}`}
              >
                <div className="py-3 text-center font-bold text-pink-600 text-lg">{row.fraction}</div>
                <div className="py-3 text-center font-bold text-blue-600 text-lg">{row.decimal}</div>
                <div className="py-3 text-center font-bold text-green-700 text-lg">{row.pct}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 font-semibold mt-3">
            Play Pizza Fractions and Mole Mart to practise these!
          </p>
        </div>
      )}
    </div>
  )
}
