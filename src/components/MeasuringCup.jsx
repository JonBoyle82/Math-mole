// SVG measuring cup — visual analogue of PizzaFraction, used in Fraction Bakery
export default function MeasuringCup({ num, den, size = 90, highlighted = false, selected = false, correct = null }) {
  const cx = size / 2
  const bodyW = size * 0.48
  const bodyH = size * 0.58
  const bodyX = cx - bodyW / 2
  const bodyY = size * 0.12
  const handleX = bodyX + bodyW
  const handleMidY = bodyY + bodyH * 0.5

  const fillRatio = den > 0 ? num / den : 0
  const fillH = fillRatio * (bodyH - 4)
  const fillY = bodyY + bodyH - 2 - fillH

  let strokeColor = '#d1d5db'
  if (correct === true) strokeColor = '#22c55e'
  else if (correct === false) strokeColor = '#f97316'
  else if (selected) strokeColor = '#a855f7'
  else if (highlighted) strokeColor = '#a855f7'

  const strokeW = selected || correct !== null || highlighted ? 3 : 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Cup body background */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx="4" fill="white" />

      {/* Fill liquid */}
      {num > 0 && (
        <rect
          x={bodyX + 2}
          y={fillY}
          width={bodyW - 4}
          height={fillH}
          rx="3"
          fill="#fb923c"
          opacity="0.85"
        />
      )}

      {/* Graduation marks — one per slice boundary */}
      {Array.from({ length: den - 1 }, (_, i) => {
        const markY = bodyY + bodyH - ((i + 1) / den) * bodyH
        const isFilled = i + 1 <= num
        return (
          <line
            key={i}
            x1={bodyX}
            x2={bodyX + bodyW * 0.35}
            y1={markY}
            y2={markY}
            stroke={isFilled ? '#c2410c' : '#9ca3af'}
            strokeWidth="1"
          />
        )
      })}

      {/* Cup outline drawn on top */}
      <rect x={bodyX} y={bodyY} width={bodyW} height={bodyH} rx="4" fill="none" stroke={strokeColor} strokeWidth={strokeW} />

      {/* Pour spout — small notch at top right */}
      <path
        d={`M ${bodyX + bodyW * 0.7} ${bodyY} L ${bodyX + bodyW + 4} ${bodyY - 5} L ${bodyX + bodyW} ${bodyY}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeW}
        strokeLinejoin="round"
      />

      {/* Handle */}
      <path
        d={`M ${handleX} ${handleMidY - bodyH * 0.18} Q ${handleX + size * 0.22} ${handleMidY} ${handleX} ${handleMidY + bodyH * 0.18}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeW}
      />

      {/* Fraction label below cup */}
      <text
        x={cx}
        y={bodyY + bodyH + 14}
        textAnchor="middle"
        fontSize="12"
        fill="#78350f"
        fontWeight="bold"
        fontFamily="Nunito, sans-serif"
      >
        {num}/{den}
      </text>
    </svg>
  )
}
