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
