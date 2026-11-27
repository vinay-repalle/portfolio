import { profile } from '../data/portfolio.js'
import { ERAS, eraIndexAt, statsAt } from '../lib/story.js'
import { auroraNearAt } from '../lib/theme.js'
import { fmtMonth } from '../lib/utils.js'
import Avatar from './Avatar.jsx'
import './Hero.css'

const DIGITS = '0123456789'.split('')
const pad2 = (n) => String(n).padStart(2, '0')

/** Each digit is a vertical strip of 0-9 that rolls into place. */
function Odometer({ value }) {
  const digits = String(value).split('')
  return (
    <span className="odo" style={{ '--n': digits.length }}>
      {digits.map((d, i) => (
        <span className="odo__col" key={i} style={{ '--i': i }}>
          <span className="odo__strip" style={{ transform: `translateY(${-Number(d) * 10}%)` }}>
            {DIGITS.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

/** Letters hop when hovered. Words stay unbroken. */
function PlayfulName({ text }) {
  return (
    <h1 className="hero__name" aria-label={text}>
      {text.split(' ').map((word, w) => (
        <span className="hero__word" key={w} aria-hidden="true">
          {word.split('').map((ch, i) => (
            <span className="hero__ch" key={i}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  )
}

export default function Hero({ time, playing, onPlay, onPalette, onTour }) {
  const year = Math.floor(time + 1e-6)
  const frac = time - year
  const eraIdx = eraIndexAt(time)
  const era = ERAS[eraIdx]
  const { commitCount, active } = statsAt(time)
  const fill = `inset(${(1 - frac) * 100}% 0 0 0)`
  // mounted only in/just before an aurora era; opacity follows --aurora
  const auroraNear = auroraNearAt(time)

  return (
    <section className="hero">
      <div className="hero__intro">
        <div className="hero__status">
          <span className="hero__avatar">
            <Avatar size={40} />
            <span className="pulse-dot hero__online" />
          </span>
          {profile.status}
        </div>
        <PlayfulName text={profile.name} />
        <p className="hero__role">
          <b>{profile.role}.</b> {profile.tagline}
        </p>
        <div className="hero__actions">
          <button className="btn btn--accent" onClick={onPlay} data-cursor={playing ? 'pause' : 'play'}>
            {playing ? '❚❚ Pause' : '▶ Replay my story'}
          </button>
          <button className="btn hero__tour" onClick={onTour} data-cursor="tour">
            <span className="accent">✦</span> Take the tour
          </button>
          <button className="btn hero__term" onClick={onPalette} data-cursor="terminal">
            <span className="accent mono">&gt;_</span> Terminal
          </button>
        </div>
      </div>

      <div className="hero__era">
        <div className="hero__era-index">
          era {pad2(eraIdx + 1)} / {pad2(ERAS.length)}
        </div>
        <div className="year" aria-label={`Year ${year}`}>
          <span className="year__outline" aria-hidden="true">
            <Odometer value={year} />
          </span>
          {/* the solid copy fills up from the bottom as the months pass */}
          <span className="year__fill" aria-hidden="true" style={{ clipPath: fill }}>
            <Odometer value={year} />
          </span>
          {/* aurora eras: the same fill, painted with every past era's color */}
          {auroraNear && (
            <span className="year__fill year__aurora" aria-hidden="true" style={{ clipPath: fill }}>
              <Odometer value={year} />
            </span>
          )}
        </div>
        <div className="hero__era-title" key={`t${eraIdx}`}>
          {era.title}
        </div>
        <div className="hero__era-sub" key={`s${eraIdx}`}>
          {era.subtitle}
        </div>
        <div className="hero__stats">
          <b>{commitCount}</b> commits · <b>{active}</b> active branches · <b>{fmtMonth(time)}</b>
        </div>
      </div>
    </section>
  )
}
