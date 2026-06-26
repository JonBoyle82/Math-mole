// Fraction equivalence sets for the Pizza Match game
// Distractors are deliberately close — same denominator as a correct answer
// but wrong numerator, or a visually similar size that's mathematically different.

export const FRACTION_TIERS = [
  {
    id: 'tier1',
    label: 'Easy',
    puzzles: [
      {
        target: { num: 1, den: 2 },
        options: [
          { num: 2, den: 4,  correct: true  },
          { num: 4, den: 8,  correct: true  },
          { num: 3, den: 4,  correct: false }, // 3 out of 4 — looks big, not half
          { num: 1, den: 4,  correct: false }, // only a quarter
          { num: 3, den: 8,  correct: false }, // 3/8 < 1/2, easy to confuse
          { num: 5, den: 8,  correct: false }, // 5/8 > 1/2, easy to confuse
        ],
      },
      {
        target: { num: 1, den: 4 },
        options: [
          { num: 2, den: 8,  correct: true  },
          { num: 3, den: 12, correct: true  },
          { num: 3, den: 8,  correct: false }, // same den as correct, wrong count
          { num: 1, den: 8,  correct: false }, // too small
          { num: 4, den: 12, correct: false }, // same den as correct, = 1/3
          { num: 2, den: 12, correct: false }, // same den as correct, = 1/6
        ],
      },
      {
        target: { num: 3, den: 4 },
        options: [
          { num: 6, den: 8,  correct: true  },
          { num: 9, den: 12, correct: true  },
          { num: 5, den: 8,  correct: false }, // same den, off by one slice
          { num: 7, den: 8,  correct: false }, // same den, too many
          { num: 8, den: 12, correct: false }, // same den, = 2/3
          { num: 10, den: 12, correct: false },// same den, > 3/4
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
          { num: 2, den: 6,  correct: true  },
          { num: 4, den: 12, correct: true  },
          { num: 3, den: 6,  correct: false }, // same den as correct, = 1/2
          { num: 1, den: 6,  correct: false }, // same den, too small
          { num: 5, den: 12, correct: false }, // same den, close but wrong
          { num: 3, den: 12, correct: false }, // same den, = 1/4
        ],
      },
      {
        target: { num: 2, den: 3 },
        options: [
          { num: 4, den: 6,  correct: true  },
          { num: 8, den: 12, correct: true  },
          { num: 5, den: 6,  correct: false }, // same den, one too many
          { num: 3, den: 6,  correct: false }, // same den, = 1/2
          { num: 9, den: 12, correct: false }, // same den, = 3/4
          { num: 7, den: 12, correct: false }, // same den, close
        ],
      },
      {
        target: { num: 1, den: 6 },
        options: [
          { num: 2, den: 12, correct: true  },
          { num: 3, den: 12, correct: false }, // same den, = 1/4 — very close visually
          { num: 1, den: 12, correct: false }, // same den, half as much
          { num: 4, den: 12, correct: false }, // same den, = 1/3
          { num: 2, den: 6,  correct: false }, // double the target
          { num: 1, den: 4,  correct: false }, // close in value (0.25 vs 0.167)
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
          { num: 4, den: 10, correct: true  },
          { num: 3, den: 10, correct: false }, // same den, off by one — 0.3 vs 0.4
          { num: 5, den: 10, correct: false }, // same den, = 1/2
          { num: 6, den: 10, correct: false }, // same den, = 3/5
          { num: 3, den: 5,  correct: false }, // same original den, wrong count
          { num: 1, den: 5,  correct: false }, // same original den, half target
        ],
      },
      {
        target: { num: 3, den: 8 },
        options: [
          { num: 6, den: 16, correct: true  },
          { num: 7, den: 16, correct: false }, // same den, off by one
          { num: 5, den: 16, correct: false }, // same den, one under
          { num: 4, den: 8,  correct: false }, // same original den, = 1/2
          { num: 2, den: 8,  correct: false }, // same original den, = 1/4
          { num: 8, den: 16, correct: false }, // same den, = 1/2
        ],
      },
      {
        target: { num: 3, den: 10 },
        options: [
          { num: 6, den: 20, correct: true  },
          { num: 7, den: 20, correct: false }, // same den, off by one
          { num: 5, den: 20, correct: false }, // same den, = 1/4
          { num: 4, den: 10, correct: false }, // same original den, = 2/5
          { num: 2, den: 10, correct: false }, // same original den, = 1/5
          { num: 9, den: 20, correct: false }, // same den, close
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
