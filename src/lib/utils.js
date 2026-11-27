export const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * 'YYYY-MM' or 'YYYY-MM-DD' → decimal year (2021-07 → 2021.5).
 * Time is a decimal year everywhere. Days use 1/372 (12 × 31) so a date
 * never spills into the next month.
 */
export function toT(date) {
  const [y, m = 1, d = 1] = String(date).split('-').map(Number)
  return y + (m - 1) / 12 + (d - 1) / 372
}

/** 'YYYY-MM-DD' → 'Oct 28, 2026' · 'YYYY-MM' → 'Oct 2026' */
export function fmtDate(date) {
  const [y, m = 1, d] = String(date).split('-').map(Number)
  return d ? `${MONTHS[m - 1]} ${d}, ${y}` : `${MONTHS[m - 1]} ${y}`
}

/** decimal year → 'Mar 2022' */
export function fmtMonth(t) {
  const y = Math.floor(t + 1e-6)
  const m = clamp(Math.floor((t - y) * 12 + 1e-6), 0, 11)
  return `${MONTHS[m]} ${y}`
}

export function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Small seeded PRNG (mulberry32 over a string hash) for deterministic art. */
export function rng(seed) {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)
