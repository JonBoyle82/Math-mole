// Mole Mart — percentage puzzles across 4 tiers
// Tier 1: read % from a 10x10 grid
// Tier 2: % of a number (mental-math-only percentages)
// Tier 3: find the sale price after a discount (gated behind 80% Tier 2 accuracy / 15 attempts)
// Tier 4: stub — % increase/decrease and reverse % ("20 is what % of 80?")

// ── Common equivalents shown on Tier 1 correct answers ───────────────────────
export const EQUIVALENTS = {
  5:  { fraction: '1/20', decimal: '0.05' },
  10: { fraction: '1/10', decimal: '0.1'  },
  20: { fraction: '1/5',  decimal: '0.2'  },
  25: { fraction: '1/4',  decimal: '0.25' },
  30: { fraction: '3/10', decimal: '0.3'  },
  40: { fraction: '2/5',  decimal: '0.4'  },
  50: { fraction: '1/2',  decimal: '0.5'  },
  60: { fraction: '3/5',  decimal: '0.6'  },
  75: { fraction: '3/4',  decimal: '0.75' },
  80: { fraction: '4/5',  decimal: '0.8'  },
}

// ── Tier 1: reading a shaded 10x10 grid ──────────────────────────────────────
// pct = number of shaded cells out of 100
// distractors = plausible wrong answers (near neighbours, off-by-row errors)
export const TIER1_PUZZLES = [
  { pct: 50, distractors: [40, 45, 55, 60] },
  { pct: 25, distractors: [20, 24, 30, 35] },
  { pct: 75, distractors: [70, 65, 80, 85] },
  { pct: 10, distractors: [5,  15, 20, 12] },
  { pct: 20, distractors: [15, 25, 30, 18] },
  { pct: 30, distractors: [25, 35, 40, 28] },
  { pct: 60, distractors: [55, 65, 70, 58] },
  { pct: 80, distractors: [75, 85, 70, 90] },
  { pct: 40, distractors: [35, 45, 50, 38] },
  { pct: 5,  distractors: [10, 15, 4,  6]  },
]

// ── Tier 2 trick cards (shown on correct answer) ──────────────────────────────
export const PERCENT_TRICKS = {
  10: {
    trick: '10% = shift the decimal one place left (divide by 10).',
    example: '10% of 40 → 40 ÷ 10 = 4',
    emoji: '🔟',
  },
  50: {
    trick: '50% = find half (divide by 2).',
    example: '50% of 60 → 60 ÷ 2 = 30',
    emoji: '½',
  },
  25: {
    trick: '25% = halve it, then halve it again (divide by 4).',
    example: '25% of 80 → 80 ÷ 2 = 40 → 40 ÷ 2 = 20',
    emoji: '¼',
  },
  20: {
    trick: '20% = find 10%, then double it.',
    example: '20% of 50 → 5 × 2 = 10',
    emoji: '✌️',
  },
  5: {
    trick: '5% = find 10%, then halve it.',
    example: '5% of 40 → 4 ÷ 2 = 2',
    emoji: '🖐️',
  },
}

// Helper: generate smart decoys for Tier 2
// Reflects real mistakes: forgot to scale, wrong direction, off-by-decimal
function tier2Decoys(pct, of, answer) {
  const decoys = new Set()
  decoys.add(of)                        // forgot to apply % at all
  decoys.add(pct)                       // confused % with answer
  decoys.add(answer * 2)                // doubled instead of finding %
  decoys.add(Math.round(of / 10 * 2))  // used 20% when should be 10% (or vice versa)
  decoys.add(answer + 10)              // off-by-ten
  decoys.add(Math.max(1, answer - 5))  // near miss below
  decoys.add(answer + 5)              // near miss above
  // Remove answer itself and obvious negatives/zeros
  decoys.delete(answer)
  return [...decoys].filter(v => v > 0 && v !== answer).slice(0, 6)
}

// ── Tier 2: % of a number ────────────────────────────────────────────────────
// Only mental-math percentages: 10%, 50%, 25%, 20%, 5%
function t2(pct, of) {
  let answer
  if (pct === 10)  answer = of / 10
  if (pct === 50)  answer = of / 2
  if (pct === 25)  answer = of / 4
  if (pct === 20)  answer = of / 5
  if (pct === 5)   answer = of / 20
  answer = Math.round(answer)
  return { pct, of, answer, distractors: tier2Decoys(pct, of, answer) }
}

export const TIER2_PUZZLES = [
  t2(10, 40),   // = 4
  t2(50, 60),   // = 30
  t2(25, 80),   // = 20
  t2(20, 50),   // = 10
  t2(10, 70),   // = 7
  t2(50, 90),   // = 45
  t2(25, 40),   // = 10
  t2(20, 80),   // = 16
  t2(5,  60),   // = 3
  t2(10, 150),  // = 15
  t2(50, 44),   // = 22
  t2(25, 120),  // = 30
  t2(20, 30),   // = 6
  t2(5,  80),   // = 4
  t2(10, 200),  // = 20
]

