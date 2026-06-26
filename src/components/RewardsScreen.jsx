import { useState } from 'react'

const BADGES = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `table_${i + 1}`,
    label: `× ${i + 1}`,
    emoji: ['2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','1️⃣1️⃣','1️⃣2️⃣','⭐'][i] || '🏅',
    desc: `Mastered the ${i + 1} times table`,
  })),
  {
    id: 'bakery_apprentice',
    label: 'Bakery Apprentice',
    emoji: '🧁',
    desc: '80%+ accuracy over 20 Fraction Bakery attempts',
  },
]

const COSMETICS = [
  { id: 'default', label: 'Classic', color: 'from-amber-400 to-amber-600', cost: 0, emoji: '🦔' },
  { id: 'blue', label: 'Ocean', color: 'from-blue-400 to-blue-600', cost: 100, emoji: '🦔' },
  { id: 'pink', label: 'Blossom', color: 'from-pink-400 to-pink-600', cost: 100, emoji: '🦔' },
  { id: 'green', label: 'Forest', color: 'from-green-400 to-green-600', cost: 150, emoji: '🦔' },
  { id: 'purple', label: 'Galaxy', color: 'from-purple-400 to-purple-600', cost: 200, emoji: '🦔' },
]

export default function RewardsScreen({ gameData, navigate }) {
  const { data, purchaseCosmetic, changeCosmetic } = gameData
  const [tab, setTab] = useState('badges')

  return (
    <div className="flex flex-col items-center px-4 pt-4 pb-6 gap-4">
      <div className="flex items-center justify-between w-full">
        <button onClick={() => navigate('home')} className="bg-white rounded-2xl px-4 py-2 shadow text-yellow-700 font-bold active:scale-95">
          ← Home
        </button>
        <h2 className="font-fun text-2xl text-yellow-600">🎁 Rewards</h2>
        <span className="bg-yellow-100 text-yellow-700 rounded-xl px-3 py-2 font-bold">⭐ {data.points}</span>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-3xl shadow-md p-4 w-full grid grid-cols-3 gap-3 text-center">
        <StatCell icon="⭐" value={data.points} label="Points" />
        <StatCell icon="🔥" value={data.streak} label="Streak" />
        <StatCell icon="🏆" value={data.bestStreak} label="Best Streak" />
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 w-full">
        {['badges', 'cosmetics'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 rounded-2xl font-bold capitalize transition-all active:scale-95 ${
              tab === t ? 'bg-yellow-500 text-white shadow' : 'bg-white text-yellow-700 border-2 border-yellow-200'
            }`}
          >
            {t === 'badges' ? '🏅 Badges' : '🎨 Skins'}
          </button>
        ))}
      </div>

      {tab === 'badges' && (
        <div className="grid grid-cols-3 gap-3 w-full">
          {BADGES.map(badge => {
            const unlocked = data.unlockedBadges.includes(badge.id)
            return (
              <div
                key={badge.id}
                className={`rounded-3xl p-3 flex flex-col items-center gap-1 shadow-md ${
                  unlocked ? 'bg-yellow-50 border-2 border-yellow-300' : 'bg-gray-100 opacity-60'
                }`}
              >
                <span className="text-3xl">{unlocked ? badge.emoji : '🔒'}</span>
                <span className="font-bold text-sm text-center text-gray-700">{badge.label}</span>
                {unlocked && <span className="text-xs text-green-600 font-semibold">Unlocked!</span>}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'cosmetics' && (
        <div className="grid grid-cols-2 gap-3 w-full">
          {COSMETICS.map(c => {
            const owned = data.unlockedCosmetics.includes(c.id)
            const active = data.activeCosmetic === c.id
            return (
              <div
                key={c.id}
                className={`bg-white rounded-3xl p-4 flex flex-col items-center gap-2 shadow-md border-2 ${
                  active ? 'border-purple-400' : 'border-transparent'
                }`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-4xl shadow`}>
                  {c.emoji}
                </div>
                <span className="font-bold text-gray-700">{c.label}</span>
                {owned ? (
                  <button
                    onClick={() => changeCosmetic(c.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                      active ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {active ? 'Active ✓' : 'Use'}
                  </button>
                ) : (
                  <button
                    onClick={() => purchaseCosmetic(c.id, c.cost)}
                    disabled={data.points < c.cost}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                      data.points >= c.cost
                        ? 'bg-yellow-400 text-yellow-900'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    ⭐ {c.cost}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatCell({ icon, value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl">{icon}</span>
      <span className="font-fun text-2xl text-gray-800">{value}</span>
      <span className="text-xs text-gray-500 font-semibold">{label}</span>
    </div>
  )
}
