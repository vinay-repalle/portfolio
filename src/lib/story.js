// Turns the raw content in data/portfolio.js into the shapes the UI needs.
import { branches, commits, eras, timeline } from '../data/portfolio.js'
import { hexToRgb, rng, toT } from './utils.js'

export const T_START = toT(timeline.start)
export const T_NOW = toT(timeline.now)
export const T_END = toT(timeline.future)

export const BRANCHES = branches.map((b, lane) => ({
  ...b,
  lane,
  tFork: b.forkAt ? toT(b.forkAt) : T_START,
  tMerge: b.mergeAt ? toT(b.mergeAt) : null,
  cssColor: b.color === 'ink' ? 'var(--ink)' : b.color === 'accent' ? 'var(--accent)' : b.color,
}))
export const BRANCH = Object.fromEntries(BRANCHES.map((b) => [b.id, b]))
export const MAIN = BRANCH.main

function expandHash(short) {
  const r = rng(short)
  let s = short
  while (s.length < 40) s += Math.floor(r() * 16).toString(16)
  return s
}

const laneCount = {}
export const COMMITS = commits
  .map((c) => ({ ...c, t: toT(c.date) }))
  .sort((a, b) => a.t - b.t)
  .map((c, index) => {
    // alternate labels above/below along each lane so neighbours never collide
    const n = (laneCount[c.branch] = (laneCount[c.branch] ?? -1) + 1)
    return {
      ...c,
      index,
      labelUp: n % 2 === 0,
      fullHash: expandHash(c.hash),
      color: BRANCH[c.branch].cssColor,
    }
  })
export const COMMIT = Object.fromEntries(COMMITS.map((c) => [c.id, c]))

export const ERAS = eras.map((e) => ({
  ...e,
  t: toT(e.at),
  rgb: { bg: hexToRgb(e.bg), ink: hexToRgb(e.ink), accent: hexToRgb(e.accent) },
}))

export const YEARS = []
for (let y = Math.ceil(T_START); y <= Math.floor(T_END); y++) YEARS.push(y)

// ── the time axis ─────────────────────────────────────────────────────────
// Screen position is not linear in time. Every commit, fork and merge gets a
// guaranteed slice of width and the calendar fills the rest, so quiet years
// shrink and busy months stretch ("time dilation") — labels never pile up.
// u ∈ [0, 1] is the horizontal position; uAt / tAt convert both ways.
const TIME_SHARE = 0.25 // share of the past that follows the calendar
const FUTURE_SHARE = 0.06 // width of the uncommitted zone after "now"

const keyTimes = [
  ...new Set(
    [T_START, T_NOW, ...COMMITS.map((c) => c.t), ...BRANCHES.flatMap((b) => [b.tFork, b.tMerge])]
      .filter((t) => t != null && t >= T_START && t <= T_NOW)
      .map((t) => Number(t.toFixed(6))),
  ),
].sort((a, b) => a - b)

const AXIS_T = [...keyTimes, T_END]
const AXIS_U = [0]
{
  const gaps = keyTimes.length - 1
  let acc = 0
  for (let i = 0; i < gaps; i++) {
    acc += (TIME_SHARE * (keyTimes[i + 1] - keyTimes[i])) / (T_NOW - T_START) + (1 - TIME_SHARE) / gaps
    AXIS_U.push(acc * (1 - FUTURE_SHARE))
  }
  AXIS_U.push(1)
}

function interp(xs, ys, v) {
  const n = xs.length - 1
  if (v <= xs[0]) return ys[0]
  if (v >= xs[n]) return ys[n]
  let lo = 0
  let hi = n
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (xs[mid] <= v) lo = mid
    else hi = mid
  }
  return ys[lo] + ((v - xs[lo]) / (xs[hi] - xs[lo])) * (ys[hi] - ys[lo])
}

/** time → horizontal position (0..1) */
export const uAt = (t) => interp(AXIS_T, AXIS_U, t)
/** horizontal position (0..1) → time */
export const tAt = (u) => interp(AXIS_U, AXIS_T, u)
export const U_NOW = uAt(T_NOW)

export function eraIndexAt(t) {
  let i = 0
  for (let k = 0; k < ERAS.length; k++) if (t >= ERAS[k].t - 1e-6) i = k
  return i
}

/** The newest commit at or before time t (what HEAD points to). */
export function lastCommitAt(t) {
  let last = null
  for (const c of COMMITS) if (c.t <= t + 1e-6) last = c
  return last
}

export function statsAt(t) {
  const commitCount = COMMITS.filter((c) => c.t <= t + 1e-6).length
  const active = BRANCHES.filter((b) => b.tFork <= t + 1e-6 && (b.tMerge == null || t < b.tMerge - 1e-6)).length
  return { commitCount, active }
}
