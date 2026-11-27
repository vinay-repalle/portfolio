import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { tour } from './data/portfolio.js'
import { COMMIT, COMMITS, ERAS, T_NOW, T_START, U_NOW, eraIndexAt, lastCommitAt, tAt, uAt } from './lib/story.js'
import { applyPalette, auroraNearAt, paletteAt } from './lib/theme.js'
import { clamp, fmtMonth } from './lib/utils.js'
import { sound } from './lib/sound.js'
import { useLayout, useReducedMotion } from './lib/hooks.js'
import BootSequence from './components/BootSequence.jsx'
import WarpField from './components/WarpField.jsx'
import AuroraSky from './components/AuroraSky.jsx'
import Cursor from './components/Cursor.jsx'
import HUD from './components/HUD.jsx'
import Hero from './components/Hero.jsx'
import GitGraph from './components/GitGraph.jsx'
import TimeScrubber from './components/TimeScrubber.jsx'
import CommitPanel from './components/CommitPanel.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import PullRequest from './components/PullRequest.jsx'
import Tour, { TourPrompt } from './components/Tour.jsx'

// motion is measured along the (dilated) screen axis u, not in calendar time,
// so busy months don't flash past and quiet years don't drag
const WHEEL_U_PER_PX = 0.0003
const PLAY_SECONDS = 12 // a full replay, start to today
const INTRO_SECONDS = 3.8
const TOUR = tour.steps

// localStorage can throw (private mode, blocked storage) — never let it break the page
const store = {
  get: (k) => {
    try {
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v)
    } catch {
      /* ignore */
    }
  },
}

