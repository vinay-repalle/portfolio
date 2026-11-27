import { useId, useMemo } from 'react'
import { profile } from '../data/portfolio.js'
import { AURORA } from '../lib/theme.js'
import { rng } from '../lib/utils.js'

const N = 5 // 5×5 grid, mirrored left ↔ right like a GitHub identicon
const HALF = Math.ceil(N / 2)

/** Seeded on-cells for the left half (+ middle column). Retries until the
 *  pattern is neither too sparse nor too solid, so it always reads as a face. */
function cellsFor(seed) {
  for (let attempt = 0; ; attempt++) {
    const r = rng(`${seed}#${attempt}`)
    const on = []
    for (let y = 0; y < N; y++) for (let x = 0; x < HALF; x++) if (r() < 0.5) on.push([x, y])
    const filled = on.length / (N * HALF)
    if ((filled > 0.4 && filled < 0.65) || attempt > 20) return on
  }
}

/** A generated identicon for me. Drawn in the era's accent, so it re-themes. */
export default function Avatar({ size = 40, seed = profile.handle, className = '' }) {
  const cells = useMemo(() => cellsFor(seed), [seed])
  const gradId = `aurora-${useId().replace(/:/g, '')}`
  const pad = 0.75
  const box = N + pad * 2
  const pixels = cells.flatMap(([x, y]) =>
    (x === N - 1 - x ? [x] : [x, N - 1 - x]).map((cx) => (
      <rect key={`${cx}-${y}`} x={pad + cx} y={pad + y} width={1.02} height={1.02} />
    )),
  )
  return (
    <svg
      className={`avatar ${className}`}
      width={size}
      height={size}
      viewBox={`0 0 ${box} ${box}`}
      role="img"
      aria-label={`${profile.name}'s avatar`}
      shapeRendering="crispEdges"
    >
      {/* CSS variables only work through style, not SVG presentation attributes */}
      <rect width={box} height={box} rx={box * 0.22} style={{ fill: 'rgb(var(--accent-rgb) / 0.12)' }} />
      <defs>
        {/* userSpace, so one gradient spans the whole face, not each pixel */}
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={pad} y1={pad} x2={pad + N} y2={pad + N}>
          {AURORA.map((c, i) => (
            <stop key={c} offset={i / Math.max(1, AURORA.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
      </defs>
      {/* solid accent, cross-fading to the aurora gradient in aurora eras */}
      <g style={{ fill: 'var(--accent)', opacity: 'calc(1 - var(--aurora, 0))' }}>{pixels}</g>
      <g style={{ fill: `url(#${gradId})`, opacity: 'var(--aurora, 0)' }}>{pixels}</g>
    </svg>
  )
}
