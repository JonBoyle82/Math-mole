// SVG pizza slice renderer
export default function PizzaFraction({ num, den, size = 100, highlighted = false, selected = false, correct = null }) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.44
  const slices = []

  for (let i = 0; i < den; i++) {
    const startAngle = (i / den) * 2 * Math.PI - Math.PI / 2
    const endAngle = ((i + 1) / den) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const largeArc = 1 / den > 0.5 ? 1 : 0
    const filled = i < num

    slices.push(
      <path
        key={i}
        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={filled ? '#f97316' : '#fef3c7'}
        stroke="#92400e"
        strokeWidth="1.5"
      />
    )
  }

  let ringColor = '#e5e7eb'
  if (correct === true) ringColor = '#22c55e'
  else if (correct === false) ringColor = '#f97316'
  else if (selected) ringColor = '#a855f7'
  else if (highlighted) ringColor = '#a855f7'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r + 4} fill="white" stroke={ringColor} strokeWidth={selected || correct !== null ? 4 : 2} />
      {slices}
      {/* crust */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#92400e" strokeWidth="2" />
      {/* fraction label */}
      <text x={cx} y={size - 6} textAnchor="middle" fontSize="11" fill="#78350f" fontWeight="bold" fontFamily="Nunito">
        {num}/{den}
      </text>
    </svg>
  )
}
