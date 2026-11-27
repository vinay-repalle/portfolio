import { useMemo } from 'react'
import { rng } from '../lib/utils.js'

const W = 400
const H = 200
const COLS = 16
const ROWS = 8

// Deterministic generative cover for a commit: the hash seeds a little
// "fingerprint" of dots, rings and branch curves. Same hash → same art.
export default function CommitArt({ seed, color }) {
  const art = useMemo(() => {
    const r = rng(seed)
    const cw = W / COLS
    const ch = H / ROWS
    const cells = []
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const p = r()
        const cx = i * cw + cw / 2
        const cy = j * ch + ch / 2
        if (p < 0.11) cells.push({ k: 'dot', cx, cy, r: 3 + r() * 6 })
        else if (p < 0.19) cells.push({ k: 'ring', cx, cy, r: 4 + r() * 6 })
        else if (p < 0.24) cells.push({ k: 'sq', cx, cy, s: 5 + r() * 6 })
        else cells.push({ k: 'pin', cx, cy, o: 0.12 + r() * 0.18 })
      }
    }
    const curves = Array.from({ length: 3 + Math.floor(r() * 3) }, () => {
      const y0 = r() * H
      const y1 = r() * H
      const mid = 0.3 + r() * 0.4
      return `M -10 ${y0.toFixed(1)} C ${(W * mid).toFixed(1)} ${y0.toFixed(1)}, ${(W * mid).toFixed(1)} ${y1.toFixed(1)}, ${W + 10} ${y1.toFixed(1)}`
    })
    const sun = { cx: W * (0.55 + r() * 0.35), cy: H * (0.2 + r() * 0.6), r: 46 + r() * 60 }
    return { cells, curves, sun }
  }, [seed])

  const id = `sun-${seed.slice(0, 10)}`
  return (
    <svg className="art" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" style={{ '--c': color }} aria-hidden="true">
      <defs>
        <radialGradient id={id}>
          <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect className="art__bg" width={W} height={H} />
      <circle className="art__sun" cx={art.sun.cx} cy={art.sun.cy} r={art.sun.r} fill={`url(#${id})`} />
      {art.curves.map((d, i) => (
        <path key={i} className="art__curve" d={d} pathLength="1" style={{ animationDelay: `${i * 0.12}s` }} />
      ))}
      {art.cells.map((c, i) => {
        const delay = { animationDelay: `${0.2 + (i % COLS) * 0.025}s` }
        if (c.k === 'dot') return <circle key={i} className="art__cell art__dot" cx={c.cx} cy={c.cy} r={c.r} style={delay} />
        if (c.k === 'ring') return <circle key={i} className="art__cell art__ring" cx={c.cx} cy={c.cy} r={c.r} style={delay} />
        if (c.k === 'sq')
          return <rect key={i} className="art__cell art__dot" x={c.cx - c.s / 2} y={c.cy - c.s / 2} width={c.s} height={c.s} rx={1.5} style={delay} />
        return <circle key={i} className="art__pin" cx={c.cx} cy={c.cy} r={1.2} opacity={c.o} />
      })}
    </svg>
  )
}
