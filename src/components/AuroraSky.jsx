import { AURORA } from '../lib/theme.js'
import { hexToRgb } from '../lib/utils.js'

// Big soft glows in past eras' colors, drifting slowly (transform-only, so the
// animation stays on the compositor). Faded in by --aurora; see global.css.
// Each glow picks a stop by its share of the way through the AURORA list.
const GLOWS = [
  { at: 0.7, x: '58%', y: '-34%', s: '78vw', d: '26s', delay: '0s', dx: '-8vw', dy: '6vh' },
  { at: 0.4, x: '18%', y: '-40%', s: '62vw', d: '31s', delay: '-9s', dx: '10vw', dy: '8vh' },
  { at: 0, x: '-22%', y: '58%', s: '64vw', d: '29s', delay: '-4s', dx: '9vw', dy: '-7vh' },
  { at: 0.25, x: '70%', y: '72%', s: '46vw', d: '34s', delay: '-15s', dx: '-6vw', dy: '-8vh' },
]

export default function AuroraSky() {
  if (!AURORA.length) return null
  return (
    <div className="aurora-sky" aria-hidden="true">
      {GLOWS.map((g, i) => (
        <i
          key={i}
          style={{
            left: g.x,
            top: g.y,
            '--s': g.s,
            '--d': g.d,
            '--delay': g.delay,
            '--dx': g.dx,
            '--dy': g.dy,
            '--c': hexToRgb(AURORA[Math.round(g.at * (AURORA.length - 1))]).join(' '),
          }}
        />
      ))}
    </div>
  )
}
