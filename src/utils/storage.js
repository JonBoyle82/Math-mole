const KEYS = {
  FACT_ACCURACY: 'mm_factAccuracy',
  FRACTION_PROGRESS: 'mm_fractionProgress',
  FRACTION_RECENT: 'mm_fractionRecent',
  FRACTION_SUMS_PROGRESS: 'mm_fractionSumsProgress',
  PERCENTAGE_PROGRESS: 'mm_percentageProgress',
  PCT_T2_RECENT: 'mm_pctT2Recent',           // rolling window for discount tier unlock
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

// ── Times Tables ──────────────────────────────────────────────────────────────

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
    recent: [...(prev.recent || []).slice(-9), correct ? 1 : 0],
  }
  save(KEYS.FACT_ACCURACY, acc)
  return acc
}

export function getFactMasteryLevel(a, b) {
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

// ── Pizza Match fractions ─────────────────────────────────────────────────────

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

  const recent = load(KEYS.FRACTION_RECENT, [])
  recent.push(correct ? 1 : 0)
  if (recent.length > 20) recent.shift()
  save(KEYS.FRACTION_RECENT, recent)
}

export function isBakeryUnlocked() {
  const recent = load(KEYS.FRACTION_RECENT, [])
  if (recent.length < 15) return false
  const last15 = recent.slice(-15)
  return last15.reduce((s, v) => s + v, 0) / 15 >= 0.8
}

// ── Fraction Bakery ───────────────────────────────────────────────────────────

export function getFractionSumsProgress() {
  return load(KEYS.FRACTION_SUMS_PROGRESS, {})
}

export function recordFractionSumResult(tier, correct) {
  const prog = getFractionSumsProgress()
  const prev = prog[tier] || { correct: 0, attempts: 0, recent: [] }
  prog[tier] = {
    correct: prev.correct + (correct ? 1 : 0),
    attempts: prev.attempts + 1,
    recent: [...(prev.recent || []).slice(-19), correct ? 1 : 0],
  }
  save(KEYS.FRACTION_SUMS_PROGRESS, prog)
  return prog
}

export function isBakeryMastered() {
  const prog = getFractionSumsProgress()
  const allRecent = Object.values(prog).flatMap(d => d.recent || [])
  if (allRecent.length < 20) return false
  const last20 = allRecent.slice(-20)
  return last20.reduce((s, v) => s + v, 0) / 20 >= 0.8
}

// ── Mole Mart percentages ─────────────────────────────────────────────────────

export function getPercentageProgress() {
  return load(KEYS.PERCENTAGE_PROGRESS, {})
}

export function recordPercentageResult(tier, correct) {
  const prog = getPercentageProgress()
  const prev = prog[tier] || { correct: 0, attempts: 0, recent: [] }
  prog[tier] = {
    correct: prev.correct + (correct ? 1 : 0),
    attempts: prev.attempts + 1,
    recent: [...(prev.recent || []).slice(-19), correct ? 1 : 0],
  }
  save(KEYS.PERCENTAGE_PROGRESS, prog)

  // Maintain Tier 2 rolling window for discount unlock gate
  if (tier === 'tier2') {
    const recent = load(KEYS.PCT_T2_RECENT, [])
    recent.push(correct ? 1 : 0)
    if (recent.length > 20) recent.shift()
    save(KEYS.PCT_T2_RECENT, recent)
  }

  return prog
}

// Unlock Tier 3 Discounts once 80%+ on last 15 Tier 2 attempts
export function isDiscountUnlocked() {
  const recent = load(KEYS.PCT_T2_RECENT, [])
  if (recent.length < 15) return false
  const last15 = recent.slice(-15)
  return last15.reduce((s, v) => s + v, 0) / 15 >= 0.8
}

// Smart Shopper badge: 80%+ over last 20 Mole Mart attempts (any tier)
export function isSmartShopperMastered() {
  const prog = getPercentageProgress()
  const allRecent = Object.values(prog).flatMap(d => d.recent || [])
  if (allRecent.length < 20) return false
  const last20 = allRecent.slice(-20)
  return last20.reduce((s, v) => s + v, 0) / 20 >= 0.8
}

// ── Points & Streak ───────────────────────────────────────────────────────────

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

// ── Badges & Cosmetics ────────────────────────────────────────────────────────

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

// ── Aggregate ─────────────────────────────────────────────────────────────────

export function getAllData() {
  return {
    factAccuracy: getFactAccuracy(),
    fractionProgress: getFractionProgress(),
    fractionSumsProgress: getFractionSumsProgress(),
    percentageProgress: getPercentageProgress(),
    bakeryUnlocked: isBakeryUnlocked(),
    discountUnlocked: isDiscountUnlocked(),
    points: getPoints(),
    streak: getStreak(),
    bestStreak: getBestStreak(),
    unlockedBadges: getUnlockedBadges(),
    unlockedCosmetics: getUnlockedCosmetics(),
    activeCosmetic: getActiveCosmetic(),
  }
}
