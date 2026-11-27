import { useEffect, useMemo, useRef, useState } from 'react'
import { futureCommit } from '../data/portfolio.js'
import { BRANCH, BRANCHES, COMMIT, COMMITS, MAIN, T_END, T_NOW, T_START, YEARS, lastCommitAt, tAt, uAt } from '../lib/story.js'
import { clamp, fmtDate, fmtMonth } from '../lib/utils.js'
import './GitGraph.css'

const PAD_T = 58
const PAD_B = 68
const T_GHOST = T_NOW + (T_END - T_NOW) * 0.55

function NodeShape({ kind }) {
  switch (kind) {
    case 'job':
      return <rect className="fill" x={-6.5} y={-6.5} width={13} height={13} rx={2.5} transform="rotate(45)" />
    case 'milestone':
      return <path className="fill" d="M0 -11 L3 -3 L11 0 L3 3 L0 11 L-3 3 L-11 0 L-3 -3 Z" />
    case 'merge':
      return (
        <>
          <circle className="ring" r={8.5} />
          <circle className="fill" r={3.5} />
        </>
      )
    case 'edu':
      return <circle className="ring ring--thick" r={6.5} />
    case 'life':
      return <circle className="fill" r={5} />
    default:
      return <circle className="fill" r={7} />
  }
}

