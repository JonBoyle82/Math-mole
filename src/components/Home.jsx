const MOLE_COLORS = {
  default: 'from-amber-400 to-amber-600',
  blue: 'from-blue-400 to-blue-600',
  pink: 'from-pink-400 to-pink-600',
  green: 'from-green-400 to-green-600',
  purple: 'from-purple-400 to-purple-600',
}

export default function Home({ gameData, navigate }) {
  const { data } = gameData
  const moleBg = MOLE_COLORS[data.activeCosmetic] || MOLE_COLORS.default
  const badgeCount = data.unlockedBadges.length

  return (
    <div className="flex flex-col items-center px-4 pt-8 pb-6 gap-6">
      {/* Title */}
      <div className="text-center">
        <h1 className="font-fun text-5xl text-purple-700 drop-shadow-md">Math Mole</h1>
        <p className="text-lg text-purple-500 font-semibold mt-1">Learn × &amp; Fractions!</p>
      </div>

      {/* Mole mascot */}
      <div className="relative">
        <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${moleBg} flex items-center justify-center shadow-xl border-4 border-white`}>
          <span className="text-6xl select-none">🦔</span>
        </div>
        {badgeCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-white shadow">
            {badgeCount}
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="flex gap-4 w-full justify-center">
        <StatChip icon="⭐" label="Points" value={data.points} color="bg-yellow-100 text-yellow-700" />
        <StatChip icon="🔥" label="Streak" value={data.streak} color="bg-orange-100 text-orange-700" />
        <StatChip icon="🏆" label="Best" value={data.bestStreak} color="bg-purple-100 text-purple-700" />
      </div>

      {/* Mode buttons */}
      <div className="flex flex-col gap-4 w-full mt-2">
        <BigButton
          onClick={() => navigate('times')}
          color="bg-gradient-to-r from-purple-500 to-indigo-600"
          icon="✖️"
          label="Times Tables"
          sub="Whack the right mole!"
        />
        <BigButton
          onClick={() => navigate('fractions')}
          color="bg-gradient-to-r from-pink-500 to-rose-500"
          icon="🍕"
          label="Pizza Fractions"
          sub="Match the slices!"
        />

        {/* Fraction Bakery — locked until 80% Pizza Match accuracy over 15 attempts */}
        {data.bakeryUnlocked ? (
          <BigButton
            onClick={() => navigate('bakery')}
            color="bg-gradient-to-r from-orange-400 to-amber-500"
            icon="🧁"
            label="Fraction Bakery"
            sub="Add fractions to fill orders!"
          />
        ) : (
          <LockedButton
            icon="🧁"
            label="Fraction Bakery"
            hint="Get a bit more pizza practice first! (80% on Pizza Match to unlock)"
          />
        )}
      </div>

      {/* Secondary buttons */}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => navigate('board')}
          className="flex-1 bg-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform border-2 border-purple-200"
        >
          <span className="text-xl">📊</span>
          <span className="font-bold text-purple-700 text-sm">Learning Board</span>
        </button>
        <button
          onClick={() => navigate('rewards')}
          className="flex-1 bg-white rounded-2xl py-3 px-4 flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform border-2 border-yellow-200"
        >
          <span className="text-xl">🎁</span>
          <span className="font-bold text-yellow-700 text-sm">Rewards</span>
        </button>
      </div>
    </div>
  )
}

function StatChip({ icon, label, value, color }) {
  return (
    <div className={`${color} rounded-2xl px-4 py-2 flex flex-col items-center min-w-[72px] shadow-sm`}>
      <span className="text-lg">{icon}</span>
      <span className="font-bold text-xl leading-tight">{value}</span>
      <span className="text-xs font-semibold opacity-70">{label}</span>
    </div>
  )
}

function BigButton({ onClick, color, icon, label, sub }) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white rounded-3xl py-5 px-6 flex items-center gap-4 shadow-lg active:scale-95 transition-transform w-full`}
      style={{ minHeight: 80 }}
    >
      <span className="text-4xl">{icon}</span>
      <div className="text-left">
        <div className="font-fun text-2xl leading-tight">{label}</div>
        <div className="text-sm opacity-80">{sub}</div>
      </div>
      <span className="ml-auto text-2xl">›</span>
    </button>
  )
}

function LockedButton({ icon, label, hint }) {
  return (
    <div
      className="bg-gray-100 border-2 border-dashed border-gray-300 text-gray-400 rounded-3xl py-5 px-6 flex items-center gap-4 w-full"
      style={{ minHeight: 80 }}
    >
      <span className="text-4xl opacity-50">{icon}</span>
      <div className="text-left flex-1">
        <div className="font-fun text-2xl leading-tight flex items-center gap-2">
          {label} <span className="text-lg">🔒</span>
        </div>
        <div className="text-xs text-gray-400 font-semibold mt-0.5">{hint}</div>
      </div>
    </div>
  )
}
