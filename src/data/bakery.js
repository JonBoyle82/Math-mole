// Fraction Bakery — fraction addition puzzles
// Each puzzle defines a target sum, a correct pair of addends, and distractors.
// The game renders all cups shuffled; player picks two that sum to the target.

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b) }

export function fractionSumEquals(a, b, target) {
  // Check if a.num/a.den + b.num/b.den === target.num/target.den
  const sumNum = a.num * b.den + b.num * a.den
  const sumDen = a.den * b.den
  return sumNum * target.den === target.num * sumDen
}

export function simplifyFraction(num, den) {
  const g = gcd(Math.abs(num), Math.abs(den))
  return { num: num / g, den: den / g }
}

export function getBakeryExplanation(a, b) {
  if (a.den === b.den) {
    const total = a.num + b.num
    const s = simplifyFraction(total, a.den)
    const simplified = s.num !== total || s.den !== a.den ? ` (same as ${s.num}/${s.den})` : ''
    return `The bottoms match — just add the tops! ${a.num} + ${b.num} = ${total}, so the answer is ${total}/${a.den}${simplified}. 🧁`
  }
  // Related denominators — convert smaller to larger
  const bigDen = Math.max(a.den, b.den)
  const small = a.den < b.den ? a : b
  const big = a.den < b.den ? b : a
  const factor = bigDen / small.den
  const convertedNum = small.num * factor
  const totalNum = convertedNum + big.num
  const s = simplifyFraction(totalNum, bigDen)
  const simplified = s.num !== totalNum || s.den !== bigDen ? ` = ${s.num}/${s.den}` : ''
  return `Change ${small.num}/${small.den} to ${convertedNum}/${bigDen} (×${factor} top and bottom). Then ${convertedNum}/${bigDen} + ${big.num}/${bigDen} = ${totalNum}/${bigDen}${simplified}! 🎉`
}

// ── Tier 1: same-denominator sums ─────────────────────────────────────────────
const TIER1 = [
  {
    target: { num: 3, den: 4 },
    correctA: { num: 1, den: 4 },
    correctB: { num: 2, den: 4 },
    distractors: [{ num: 3, den: 8 }, { num: 1, den: 8 }, { num: 3, den: 4 }, { num: 5, den: 8 }],
  },
  {
    target: { num: 2, den: 3 },
    correctA: { num: 1, den: 3 },
    correctB: { num: 1, den: 3 },
    distractors: [{ num: 1, den: 6 }, { num: 4, den: 6 }, { num: 1, den: 2 }, { num: 5, den: 6 }],
  },
  {
    target: { num: 5, den: 8 },
    correctA: { num: 2, den: 8 },
    correctB: { num: 3, den: 8 },
    distractors: [{ num: 1, den: 4 }, { num: 4, den: 8 }, { num: 1, den: 8 }, { num: 6, den: 8 }],
  },
  {
    target: { num: 7, den: 10 },
    correctA: { num: 3, den: 10 },
    correctB: { num: 4, den: 10 },
    distractors: [{ num: 1, den: 10 }, { num: 6, den: 10 }, { num: 2, den: 5 }, { num: 1, den: 2 }],
  },
  {
    target: { num: 5, den: 6 },
    correctA: { num: 2, den: 6 },
    correctB: { num: 3, den: 6 },
    distractors: [{ num: 1, den: 6 }, { num: 4, den: 6 }, { num: 1, den: 3 }, { num: 1, den: 2 }],
  },
  {
    target: { num: 3, den: 5 },
    correctA: { num: 1, den: 5 },
    correctB: { num: 2, den: 5 },
    distractors: [{ num: 4, den: 5 }, { num: 1, den: 10 }, { num: 3, den: 10 }, { num: 1, den: 5 }],
  },
]

// ── Tier 2: related denominators (one divides the other) ──────────────────────
const TIER2 = [
  {
    target: { num: 3, den: 4 },
    correctA: { num: 1, den: 4 },
    correctB: { num: 1, den: 2 },
    distractors: [{ num: 3, den: 8 }, { num: 2, den: 4 }, { num: 3, den: 4 }, { num: 1, den: 8 }],
  },
  {
    target: { num: 1, den: 2 },
    correctA: { num: 1, den: 3 },
    correctB: { num: 1, den: 6 },
    distractors: [{ num: 2, den: 6 }, { num: 1, den: 4 }, { num: 3, den: 6 }, { num: 1, den: 3 }],
  },
  {
    target: { num: 5, den: 6 },
    correctA: { num: 2, den: 3 },
    correctB: { num: 1, den: 6 },
    distractors: [{ num: 1, den: 3 }, { num: 3, den: 6 }, { num: 4, den: 6 }, { num: 1, den: 2 }],
  },
  {
    target: { num: 5, den: 8 },
    correctA: { num: 3, den: 8 },
    correctB: { num: 1, den: 4 },
    distractors: [{ num: 2, den: 8 }, { num: 4, den: 8 }, { num: 3, den: 4 }, { num: 1, den: 8 }],
  },
  {
    target: { num: 7, den: 12 },
    correctA: { num: 1, den: 4 },
    correctB: { num: 1, den: 3 },
    distractors: [{ num: 5, den: 12 }, { num: 2, den: 12 }, { num: 1, den: 6 }, { num: 3, den: 4 }],
  },
  {
    target: { num: 3, den: 4 },
    correctA: { num: 1, den: 2 },
    correctB: { num: 1, den: 4 },
    distractors: [{ num: 1, den: 8 }, { num: 3, den: 8 }, { num: 2, den: 4 }, { num: 5, den: 8 }],
  },
]

// ── Tier 3: stub — unrelated denominators requiring true LCD ──────────────────
// Not yet implemented. To add: populate TIER3 with puzzles where neither
// denominator divides the other (e.g. 1/3 + 1/4 = 7/12). The explanation
// function already handles any pair — just add puzzles here and add the tier
// to BAKERY_TIERS below with comingSoon: false.
const TIER3 = []

export const BAKERY_TIERS = [
  { id: 'tier1', label: 'Same Slices', puzzles: TIER1, comingSoon: false },
  { id: 'tier2', label: 'Mix It Up', puzzles: TIER2, comingSoon: false },
  { id: 'tier3', label: 'Any Mix', puzzles: TIER3, comingSoon: true },
]

export function pickBakeryPuzzle(tierId) {
  const tier = BAKERY_TIERS.find(t => t.id === tierId) || BAKERY_TIERS[0]
  if (tier.comingSoon || tier.puzzles.length === 0) return null
  return tier.puzzles[Math.floor(Math.random() * tier.puzzles.length)]
}

export function buildBakeryCups(puzzle) {
  // Returns a shuffled array of cup objects, each tagged with an id
  const cups = [
    { ...puzzle.correctA, id: 0 },
    { ...puzzle.correctB, id: 1 },
    ...puzzle.distractors.map((d, i) => ({ ...d, id: i + 2 })),
  ]
  // Shuffle
  for (let i = cups.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cups[i], cups[j]] = [cups[j], cups[i]]
  }
  return cups
}
