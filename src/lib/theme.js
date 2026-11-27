// Era-driven theming: every frame, the current time is turned into a palette
// and written to CSS variables on <html>. Colors hold steady inside an era and
// blend into the next one just before it starts. The blend is measured in
// screen space (u), so it looks the same in dense and quiet parts of the graph.
import { ERAS, eraIndexAt, uAt } from './story.js'
import { clamp } from './utils.js'

const BLEND_U = 0.045 // max blend width, as a share of the timeline

const mix = (a, b, p) => a.map((v, i) => Math.round(v + (b[i] - v) * p))
const smooth = (p) => p * p * (3 - 2 * p)

export function paletteAt(t) {
  const i = eraIndexAt(t)
  const cur = ERAS[i]
  const next = ERAS[i + 1]
  let p = 0
  if (next) {
    const uNext = uAt(next.t)
    const blend = Math.min(BLEND_U, (uNext - uAt(cur.t)) * 0.5)
    p = smooth(clamp((uAt(t) - (uNext - blend)) / blend, 0, 1))
  }
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
