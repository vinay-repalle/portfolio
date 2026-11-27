import { useRef, useState } from 'react'
import { COMMITS, ERAS, T_END, T_NOW, T_START, YEARS } from '../lib/story.js'
import { fmtMonth } from '../lib/utils.js'
import './TimeScrubber.css'

const SPAN = T_END - T_START
const pct = (t) => `${((t - T_START) / SPAN) * 100}%`

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
  </svg>
)
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
    <rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor" />
  </svg>
)

export default function TimeScrubber({ time, layout, playing, onTogglePlay, onScrubStart, onScrub }) {
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const { gl, gr, compact } = layout

  const tFromX = (clientX) => {
    const r = trackRef.current.getBoundingClientRect()
    return T_START + ((clientX - r.left) / r.width) * SPAN
  }

  const down = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    trackRef.current.setPointerCapture(e.pointerId)
    setDragging(true)
    onScrubStart()
    onScrub(tFromX(e.clientX))
  }
  const move = (e) => {
    if (dragging) onScrub(tFromX(e.clientX))
  }
  const up = () => setDragging(false)

  return (
    <div
      className={`scrubber ${compact ? 'is-compact' : ''} ${dragging ? 'is-dragging' : ''}`}
      style={{ '--gl': `${gl}px`, '--gr': `${gr}px` }}
    >
      <div className="scrubber__side">
        {!compact && <span className="kbd scrubber__key">space</span>}
        <button
          className={`play ${playing ? 'is-playing' : ''}`}
          onClick={onTogglePlay}
          aria-label={playing ? 'Pause' : 'Play the whole story'}
          data-cursor={playing ? 'pause' : 'play'}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>

      <div
        className="track"
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Timeline"
        aria-valuemin={Math.floor(T_START)}
        aria-valuemax={Math.floor(T_NOW)}
        aria-valuenow={Number(time.toFixed(2))}
        aria-valuetext={fmtMonth(time)}
        data-cursor="scrub"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
      >
        {/* each era's color as a thin band */}
        <div className="track__eras">
          {ERAS.map((e, i) => {
            const end = Math.min(ERAS[i + 1]?.t ?? T_NOW, T_NOW)
            return (
              <span
                key={e.at}
                title={e.title}
                style={{ left: pct(e.t), width: `${((end - e.t) / SPAN) * 100}%`, background: e.accent }}
              />
            )
          })}
        </div>
        <div className="track__rail" />
        <div className="track__future" style={{ left: pct(T_NOW) }} />
        <div className="track__fill" style={{ width: pct(time) }} />

        {YEARS.filter((y) => y <= T_NOW && (!compact || y % 2 === 0)).map((y) => (
          <span key={y} className="track__tick" style={{ left: pct(y) }}>
            {compact ? `’${String(y).slice(2)}` : y}
          </span>
        ))}

        {COMMITS.map((c) => (
          <span
            key={c.id}
            className={`track__pip ${c.t <= time + 1e-6 ? 'is-past' : ''}`}
            style={{ left: pct(c.t), '--c': c.color }}
          />
        ))}

        <div className="track__handle" style={{ left: pct(time) }}>
          <span className="track__bubble">{fmtMonth(time)}</span>
        </div>
      </div>

      {!compact && <div />}
    </div>
  )
}