export default function App() {
  const layout = useLayout()
  const reduced = useReducedMotion()

  const [booted, setBooted] = useState(() => sessionStorage.getItem('booted') === '1')
  const [introDone, setIntroDone] = useState(false)
  const [touched, setTouched] = useState(false) // visitor has time-travelled by hand

  // ── the one piece of state everything hangs off: time (a decimal year) ──
  const [time, setTimeState] = useState(T_START)
  const timeRef = useRef(T_START)
  const velocityRef = useRef(0) // read + reset by the warp field each frame
  const tween = useRef(null)
  const tweenKind = useRef(null)
  const wheelTarget = useRef(0) // in u
  const proxy = useRef({ u: 0 })

  const [playing, setPlaying] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [prOpen, setPrOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [shaking, setShaking] = useState(false)
  const warpApi = useRef(null)

  // guided tour
  const [tourIndex, setTourIndex] = useState(null)
  const [tourSeen, setTourSeen] = useState(() => store.get('tour:seen') === '1')
  const [demo, setDemo] = useState(null) // a command the terminal types by itself

  // re-theme the whole page for the current moment, before paint
  useLayoutEffect(() => {
    applyPalette(paletteAt(time))
  }, [time])

  const setTime = useCallback((next) => {
    const t = clamp(next, T_START, T_NOW)
    const prev = timeRef.current
    if (Math.abs(t - prev) < 1e-7) return
    velocityRef.current += uAt(t) - uAt(prev) // on-screen speed drives the warp streaks

    const yPrev = Math.floor(prev + 1e-6)
    const yNext = Math.floor(t + 1e-6)
    if (yPrev !== yNext) sound.tick(yNext - Math.floor(T_START))
    else {
      const lo = Math.min(prev, t)
      const hi = Math.max(prev, t)
      if (COMMITS.some((c) => c.t > lo && c.t <= hi)) sound.blip()
    }

    timeRef.current = t
    setTimeState(t)
  }, [])

  const stop = useCallback(() => {
    tween.current?.kill()
    tween.current = null
    tweenKind.current = null
    setPlaying(false)
  }, [])

  const travelTo = useCallback(
    (target, { duration, ease = 'power3.inOut', kind = 'travel', onComplete } = {}) => {
      tween.current?.kill()
      const t = clamp(target, T_START, T_NOW)
      if (reduced) {
        tween.current = null
        setTime(t)
        onComplete?.()
        return
      }
      const u1 = uAt(t)
      proxy.current.u = uAt(timeRef.current)
      const dist = Math.abs(u1 - proxy.current.u)
      tweenKind.current = kind
      tween.current = gsap.to(proxy.current, {
        u: u1,
        duration: duration ?? clamp(0.4 + dist * 1.8, 0.4, 1.5),
        ease,
        onUpdate: () => setTime(tAt(proxy.current.u)),
        onComplete: () => {
          setTime(t) // land exactly on the target
          tween.current = null
          tweenKind.current = null
          onComplete?.()
        },
      })
    },
    [reduced, setTime],
  )

  const play = useCallback(() => {
    setSelectedId(null)
    setPlaying(true)
    setTouched(true)
    const forward = () =>
      travelTo(T_NOW, {
        duration: Math.max(0.6, (U_NOW - uAt(timeRef.current)) * PLAY_SECONDS),
        ease: 'none',
        kind: 'play',
        onComplete: () => {
          setPlaying(false)
          sound.chord()
        },
      })
    // already at today? rewind first (with reversed warp streaks), then play
    if (timeRef.current >= T_NOW - 0.02) {
      travelTo(T_START, { duration: 1.2, ease: 'power2.inOut', kind: 'play', onComplete: forward })
    } else forward()
  }, [travelTo])

  const togglePlay = useCallback(() => (playing ? stop() : play()), [playing, play, stop])

  const scrubStart = useCallback(() => {
    stop()
    setTouched(true)
  }, [stop])

  const checkout = useCallback(
    (id) => {
      const c = COMMIT[id]
      if (!c) return
      stop()
      setSelectedId(id)
      setTouched(true)
      sound.open()
      travelTo(c.t, { duration: 0.9 })
    },
    [stop, travelTo],
  )

  const closePanel = useCallback(() => {
    setSelectedId(null)
    sound.close()
  }, [])

  const stepPanel = useCallback(
    (dir) => {
      const cur = selectedId ? COMMIT[selectedId] : null
      const next = cur && COMMITS[cur.index + dir]
      if (next) checkout(next.id)
    },
    [selectedId, checkout],
  )

  // ← → without a panel: hop to the previous / next commit
  const hop = useCallback(
    (dir) => {
      const t = timeRef.current
      const target =
        dir > 0 ? COMMITS.find((c) => c.t > t + 1e-3) : [...COMMITS].reverse().find((c) => c.t < t - 1e-3)
      stop()
      setTouched(true)
      travelTo(target ? target.t : dir > 0 ? T_NOW : T_START, { duration: 0.6 })
    },
    [stop, travelTo],
  )

  const toggleSound = useCallback(() => {
    const next = !sound.isOn()
    sound.setOn(next)
    setSoundOn(next)
    return next
  }, [])

  const openPR = useCallback(() => {
    setSelectedId(null)
    setPrOpen(true)
  }, [])
  const closePR = useCallback(() => setPrOpen(false), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const openPalette = useCallback(() => setPaletteOpen(true), [])

  const celebrate = useCallback(() => {
    warpApi.current?.burst(window.innerWidth / 2, window.innerHeight * 0.45)
    sound.chord()
  }, [])

  // ── boot + intro: the graph "grows" from 2018 to today ──
  const onBootDone = useCallback(() => {
    sessionStorage.setItem('booted', '1')
    setBooted(true)
  }, [])

  useEffect(() => {
    if (!booted) return
    setIntroDone(false)
    const id = setTimeout(
      () => travelTo(T_NOW, { duration: INTRO_SECONDS, ease: 'power2.inOut', onComplete: () => setIntroDone(true) }),
      300,
    )
    return () => clearTimeout(id)
  }, [booted, travelTo])

  // ── scroll wheel = time travel ──
  useEffect(() => {
    const onWheel = (e) => {
      if (!booted || selectedId || paletteOpen || prOpen || tourIndex != null) return
      if (e.target.closest?.('[data-scrollable]')) return
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      const px = e.deltaMode === 1 ? d * 18 : e.deltaMode === 2 ? d * 400 : d
      const base = tweenKind.current === 'wheel' ? wheelTarget.current : uAt(timeRef.current)
      wheelTarget.current = clamp(base + px * WHEEL_U_PER_PX, 0, U_NOW)
      setPlaying(false)
      setTouched(true)
      travelTo(tAt(wheelTarget.current), { duration: 0.55, ease: 'power3.out', kind: 'wheel' })
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    return () => window.removeEventListener('wheel', onWheel)
  }, [booted, selectedId, paletteOpen, prOpen, tourIndex, travelTo])

  // ── keyboard ──
  useEffect(() => {
    const onKey = (e) => {
      const k = e.key
      if (tourIndex != null) return // the tour handles its own keys
      if ((e.metaKey || e.ctrlKey) && k.toLowerCase() === 'k') {
        e.preventDefault()
        if (!prOpen) setPaletteOpen((o) => !o)
        return
      }
      if (!booted || paletteOpen || prOpen) return
      if (e.target.closest?.('input, textarea, [contenteditable="true"]')) return
      const onControl = e.target.closest?.('button, a, [role="button"]')

      if (k === '/') {
        e.preventDefault()
        setPaletteOpen(true)
      } else if (k === 'Escape' && selectedId) {
        closePanel()
      } else if (k === 'ArrowRight' || k === 'ArrowLeft') {
        e.preventDefault()
        const dir = k === 'ArrowRight' ? 1 : -1
        selectedId ? stepPanel(dir) : hop(dir)
      } else if (k === ' ' && !onControl) {
        e.preventDefault()
        togglePlay()
      } else if (k === 'Enter' && !onControl && !selectedId) {
        const c = lastCommitAt(timeRef.current)
        if (c) checkout(c.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [booted, paletteOpen, prOpen, tourIndex, selectedId, closePanel, stepPanel, hop, togglePlay, checkout])

  // ── guided tour ──
  const markTourSeen = useCallback(() => {
    store.set('tour:seen', '1')
    setTourSeen(true)
  }, [])

  const startTour = useCallback(() => {
    markTourSeen()
    stop()
    setPrOpen(false)
    setPaletteOpen(false)
    setSelectedId(null)
    setTouched(true)
    setTourIndex(0)
  }, [markTourSeen, stop])

  const leaveTour = useCallback(() => {
    setTourIndex(null)
    setDemo(null)
    setSelectedId(null)
    setPaletteOpen(false)
  }, [])

  const endTour = useCallback(() => {
    leaveTour()
    travelTo(T_NOW, { duration: 1.2 })
  }, [leaveTour, travelTo])

  const replayAfterTour = useCallback(() => {
    leaveTour()
    play()
  }, [leaveTour, play])

  const tourNext = useCallback(() => {
    if (tourIndex == null) return
    if (tourIndex + 1 < TOUR.length) setTourIndex(tourIndex + 1)
    else endTour()
  }, [tourIndex, endTour])

  const tourBack = useCallback(() => {
    if (tourIndex) setTourIndex(tourIndex - 1)
  }, [tourIndex])

  // each step sets the stage itself, so Next and Back both land in the right state
  useEffect(() => {
    if (tourIndex == null) return
    const step = TOUR[tourIndex]
    // no stop() here: a step that doesn't travel lets the previous step's
    // journey finish, and travelTo() replaces any journey still running
    setPlaying(false)
    setPrOpen(false)
    if (step.id !== 'terminal') {
      setPaletteOpen(false)
      setDemo(null)
    }
    if (step.id !== 'commit') setSelectedId(null)

    if (step.id === 'welcome' || step.id === 'contact' || step.id === 'finish') {
      travelTo(T_NOW, { duration: 1.2 })
    } else if (step.id === 'travel') {
      const target = step.year ? step.year + 0.1 : T_START + (T_NOW - T_START) * 0.35
      travelTo(target, { duration: 2.4, ease: 'power2.inOut' })
    } else if (step.id === 'commit') {
      const c = COMMIT[step.commit] ?? COMMITS[Math.floor(COMMITS.length * 0.7)]
      setSelectedId(c.id)
      sound.open()
      travelTo(c.t, { duration: 0.9 })
    } else if (step.id === 'terminal') {
      setPaletteOpen(true)
      setDemo({ cmd: step.command ?? 'whoami', id: Date.now() })
    }
  }, [tourIndex, travelTo])

  // ── terminal commands ──
  const actions = useMemo(
    () => ({
      checkout: (id) => {
        setPaletteOpen(false)
        checkout(id)
      },
      goto: (year) => {
        setPaletteOpen(false)
        setSelectedId(null)
        stop()
        setTouched(true)
        travelTo(year >= Math.floor(T_NOW) ? T_NOW : year + 0.5, { duration: 1.4 })
      },
      play: () => {
        setPaletteOpen(false)
        play()
      },
      now: () => {
        setPaletteOpen(false)
        setSelectedId(null)
        stop()
        travelTo(T_NOW, { duration: 1.4 })
      },
      contact: () => {
        setPaletteOpen(false)
        openPR()
      },
      tour: startTour,
      toggleSound,
      celebrate,
      shake: () => {
        setShaking(true)
        sound.error()
        setTimeout(() => setShaking(false), 650)
      },
      reboot: () => {
        setPaletteOpen(false)
        setSelectedId(null)
        stop()
        setTime(T_START)
        sessionStorage.removeItem('booted')
        setBooted(false)
      },
    }),
    [checkout, stop, travelTo, play, openPR, startTour, toggleSound, celebrate, setTime],
  )

  const atHead = time >= T_NOW - 0.005
  const head = lastCommitAt(time)
  const selected = selectedId ? COMMIT[selectedId] : null
  const touring = tourIndex != null
  const showTourPrompt =
    booted && !tourSeen && !touring && (introDone || touched) && !selectedId && !paletteOpen && !prOpen

  return (
    <div className={`app ${shaking ? 'is-shaking' : ''}`}>
      {auroraNearAt(time) && <AuroraSky />}
      <WarpField velocityRef={velocityRef} apiRef={warpApi} />

      <HUD
        atHead={atHead}
        head={head}
        timeLabel={fmtMonth(time)}
        soundOn={soundOn}
        onToggleSound={toggleSound}
        onPalette={openPalette}
        onPR={openPR}
      />
      <Hero time={time} playing={playing} onPlay={togglePlay} onPalette={openPalette} onTour={startTour} />
      <GitGraph
        time={time}
        layout={layout}
        selectedId={selectedId}
        showHint={introDone && !touched}
        onSelect={checkout}
        onFuture={openPR}
        onScrubStart={scrubStart}
        onScrub={setTime}
      />
      <TimeScrubber
        time={time}
        layout={layout}
        playing={playing}
        onTogglePlay={togglePlay}
        onScrubStart={scrubStart}
        onScrub={setTime}
      />

      <CommitPanel commit={selected} onClose={closePanel} onStep={stepPanel} />
      <CommandPalette open={paletteOpen} onClose={closePalette} actions={actions} demo={demo} />
      <PullRequest open={prOpen} onClose={closePR} onMerged={celebrate} />

      <TourPrompt show={showTourPrompt} onStart={startTour} onDismiss={markTourSeen} />
      <Tour
        step={touring ? TOUR[tourIndex] : null}
        index={tourIndex}
        eraTitle={ERAS[eraIndexAt(time)].title}
        onNext={tourNext}
        onBack={tourBack}
        onEnd={endTour}
        onReplay={replayAfterTour}
      />

      <Cursor />
      {!booted && <BootSequence onDone={onBootDone} />}
    </div>
  )
}
