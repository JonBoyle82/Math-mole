// 10×10 grid showing a shaded percentage — visual anchor for Tier 1
export default function PercentageGrid({ pct, size = 220 }) {
  const total = 100
  const cellGap = 2
  const cols = 10
  const cellSize = (size - cellGap * (cols + 1)) / cols

  const cells = Array.from({ length: total }, (_, i) => i < pct)

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block' }}
    >
      {cells.map((filled, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = cellGap + col * (cellSize + cellGap)
        const y = cellGap + row * (cellSize + cellGap)
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            rx={2}
            fill={filled ? '#f97316' : '#fef3c7'}
            stroke={filled ? '#c2410c' : '#fde68a'}
            strokeWidth={0.5}
          />
        )
      })}
    </svg>
  )
}
