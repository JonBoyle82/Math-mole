import { useEffect, useState } from 'react'

const COLORS = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#A8E6CF', '#FF8B94', '#B4F8C8', '#FBE7C6']
const SHAPES = ['●', '■', '▲', '★', '♦']

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!active) { setPieces([]); return }
    const newPieces = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      shape: SHAPES[i % SHAPES.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      size: 12 + Math.random() * 12,
    }))
    setPieces(newPieces)
    const t = setTimeout(() => setPieces([]), 1500)
    return () => clearTimeout(t)
  }, [active])

  if (!pieces.length) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map(p => (
        <div
          key={p.id}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            color: p.color,
            fontSize: p.size,
            animation: `confettiFall 1.2s ease-out ${p.delay}s forwards`,
          }}
        >
          {p.shape}
        </div>
      ))}
    </div>
  )
}
