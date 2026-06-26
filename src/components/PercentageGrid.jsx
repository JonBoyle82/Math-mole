// Flexible percentage grid — rows/cols/fillIndices all passed by parent
// so the parent can vary shape and scatter per puzzle without re-randomising on re-render.
export default function PercentageGrid({ rows, cols, fillIndices, width = 220 }) {
  const gap = 3
  const cellSize = (width - gap * (cols + 1)) / cols
  const height = rows * cellSize + gap * (rows + 1)
  const filledSet = new Set(fillIndices)

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block' }}
    >
      {Array.from({ length: rows * cols }, (_, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = gap + col * (cellSize + gap)
        const y = gap + row * (cellSize + gap)
        const filled = filledSet.has(i)
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            rx={Math.min(4, cellSize * 0.15)}
            fill={filled ? '#f97316' : '#fef3c7'}
            stroke={filled ? '#c2410c' : '#fde68a'}
            strokeWidth={0.8}
          />
        )
      })}
    </svg>
  )
}
