import { useEffect, useState } from 'react'
import { clamp } from './utils.js'

// gl / gr = left & right gutters. The graph and the scrubber share them so
// the scrubber track lines up exactly with the graph's time axis.
function measure() {
  const w = window.innerWidth
  const compact = w < 760
  return {
    compact,
    gl: compact ? 20 : clamp(Math.round(w * 0.11), 150, 210),
    gr: compact ? 20 : 56,
  }
}

export function useLayout() {
  const [layout, setLayout] = useState(measure)
  useEffect(() => {
    const onResize = () => setLayout(measure())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return layout
}

export function useReducedMotion() {
  const query = '(prefers-reduced-motion: reduce)'
  const [reduced, setReduced] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}