// ── Tier 3: Mole Mart discounts ───────────────────────────────────────────────
// decoys: discount amount alone, reversed calc, near misses, original price
function t3(item, emoji, price, discountPct) {
  const discountAmt = Math.round(price * discountPct / 100)
  const salePrice = price - discountAmt
  const decoys = new Set()
  decoys.add(discountAmt)              // confusion: discount amount vs. final price
  decoys.add(price + discountAmt)      // added instead of subtracted
  decoys.add(salePrice + 5)           // near miss
  decoys.add(Math.max(1, salePrice - 5))
  decoys.add(price)                    // forgot to apply discount
  decoys.add(Math.round(price * 0.5)) // used 50% instead of correct %
  decoys.delete(salePrice)
  return {
    item, emoji, price, discountPct, discountAmt, salePrice,
    distractors: [...decoys].filter(v => v > 0 && v !== salePrice).slice(0, 6),
  }
}

export const TIER3_PUZZLES = [
  t3('Jacket',     '🧥', 80,  25),   // R60
  t3('Sneakers',   '👟', 200, 10),   // R180
  t3('Backpack',   '🎒', 120, 50),   // R60
  t3('Cap',        '🧢', 60,  20),   // R48
  t3('Hoodie',     '👕', 150, 20),   // R120
  t3('Sunglasses', '🕶️', 100, 25),   // R75
  t3('Tracksuit',  '🩳', 240, 50),   // R120
  t3('Beanie',     '🧣', 40,  25),   // R30
  t3('Water Bottle','💧', 50, 10),   // R45
  t3('Lunchbox',   '🥡', 80,  20),   // R64
]

// ── Tier 4: Reverse % — "X is what % of Y?" ──────────────────────────────────
// Answers are always mental-math percentages so trick cards still apply.
function t4(part, whole) {
  const answer = Math.round(part / whole * 100)
  const decoys = new Set()
  decoys.add(answer + 10)
  decoys.add(Math.max(5, answer - 10))
  decoys.add(answer * 2)
  decoys.add(Math.max(5, Math.round(answer / 2)))
  decoys.add(whole - part)   // "subtracted instead of divided" confusion
  decoys.add(part)           // raw number confusion
  decoys.delete(answer)
  return {
    part, whole, answer,
    distractors: [...decoys].filter(v => v > 0 && v !== answer && v <= 100).slice(0, 6),
  }
}

export const TIER4_PUZZLES = [
  t4(20, 100),   // 20%
  t4(50, 100),   // 50%
  t4(25, 100),   // 25%
  t4(5,  100),   // 5%
  t4(30, 60),    // 50%
  t4(4,  40),    // 10%
  t4(3,  60),    // 5%
  t4(10, 50),    // 20%
  t4(15, 60),    // 25%
  t4(45, 90),    // 50%
  t4(8,  80),    // 10%
  t4(16, 80),    // 20%
  t4(20, 80),    // 25%
  t4(6,  30),    // 20%
  t4(2,  40),    // 5%
]

export const REVERSE_TRICK = {
  trick: 'Reverse %: (part ÷ whole) × 100 = %',
  example: '20 is what % of 80?  →  20 ÷ 80 = 0.25  →  × 100 = 25%',
  emoji: '🔄',
}

// ── Tier registry ─────────────────────────────────────────────────────────────
export const MART_TIERS = [
  { id: 'tier1', label: 'Read %',      puzzles: TIER1_PUZZLES, comingSoon: false },
  { id: 'tier2', label: '% of Number', puzzles: TIER2_PUZZLES, comingSoon: false },
  { id: 'tier3', label: 'Discounts',   puzzles: TIER3_PUZZLES, comingSoon: false },
  { id: 'tier4', label: 'Reverse %',   puzzles: TIER4_PUZZLES, comingSoon: false },
]

export function pickMartPuzzle(tierId) {
  const tier = MART_TIERS.find(t => t.id === tierId)
  if (!tier || tier.comingSoon || tier.puzzles.length === 0) return null
  return tier.puzzles[Math.floor(Math.random() * tier.puzzles.length)]
}

// Build shuffled mole-hole values for a puzzle (answer + distractors)
export function buildMartHoles(answer, distractors, count = 8) {
  const pool = [answer, ...distractors.filter(d => d !== answer)]
  // Pad with random nearby values if needed
  while (pool.length < count) {
    const offset = (Math.floor(Math.random() * 10) + 1) * (Math.random() > 0.5 ? 1 : -1)
    const v = answer + offset
    if (v > 0 && !pool.includes(v)) pool.push(v)
  }
  const holes = pool.slice(0, count)
  for (let i = holes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [holes[i], holes[j]] = [holes[j], holes[i]]
  }
  return holes
}
