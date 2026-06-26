// Mnemonic tricks for times tables
export const MNEMONICS = {
  2: {
    trick: "Double it! ×2 is just adding a number to itself.",
    example: "7 × 2 = 7 + 7 = 14",
    emoji: "✌️",
  },
  3: {
    trick: "Add the digits of the answer — they always add up to a multiple of 3!",
    example: "3 × 7 = 21 → 2+1 = 3 ✓",
    emoji: "🔺",
  },
  4: {
    trick: "Double, then double again! ×4 = ×2 twice.",
    example: "6 × 4 = (6×2)×2 = 12×2 = 24",
    emoji: "🍀",
  },
  5: {
    trick: "Answers always end in 0 or 5. Half the number, then ×10!",
    example: "8 × 5 = (8 ÷ 2) × 10 = 4 × 10 = 40",
    emoji: "🖐️",
  },
  6: {
    trick: "Even number × 6: the answer ends in the same digit!",
    example: "6 × 4 = 24 (ends in 4), 6 × 8 = 48 (ends in 8)",
    emoji: "⚽",
  },
  7: {
    trick: "5, 6, 7, 8 — 56 = 7×8! And count up by 7s: 7,14,21,28,35...",
    example: "7 × 8 = 56 (think: 5-6-7-8!)",
    emoji: "🎲",
  },
  8: {
    trick: "Double three times! ×8 = ×2 ×2 ×2.",
    example: "5 × 8 = 5×2=10, 10×2=20, 20×2=40",
    emoji: "🎱",
  },
  9: {
    trick: "Hold up 10 fingers. Fold down the Nth finger — left side is tens, right side is ones!",
    example: "9 × 3: fold finger 3 → 2 left, 7 right = 27",
    emoji: "🤞",
  },
  10: {
    trick: "Just add a zero! Move the digit one place to the left.",
    example: "7 × 10 = 70",
    emoji: "🔟",
  },
  11: {
    trick: "For 1-9: just repeat the digit! For bigger numbers, add the two digits in the middle.",
    example: "11 × 6 = 66 | 11 × 13 = 1(1+3)3 = 143",
    emoji: "🎳",
  },
  12: {
    trick: "×12 = ×10 + ×2. Multiply by 10, then add the number doubled.",
    example: "12 × 7 = 70 + 14 = 84",
    emoji: "🕛",
  },
}

export function getMnemonic(factor) {
  return MNEMONICS[factor] || {
    trick: `Count up in ${factor}s to find the answer!`,
    example: `Try listing: ${factor}, ${factor*2}, ${factor*3}...`,
    emoji: "⭐",
  }
}
