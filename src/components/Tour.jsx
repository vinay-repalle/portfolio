import { memo, useEffect, useRef } from 'react'
import { tour } from '../data/portfolio.js'
import { clamp } from '../lib/utils.js'
import './Tour.css'

// Which element each step spotlights (null → centered card, everything dimmed).
const TARGETS = {
  welcome: '.hero__intro',
  graph: '.graph',
  travel: '.scrubber .track',
  eras: '.hero__era',
  commit: '.panel',
  terminal: '.term',
  contact: '.ghost',
  finish: null,
}
const ROUND = { contact: true }
const PAD = 12 // breathing room around a spotlighted element
const EDGE = 12 // min distance from the viewport edge
const GAP = 18 // distance between spotlight and card
const EASE = 0.16 // how quickly spotlight + card glide to their targets

/** `backticks` → <code> */
const rich = (text) => text.split('`').map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))

/** Where the card goes: below, above, right or left of the target — whichever fits. */
function placeCard(t, cw, ch, vw, vh) {
  if (!t) return { x: (vw - cw) / 2, y: (vh - ch) / 2 }
  const below = vh - (t.y + t.h)
  const above = t.y
  const right = vw - (t.x + t.w)
  const left = t.x
  const midX = t.x + t.w / 2 - cw / 2
  const midY = t.y + t.h / 2 - ch / 2
  let p
  if (below >= ch + GAP + EDGE) p = { x: midX, y: t.y + t.h + GAP }
  else if (above >= ch + GAP + EDGE) p = { x: midX, y: t.y - GAP - ch }
  else if (right >= cw + GAP + EDGE) p = { x: t.x + t.w + GAP, y: midY }
  else if (left >= cw + GAP + EDGE) p = { x: t.x - GAP - cw, y: midY }
  else p = { x: (vw - cw) / 2, y: above > below ? EDGE : vh - ch - EDGE }
  return { x: clamp(p.x, EDGE, vw - cw - EDGE), y: clamp(p.y, EDGE, vh - ch - EDGE) }
}

function Tour({ step, index, eraTitle, onNext, onBack, onEnd, onReplay }) {
  const open = step != null
  const total = tour.steps.length
  const spotRef = useRef(null)
  const cardRef = useRef(null)
  const stepRef = useRef(step)
  const cur = useRef(null)

  // keep showing the last step while the overlay fades out
  const lastRef = useRef({ step, index })
  if (step) lastRef.current = { step, index }
  const shown = lastRef.current
  const isLast = shown.index === total - 1

  useEffect(() => {
    stepRef.current = step
  }, [step])

  // Follow the target every frame — it may be sliding in (panel, terminal).
  useEffect(() => {
    if (!open) {
      cur.current = null
      return
    }
    let raf = 0
    const frame = () => {
      const s = stepRef.current
      const spot = spotRef.current
      const card = cardRef.current
      if (s && spot && card) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const sel = TARGETS[s.id]
        const el = sel ? document.querySelector(sel) : null
        let t = null
        if (el) {
          const r = el.getBoundingClientRect()
          const p = ROUND[s.id] ? 18 : PAD
          const x1 = clamp(r.left - p, 6, vw - 6)
          const y1 = clamp(r.top - p, 6, vh - 6)
          const x2 = clamp(r.right + p, 6, vw - 6)
          const y2 = clamp(r.bottom + p, 6, vh - 6)
          t = { x: x1, y: y1, w: x2 - x1, h: y2 - y1 }
        }
        const ring = t ?? { x: vw / 2, y: vh / 2, w: 0, h: 0 }
        const pos = placeCard(t, card.offsetWidth, card.offsetHeight, vw, vh)

        const c = cur.current ?? { ...ring, cx: pos.x, cy: pos.y }
        c.x += (ring.x - c.x) * EASE
        c.y += (ring.y - c.y) * EASE
        c.w += (ring.w - c.w) * EASE
        c.h += (ring.h - c.h) * EASE
        c.cx += (pos.x - c.cx) * EASE
        c.cy += (pos.y - c.cy) * EASE
        cur.current = c

        spot.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`
        spot.style.width = `${c.w}px`
        spot.style.height = `${c.h}px`
        card.style.transform = `translate3d(${c.cx}px, ${c.cy}px, 0)`
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [open])

  // Tour owns the keyboard while it runs (capture phase, before anything else).
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      const k = e.key
      const handled = ['Escape', 'ArrowRight', 'ArrowLeft', 'Enter', ' '].includes(k) || ((e.metaKey || e.ctrlKey) && k.toLowerCase() === 'k')
      if (!handled) return
      e.preventDefault()
      e.stopPropagation()
      if (k === 'Escape') onEnd()
      else if (k === 'ArrowRight' || k === 'Enter') onNext()
      else if (k === 'ArrowLeft') onBack()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onNext, onBack, onEnd])

  const s = shown.step
  return (
    <div className={`tour ${open ? 'is-open' : ''}`} aria-hidden={!open} inert={!open}>
      <div
        ref={spotRef}
        className={`tour__spot ${s && ROUND[s.id] ? 'is-round' : ''} ${s && !TARGETS[s.id] ? 'is-empty' : ''}`}
      />
      <div ref={cardRef} className="tour__card" role="dialog" aria-modal="true" aria-label="Guided tour">
        {s && (
          <>
            <div className="tour__bar">
              <i style={{ width: `${((shown.index + 1) / total) * 100}%` }} />
            </div>
            <div className="tour__meta">
              <span>
                <span className="accent">❯</span> tour
              </span>
              <span>
                {shown.index + 1} / {total}
              </span>
            </div>
            <div className="tour__body" key={s.id}>
              <h3 className="tour__title">{s.title}</h3>
              <p className="tour__text">{rich(s.text.replace('{era}', eraTitle))}</p>
            </div>

            {isLast ? (
              <div className="tour__actions">
                <button className="btn btn--sm" onClick={onReplay} data-cursor="play">
                  ▶ Replay my story
                </button>
                <button className="btn btn--accent btn--sm" onClick={onEnd} data-cursor="go">
                  Start exploring
                </button>
              </div>
            ) : (
              <div className="tour__actions">
                <button className="tour__skip" onClick={onEnd} data-cursor="skip">
                  skip tour
                </button>
                <div className="tour__nav">
                  <button className="btn btn--sm btn--icon" onClick={onBack} disabled={shown.index === 0} aria-label="Previous step">
                    ←
                  </button>
                  <button className="btn btn--accent btn--sm" onClick={onNext} data-cursor="next">
                    {shown.index === 0 ? "Let's go →" : 'Next →'}
                  </button>
                </div>
              </div>
            )}

            <div className="tour__keys">
              <span className="kbd">→</span> next <span className="kbd">←</span> back <span className="kbd">esc</span> skip
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** The little "First time here?" card that offers the tour. */
export function TourPrompt({ show, onStart, onDismiss }) {
  const { hint, title, text } = tour.prompt
  return (
    <div className={`tour-prompt ${show ? 'is-open' : ''}`} inert={!show} role="dialog" aria-label={title}>
      <div className="tour-prompt__hint">
        <span className="pulse-dot" /> {hint}
      </div>
      <div className="tour-prompt__title">{title}</div>
      <p>{text}</p>
      <div className="tour-prompt__actions">
        <button className="btn btn--accent btn--sm" onClick={onStart} data-cursor="tour">
          Take the tour →
        </button>
        <button className="btn btn--sm" onClick={onDismiss}>
          I’ll explore
        </button>
      </div>
    </div>
  )
}

export default memo(Tour)
