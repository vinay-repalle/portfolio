// Era-driven theming: every frame, the current time is turned into a palette
// and written to CSS variables on <html>. Colors hold steady inside an era and
// blend into the next one over the BLEND window just before it starts.
import { ERAS, eraIndexAt } from './story.js'
import { clamp } from './utils.js'

const BLEND = 0.4 // years

const mix = (a, b, p) => a.map((v, i) => Math.round(v + (b[i] - v) * p))
const smooth = (p) => p * p * (3 - 2 * p)

export function paletteAt(t) {
  const i = eraIndexAt(t)
  const cur = ERAS[i]
  const next = ERAS[i + 1]
  const p = next ? smooth(clamp((t - (next.t - BLEND)) / BLEND, 0, 1)) : 0
  const pick = (k) => (next ? mix(cur.rgb[k], next.rgb[k], p) : cur.rgb[k])
  const bg = pick('bg')
  const ink = pick('ink')
  const accent = pick('accent')
  return {
    bg,
    ink,
    accent,
    surface: mix(bg, ink, 0.06),
    line: mix(bg, ink, 0.14),
    muted: mix(bg, ink, 0.55),
  }
}

const KEYS = ['bg', 'ink', 'accent', 'surface', 'line', 'muted']
let meta = null

export function applyPalette(pal) {
  const s = document.documentElement.style
  for (const k of KEYS) {
    const rgb = pal[k].join(' ')
    s.setProperty(`--${k}`, `rgb(${rgb})`)
    s.setProperty(`--${k}-rgb`, rgb)
  }
  meta ??= document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', `rgb(${pal.bg.join(',')})`)
}
