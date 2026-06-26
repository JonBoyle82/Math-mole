const KEYS = {
  FACT_ACCURACY: 'mm_factAccuracy',
  FRACTION_PROGRESS: 'mm_fractionProgress',
  POINTS: 'mm_points',
  STREAK: 'mm_streak',
  BEST_STREAK: 'mm_bestStreak',
  UNLOCKED_BADGES: 'mm_unlockedBadges',
  UNLOCKED_COSMETICS: 'mm_unlockedCosmetics',
  ACTIVE_COSMETIC: 'mm_activeCosmetic',
}

function load(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v !== null ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function getFactAccuracy() {
  return load(KEYS.FACT_ACCURACY, {})
}

export function recordFactResult(a, b, correct) {
  const acc = getFactAccuracy()
  const key = `${a}x${b}`
  const prev = acc[key] || { correct: 0, attempts: 0 }
  acc[key] = {
    correct: prev.correct + (correct ? 1 : 0),
    attempts: prev.attempts + 1,
    // Keep last 10 results as a rolling array for badge calculation
    recent: [...(prev.recent || []).slice(-9), correct ? 1 : 0],
  }
  save(KEYS.FACT_ACCURACY, acc)
  return acc
}

export function getFactMasteryLevel(a, b) {
  // Returns 0-3: 0=unseen, 1=learning, 2=familiar, 3=mastered
  const acc = getFactAccuracy()
  const key = `${a}x${b}`
  const data = acc[key]
  if (!data || data.attempts === 0) return 0
  const rate = data.correct / data.attempts
  if (rate >= 0.9 && data.attempts >= 5) return 3
  if (rate >= 0.7) return 2
  return 1
}

export function isTableMastered(table) {
  // 90%+ accuracy over last 10 attempts for each fact in this table
  const acc = getFactAccuracy()
  for (let i = 1; i <= 12; i++) {
    const key = `${table}x${i}`
    const data = acc[key]
    if (!data || data.attempts < 5) return false
    const recent = data.recent || []
    if (recent.length < 5) return false
    const recentRate = recent.reduce((s, v) => s + v, 0) / recent.length
    if (recentRate < 0.9) return false
  }
  return true
}

export function getFractionProgress() {
  return load(KEYS.FRACTION_PROGRESS, {})
}

export function recordFractionResult(tier, correct) {
  const prog = getFractionProgress()
  const prev = prog[tier] || { correct: 0, attempts: 0 }
  prog[tier] = {
    correct: prev.correct + (correct ? 1 : 0),
    attempts: prev.attempts + 1,
  }
  save(KEYS.FRACTION_PROGRESS, prog)
}

export function getPoints() { return load(KEYS.POINTS, 0) }
export function addPoints(n) {
  const p = getPoints() + n
  save(KEYS.POINTS, p)
  return p
}

export function getStreak() { return load(KEYS.STREAK, 0) }
export function getBestStreak() { return load(KEYS.BEST_STREAK, 0) }
export function incrementStreak() {
  const s = getStreak() + 1
  save(KEYS.STREAK, s)
  const best = getBestStreak()
  if (s > best) save(KEYS.BEST_STREAK, s)
  return s
}
export function resetStreak() { save(KEYS.STREAK, 0); return 0 }

export function getUnlockedBadges() { return load(KEYS.UNLOCKED_BADGES, []) }
export function unlockBadge(badge) {
  const badges = getUnlockedBadges()
  if (!badges.includes(badge)) {
    badges.push(badge)
    save(KEYS.UNLOCKED_BADGES, badges)
    return true
  }
  return false
}

export function getUnlockedCosmetics() { return load(KEYS.UNLOCKED_COSMETICS, ['default']) }
export function unlockCosmetic(id) {
  const cosmetics = getUnlockedCosmetics()
  if (!cosmetics.includes(id)) {
    cosmetics.push(id)
    save(KEYS.UNLOCKED_COSMETICS, cosmetics)
  }
}

export function getActiveCosmetic() { return load(KEYS.ACTIVE_COSMETIC, 'default') }
export function setActiveCosmetic(id) { save(KEYS.ACTIVE_COSMETIC, id) }

export function getAllData() {
  return {
    factAccuracy: getFactAccuracy(),
    fractionProgress: getFractionProgress(),
    points: getPoints(),
    streak: getStreak(),
    bestStreak: getBestStreak(),
    unlockedBadges: getUnlockedBadges(),
    unlockedCosmetics: getUnlockedCosmetics(),
    activeCosmetic: getActiveCosmetic(),
  }
}
