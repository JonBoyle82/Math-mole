import { getFactMasteryLevel } from '../utils/storage'

const MASTERY_COLORS = [
  'bg-gray-100 text-gray-400',      // 0 = unseen
  'bg-red-100 text-red-600',        // 1 = learning
  'bg-yellow-100 text-yellow-700',  // 2 = familiar
  'bg-green-200 text-green-800',    // 3 = mastered
]

const MASTERY_LABELS = ['Not seen', 'Learning', 'Familiar', 'Mastered ✓']

export default function LearningBoard({ navigate }) {
  return (
    <div className="flex flex-col items-center px-2 pt-4 pb-6 gap-4">
      <div className="flex items-center justify-between w-full px-2">
        <button onClick={() => navigate('home')} className="bg-white rounded-2xl px-4 py-2 shadow text-purple-700 font-bold active:scale-95">
          ← Home
        </button>
        <h2 className="font-fun text-2xl text-purple-700">Learning Board</h2>
        <div className="w-20" />
      </div>

      {/* Legend */}
      <div className="flex gap-2 flex-wrap justify-center">
        {MASTERY_LABELS.map((label, i) => (
          <span key={i} className={`${MASTERY_COLORS[i]} rounded-xl px-3 py-1 text-xs font-bold`}>{label}</span>
        ))}
      </div>

      {/* Grid */}
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
    </div>
  )
}