export default function GitGraph({ time, layout, selectedId, showHint, onSelect, onFuture, onScrubStart, onScrub }) {
  const wrapRef = useRef(null)
  const drag = useRef(null)
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [hoverId, setHoverId] = useState(null)

  useEffect(() => {
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: Math.round(width), h: Math.round(height) })
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const { w, h } = size
  const { gl, gr, compact } = layout
  const innerW = Math.max(1, w - gl - gr)
  const curve = compact ? 22 : 40
  const x = (t) => gl + uAt(t) * innerW
  const laneGap = (h - PAD_T - PAD_B) / Math.max(1, BRANCHES.length - 1)
  const laneY = (lane) => PAD_T + lane * laneGap
  const yMain = laneY(MAIN.lane)

  // Branch lines: a branch curves off main and reaches its lane at forkAt,
  // then (if merged) curves back into main exactly at mergeAt.
  const paths = useMemo(() => {
    if (!w) return []
    return BRANCHES.map((b) => {
      const yl = laneY(b.lane)
      if (b.id === MAIN.id) return { b, d: `M ${x(T_START)} ${yl} H ${x(T_END)}` }
      const x0 = x(b.tFork)
      let d = `M ${x0 - curve} ${yMain} C ${x0 - curve / 2} ${yMain}, ${x0 - curve / 2} ${yl}, ${x0} ${yl}`
      if (b.tMerge != null) {
        const x1 = x(b.tMerge)
        d += ` H ${x1 - curve} C ${x1 - curve / 2} ${yl}, ${x1 - curve / 2} ${yMain}, ${x1} ${yMain}`
      } else {
        d += ` H ${x(T_END)}`
      }
      return { b, d }
    })
    // x / laneY are pure functions of these values
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h, gl, gr, curve])

  const px = x(time)
  const head = lastCommitAt(time)
  const hover = hoverId ? COMMIT[hoverId] : null

  // drag anywhere on the graph to scrub ("grab the timeline")
  const onPointerDown = (e) => {
    if (e.button !== 0 || e.target.closest('.node, .ghost')) return
    drag.current = { x0: e.clientX, t0: time, id: e.pointerId, active: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x0
    if (!d.active && Math.abs(dx) > 5) {
      d.active = true
      e.currentTarget.setPointerCapture(d.id)
      onScrubStart()
    }
    if (d.active) onScrub(tAt(uAt(d.t0) - dx / innerW))
  }
  const onPointerUp = () => {
    drag.current = null
  }

  const activate = (fn) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      e.stopPropagation()
      fn()
    }
  }

  return (
    <div
      className={`graph ${compact ? 'is-compact' : ''}`}
      ref={wrapRef}
      data-cursor="drag"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {w > 0 && (
        <svg width={w} height={h} className="graph__svg" role="group" aria-label="Career timeline drawn as a git graph">
          <defs>
            <clipPath id="clip-past">
              <rect x={-40} y={0} width={Math.max(0, px + 40)} height={h} />
            </clipPath>
            <clipPath id="clip-future">
              <rect x={px} y={0} width={Math.max(0, w - px + 40)} height={h} />
            </clipPath>
            <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="7" className="graph__hatch" />
            </pattern>
          </defs>

          {/* year grid */}
          <g className="graph__grid">
            {YEARS.filter((yr) => yr <= T_NOW && (!compact || yr % 2 === 0)).map((yr) => (
              <g key={yr}>
                <line x1={x(yr)} x2={x(yr)} y1={PAD_T - 24} y2={h - 30} />
                <text x={x(yr) + 6} y={h - 12}>
                  {compact ? `’${String(yr).slice(2)}` : yr}
                </text>
              </g>
            ))}
          </g>

          {/* the future: hatched, uncommitted */}
          <rect className="graph__future" x={x(T_NOW)} y={PAD_T - 24} width={Math.max(0, w - x(T_NOW))} height={h - PAD_T - 6} />
          <line className="graph__now" x1={x(T_NOW)} x2={x(T_NOW)} y1={PAD_T - 24} y2={h - 30} />
          {!compact && (
            <text className="graph__future-label" x={(x(T_NOW) + w) / 2} y={h - 12} textAnchor="middle">
              uncommitted
            </text>
          )}

          {/* branches: dashed ghosts ahead of the playhead, glowing lines behind it */}
          <g clipPath="url(#clip-future)">
            {paths.map(({ b, d }) => (
              <path key={b.id} d={d} className="branch branch--ghost" />
            ))}
          </g>
          <g clipPath="url(#clip-past)">
            {paths.map(({ b, d }) => (
              <path key={b.id} d={d} className="branch branch--solid" style={{ color: b.cssColor }} />
            ))}
          </g>

          {/* branch names light up once they exist */}
          {BRANCHES.map((b) => {
            const live = time >= b.tFork - 1e-6
            const merged = b.tMerge != null && time >= b.tMerge - 1e-6
            return (
              <text
                key={b.id}
                className={`branch-label ${live ? 'is-live' : ''} ${merged ? 'is-merged' : ''}`}
                x={compact ? gl : gl - 18}
                y={compact ? laneY(b.lane) - 12 : laneY(b.lane) + 4}
                textAnchor={compact ? 'start' : 'end'}
                style={live ? { fill: b.cssColor } : undefined}
              >
                {b.name}
                {merged ? ' ✓' : ''}
              </text>
            )
          })}

          {/* commits */}
          {COMMITS.map((c) => {
            const past = c.t <= time + 1e-6
            const isHead = head?.id === c.id
            const selected = selectedId === c.id
            const showLabel = !compact || selected || isHead || hoverId === c.id
            return (
              <g
                key={c.id}
                className={`node ${past ? 'is-past' : 'is-future'} ${isHead ? 'is-head' : ''} ${selected ? 'is-selected' : ''}`}
                transform={`translate(${x(c.t)} ${laneY(BRANCH[c.branch].lane)})`}
                style={{ '--c': c.color }}
                role="button"
                tabIndex={0}
                aria-label={`${c.title}, ${fmtMonth(c.t)}`}
                data-cursor={past ? 'checkout' : 'travel'}
                onClick={() => onSelect(c.id)}
                onKeyDown={activate(() => onSelect(c.id))}
                onPointerEnter={() => setHoverId(c.id)}
                onPointerLeave={() => setHoverId((id) => (id === c.id ? null : id))}
              >
                <circle className="node__hit" r={18} />
                <circle className="node__halo" r={14} />
                <g className="node__body">
                  <NodeShape kind={c.kind} />
                </g>
                {showLabel && (
                  <text className="node__label" y={c.labelUp ? -19 : 29} textAnchor="middle">
                    {past ? c.label : '•'.repeat(Math.min(10, c.label.length))}
                  </text>
                )}
              </g>
            )
          })}

          {/* a ghost commit in the future → opens the contact PR */}
          <g
            className="ghost"
            transform={`translate(${x(T_GHOST)} ${yMain})`}
            role="button"
            tabIndex={0}
            aria-label={futureCommit.message}
            data-cursor="pitch it"
            onClick={onFuture}
            onKeyDown={activate(onFuture)}
          >
            <circle className="node__hit" r={20} />
            <circle className="ghost__ring" r={9} />
            <text className="ghost__plus" y={4} textAnchor="middle">
              +
            </text>
            {!compact && (
              <text className="ghost__label" y={31} textAnchor="middle">
                {futureCommit.label}
              </text>
            )}
          </g>

          {/* playhead */}
          <g className="playhead" transform={`translate(${px} 0)`} aria-hidden="true">
            <line className="playhead__glow" y1={PAD_T - 24} y2={h - 30} />
            <line className="playhead__line" y1={PAD_T - 24} y2={h - 30} />
          </g>
        </svg>
      )}

      {w > 0 && (
        <div className="playhead-pill" style={{ left: clamp(px, 70, w - 70), top: PAD_T - 50 }}>
          {`HEAD@{${fmtMonth(time)}}`}
        </div>
      )}

      {hover && w > 0 && (
        <div
          className="tip"
          style={{
            left: clamp(x(hover.t), 150, w - 150),
            top: laneY(BRANCH[hover.branch].lane) - (hover.labelUp ? 14 : 0),
            '--c': hover.color,
          }}
        >
          <div className="tip__head">
            <span className="tip__hash">{hover.hash}</span>
            <span>
              {BRANCH[hover.branch].name} · {fmtDate(hover.date)}
            </span>
          </div>
          <div className="tip__msg">{hover.message}</div>
          <div className="tip__foot">
            {hover.t <= time + 1e-6 ? '↵ click to checkout' : '⏩ still in the future — click to travel there'}
          </div>
        </div>
      )}

      <div className={`graph__hint ${showHint ? '' : 'is-gone'}`}>
        <span>scroll</span>
        <i>·</i>
        <span>drag</span>
        <i>·</i>
        <span>← →</span>
        <span className="graph__hint-txt">to time-travel</span>
      </div>
    </div>
  )
}
