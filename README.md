# Math Mole

A kid-friendly educational web game for ages 7-10. Covers times tables (1-12) and basic fraction equivalence. No backend — all progress is stored in localStorage.

## Quick start

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## How to add mnemonic tricks

Edit `src/data/mnemonics.js`. Add or update a key from 1 to 12 with this shape:

```js
7: {
  trick: "5, 6, 7, 8 — 56 = 7×8!",
  example: "7 × 8 = 56 (think: 5-6-7-8!)",
  emoji: "🎲",
},
```

The `trick` is shown as the main tip text, `example` is shown in monospace below it, and `emoji` appears as a small icon next to the heading.

## How to adjust difficulty weighting

Open `src/components/TimesTablesGame.jsx` and find the `pickQuestion` function. The weight formula is:

```js
const weight = d ? Math.max(1, 5 - Math.floor(accuracy * 5)) : 5
```

- Unseen facts always get weight 5.
- Higher accuracy lowers the weight (so the player sees those facts less often).
- To make the game harder on weak spots, increase the multiplier (e.g. `10 - Math.floor(accuracy * 10)`).
- To make selection more uniform, use a flat weight like `weight = 1`.

## How to add more fraction puzzles

Open `src/data/fractions.js`. Each tier has a `puzzles` array. Add an object like this:

```js
{
  target: { num: 1, den: 5 },
  options: [
    { num: 2, den: 10, correct: true },
    { num: 3, den: 10, correct: false },
    { num: 1, den: 4, correct: false },
    { num: 4, den: 10, correct: false },
    { num: 2, den: 5, correct: false },
    { num: 3, den: 5, correct: false },
  ],
},
```

Rules:
- `target` is the fraction shown to the player.
- `options` should have at least 1 correct and at least 3 wrong entries (the game picks up to 2 correct and 3 wrong at random).
- `correct: true` means the option is equivalent to the target fraction.

## localStorage key reference

| Key | Description |
|-----|-------------|
| `mm_factAccuracy` | Object mapping `AxB` to `{ correct, attempts, recent[] }` |
| `mm_fractionProgress` | Object mapping tier id to `{ correct, attempts }` |
| `mm_points` | Total star points earned |
| `mm_streak` | Current answer streak |
| `mm_bestStreak` | All-time best streak |
| `mm_unlockedBadges` | Array of badge ids (e.g. `["table_2", "table_5"]`) |
| `mm_unlockedCosmetics` | Array of cosmetic ids owned |
| `mm_activeCosmetic` | Id of the currently equipped mole skin |

To reset all progress, run this in the browser console:

```js
Object.keys(localStorage).filter(k => k.startsWith('mm_')).forEach(k => localStorage.removeItem(k))
```
