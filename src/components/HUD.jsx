import { profile } from '../data/portfolio.js'
import { isMac } from '../lib/utils.js'
import './HUD.css'

export function GitMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M11 8v16M11 15c0 5 10 3 10 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="11" cy="8" r="3.2" fill="currentColor" />
      <circle cx="11" cy="24" r="3.2" fill="currentColor" />
      <circle cx="21" cy="24" r="3.2" fill="currentColor" />
    </svg>
  )
}

export default function HUD({ atHead, head, timeLabel, soundOn, onToggleSound, onPalette, onPR }) {
  return (
    <header className="hud">
      <div className="hud__left">
        <GitMark className="hud__mark" />
        <span className="hud__repo">
          <b>{profile.handle}</b>
          <span className="hud__repo-rest">/portfolio</span>
        </span>
        <span className="chip hud__branch">⎇ {atHead ? 'main' : head?.hash ?? 'main'}</span>
      </div>

      <div className={`hud__status ${atHead ? 'is-head' : ''}`}>
        <span className="hud__dot" />
        {atHead ? (
          <span>
            On branch main · up to date with <code>origin/main</code>
          </span>
        ) : (
          <span>
            HEAD detached at <code>{head?.hash ?? '0000000'}</code> · {timeLabel}
          </span>
        )}
      </div>

      <div className="hud__right">
        <button className="btn btn--sm hud__term" onClick={onPalette} data-cursor="terminal" aria-label="Open terminal">
          <span className="hud__term-icon">&gt;_</span>
          <span className="hud__keys">
            <span className="kbd">{isMac ? '⌘' : 'Ctrl'}</span>
            <span className="kbd">K</span>
          </span>
        </button>
        <button
          className={`btn btn--icon ${soundOn ? 'is-on' : ''}`}
          onClick={onToggleSound}
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Mute sound' : 'Turn sound on'}
          data-cursor={soundOn ? 'mute' : 'sound on'}
        >
          <span className="eq">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
        <button className="btn btn--accent btn--sm" onClick={onPR} data-cursor="say hi">
          Open a PR
        </button>
      </div>
    </header>
  )
}
