// Fraction equivalence sets for the Pizza Match game
// Each "puzzle" has a target fraction and a set of options (some equivalent, some not)
// Tier 1: halves, quarters; Tier 2: thirds, sixths; Tier 3: fifths, eighths, tenths

export const FRACTION_TIERS = [
  {
    id: 'tier1',
    label: 'Easy',
    puzzles: [
      {
        target: { num: 1, den: 2 },
        options: [
          { num: 2, den: 4, correct: true },
          { num: 3, den: 6, correct: true },
          { num: 1, den: 3, correct: false },
          { num: 2, den: 3, correct: false },
          { num: 3, den: 4, correct: false },
          { num: 4, den: 8, correct: true },
        ],
      },
      {
        target: { num: 1, den: 4 },
        options: [
          { num: 2, den: 8, correct: true },
          { num: 3, den: 12, correct: true },
          { num: 1, den: 2, correct: false },
          { num: 2, den: 6, correct: false },
          { num: 3, den: 8, correct: false },
          { num: 4, den: 12, correct: false },
        ],
      },
      {
        target: { num: 3, den: 4 },
        options: [
          { num: 6, den: 8, correct: true },
          { num: 9, den: 12, correct: true },
          { num: 2, den: 4, correct: false },
          { num: 4, den: 6, correct: false },
          { num: 3, den: 8, correct: false },
          { num: 2, den: 8, correct: false },
        ],
      },
    ],
  },
  {
    id: 'tier2',
    label: 'Medium',
    puzzles: [
      {
        target: { num: 1, den: 3 },
        options: [
          { num: 2, den: 6, correct: true },
          { num: 4, den: 12, correct: true },
          { num: 1, den: 4, correct: false },
          { num: 2, den: 4, correct: false },
          { num: 3, den: 6, correct: false },
          { num: 3, den: 12, correct: false },
        ],
      },
      {
        target: { num: 2, den: 3 },
        options: [
          { num: 4, den: 6, correct: true },
          { num: 8, den: 12, correct: true },
          { num: 3, den: 6, correct: false },
          { num: 5, den: 6, correct: false },
          { num: 6, den: 12, correct: false },
          { num: 3, den: 4, correct: false },
        ],
      },
      {
        target: { num: 1, den: 6 },
        options: [
          { num: 2, den: 12, correct: true },
          { num: 1, den: 3, correct: false },
          { num: 3, den: 12, correct: false },
          { num: 2, den: 6, correct: false },
          { num: 1, den: 4, correct: false },
          { num: 4, den: 12, correct: false },
        ],
      },
    ],
  },
  {
    id: 'tier3',
    label: 'Tricky',
    puzzles: [
      {
        target: { num: 2, den: 5 },
        options: [
          { num: 4, den: 10, correct: true },
          { num: 3, den: 5, correct: false },
          { num: 1, den: 5, correct: false },
          { num: 6, den: 10, correct: false },
          { num: 2, den: 10, correct: false },
          { num: 4, den: 8, correct: false },
        ],
      },
      {
        target: { num: 3, den: 8 },
        options: [
          { num: 6, den: 16, correct: true },
          { num: 5, den: 8, correct: false },
          { num: 1, den: 4, correct: false },
          { num: 3, den: 4, correct: false },
          { num: 9, den: 16, correct: false },
          { num: 6, den: 8, correct: false },
        ],
      },
      {
        target: { num: 3, den: 10 },
        options: [
          { num: 6, den: 20, correct: true },
          { num: 4, den: 10, correct: false },
          { num: 1, den: 10, correct: false },
          { num: 3, den: 5, correct: false },
          { num: 9, den: 20, correct: false },
          { num: 2, den: 10, correct: false },
        ],
      },
    ],
  },
]

export function getExplanation(target, chosen) {
  if (target.den === chosen.den) {
    return `Both show ${target.num} out of ${target.den} pieces — exactly the same!`
  }
  const factor = chosen.den / target.den
  if (Number.isInteger(factor) && factor > 1) {
    return `We cut each piece into ${factor} smaller pieces. ${target.num} pieces becomes ${chosen.num} pieces, but it's the same amount of pizza! 🍕`
  }
  const targetSimple = simplify(target.num, target.den)
  return `${chosen.num}/${chosen.den} = ${targetSimple.num}/${targetSimple.den} — the same amount, just cut differently!`
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b) }
export function simplify(num, den) {
  const g = gcd(num, den)
  return { num: num / g, den: den / g }
}
