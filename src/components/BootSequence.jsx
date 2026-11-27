import { useCallback, useEffect, useRef, useState } from 'react'
import { profile } from '../data/portfolio.js'
import { clamp } from '../lib/utils.js'
import './BootSequence.css'

// A fake `git clone` of a life. Any key / click skips it.
const SCRIPT = [
  { at: 0, type: 'cmd', text: `git clone git@github.com:${profile.handle}/life.git` },
  { at: 620, text: `Cloning into '${profile.firstName.toLowerCase()}'...` },
  { at: 780, text: 'remote: Enumerating objects: 2847, done.' },
  { at: 930, text: 'remote: Counting objects: 100% (2847/2847), done.' },
  { at: 1080, type: 'progress', text: 'Receiving objects' },
  { at: 1900, text: 'Resolving deltas: 100% (1337/1337), done.' },
  { at: 2150, type: 'cmd', text: 'git log --graph --all --since=2020' },
]
const PROGRESS_AT = 1080
const PROGRESS_MS = 760
const END_AT = 2950
const EXIT_MS = 650

export default function BootSequence({ onDone }) {
  const [count, setCount] = useState(0)
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)
  const exitTimer = useRef(0)

  const leave = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setLeaving(true)
    exitTimer.current = setTimeout(onDone, EXIT_MS)
  }, [onDone])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone()
      return
    }
    const timers = SCRIPT.map((line, i) => setTimeout(() => setCount(i + 1), line.at))
    timers.push(setTimeout(leave, END_AT))

    const t0 = performance.now()
    let raf = 0
    const tick = (now) => {
      const p = clamp((now - t0 - PROGRESS_AT) / PROGRESS_MS, 0, 1)
      setPct(p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('keydown', leave)
    window.addEventListener('pointerdown', leave)
    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', leave)
      window.removeEventListener('pointerdown', leave)
    }
  }, [leave, onDone])

  useEffect(() => () => clearTimeout(exitTimer.current), [])

  return (
    <div className={`boot ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
      <div className="boot__inner">
        {SCRIPT.slice(0, count).map((line, i) => (
          <div key={i} className={`boot__line boot__line--${line.type ?? 'out'}`}>
            {line.type === 'cmd' && <span className="boot__prompt">~ $</span>}
            {line.type === 'progress' ? (
              <>
                {line.text}: {String(Math.round(pct * 100)).padStart(3, ' ')}%
                <span className="boot__bar">
                  <i style={{ width: `${pct * 100}%` }} />
                </span>
                {pct === 1 && <span className="boot__dim">2.84 MiB | 13.37 MiB/s, done.</span>}
              </>
            ) : (
              <span className={line.type === 'cmd' ? 'boot__typed' : ''} style={{ '--n': line.text.length }}>
                {line.text}
              </span>
            )}
          </div>
        ))}
        <span className="boot__caret" />
      </div>
      <div className="boot__skip">press any key to skip</div>
    </div>
  )
}
