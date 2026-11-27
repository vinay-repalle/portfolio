import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../data/portfolio.js'
import { COMMITS, T_NOW, T_START } from '../lib/story.js'
import { fmtMonth } from '../lib/utils.js'
import { sound } from '../lib/sound.js'
import './CommandPalette.css'

const Y0 = Math.floor(T_START)
const Y1 = Math.floor(T_NOW)

const BASE = [
  { cmd: 'help', desc: 'list everything you can type' },
  { cmd: 'whoami', desc: 'the short version of me' },
  { cmd: 'git log', desc: 'every commit, newest first' },
  { cmd: 'ls skills', desc: 'the tools I reach for' },
  { cmd: 'play', desc: 'replay the whole story' },
  { cmd: 'now', desc: 'jump back to today' },
  { cmd: `goto ${Y0 + 3}`, desc: 'time-travel to any year' },
  { cmd: 'contact', desc: 'open a pull request to me' },
  { cmd: 'sound', desc: 'toggle sound effects' },
  { cmd: 'clear', desc: 'clear this terminal' },
]
const CHECKOUTS = COMMITS.map((c) => ({ cmd: `git checkout ${c.id}`, desc: c.title }))
const ALL = [...BASE, ...CHECKOUTS]

const WELCOME = [
  { t: 'muted', text: `${profile.handle}@portfolio — interactive shell` },
  { t: 'muted', text: "type 'help' to begin · ↑↓ pick · tab complete · esc close" },
]

function CommandPalette({ open, onClose, actions }) {
  const [input, setInput] = useState('')
  const [lines, setLines] = useState(WELCOME)
  const [sel, setSel] = useState(0)
  const [navigated, setNavigated] = useState(false)
  const [cups, setCups] = useState(0)
  const inputRef = useRef(null)
  const outRef = useRef(null)

  const q = input.trim().toLowerCase()
  const suggestions = useMemo(() => {
    if (!q) return BASE
    return ALL.filter((s) => s.cmd.includes(q) || s.desc.toLowerCase().includes(q)).slice(0, 7)
  }, [q])

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(id)
    }
    setInput('')
  }, [open])

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight })
  }, [lines])

  const onChange = (e) => {
    setInput(e.target.value)
    setSel(0)
    setNavigated(false)
    if (sound.isOn()) sound.key()
  }

  function exec(raw) {
    const s = raw.trim().replace(/\s+/g, ' ')
    if (!s) return
    const lc = s.toLowerCase()
    const out = [{ t: 'cmd', text: s }]
    const say = (t, text) => out.push({ t, text })
    let m

    if (lc === 'clear' || lc === 'cls') {
      setLines([])
      setInput('')
      return
    }
    if (['exit', 'quit', 'q', ':q', ':wq'].includes(lc)) {
      setInput('')
      onClose()
      return
    }

    if (lc === 'help') {
      BASE.forEach((b) => out.push({ t: 'row', a: b.cmd, b: b.desc }))
      say('muted', '…and a few hidden ones, if you are curious.')
    } else if (lc === 'whoami') {
      say('accent', profile.name)
      say('text', `${profile.role} · ${profile.location}`)
      say('text', profile.tagline)
      say('muted', `status: ${profile.status}`)
    } else if (['git log', 'log', 'git log --oneline'].includes(lc)) {
      ;[...COMMITS].reverse().forEach((c) => out.push({ t: 'commit', c }))
      say('muted', 'click any commit to check it out')
    } else if (['ls skills', 'skills', 'ls'].includes(lc)) {
      profile.skills.forEach((g) => out.push({ t: 'row', a: `${g.group}/`, b: g.items.join(' · ') }))
    } else if (lc === 'play' || lc === 'replay') {
      actions.play()
    } else if (['now', 'git checkout main', 'git switch main', 'cd ~', 'cd'].includes(lc)) {
      actions.now()
    } else if ((m = lc.match(/^(?:goto|cd|travel|time-travel)\s+(\d{4})$/))) {
      const y = Number(m[1])
      if (y < Y0 || y > Y1) say('err', `fatal: ${y} is outside this timeline (${Y0}–${Y1})`)
      else actions.goto(y)
    } else if ((m = lc.match(/^git (?:checkout|switch|show) (.+)$/))) {
      const key = m[1].trim()
      const c = COMMITS.find((x) => x.id === key || x.hash === key || x.label.toLowerCase() === key)
      if (c) actions.checkout(c.id)
      else say('err', `error: pathspec '${key}' did not match any commit known to git`)
    } else if (lc === 'hire vinay' || lc === 'hire me') {
      say('err', 'Permission denied. (hint: you may need elevated privileges)')
    } else if (/^sudo hire (vinay|me)$/.test(lc)) {
      say('muted', '[sudo] password for recruiter: ••••••••')
      say('ok', 'Permission granted. Excellent decision. 🎉')
      actions.celebrate()
    } else if (['contact', 'git push', 'hire', 'email', 'mail'].includes(lc)) {
      actions.contact()
    } else if (lc === 'sound' || lc === 'mute') {
      say('ok', `sound ${actions.toggleSound() ? 'on ♪' : 'off'}`)
    } else if (lc === 'git blame') {
      say('text', '100.0% of bugs authored by: past me')
      say('muted', 'present me is innocent (for now)')
    } else if (lc.startsWith('rm -rf')) {
      say('err', 'nice try. this timeline is protected.')
      actions.shake()
    } else if (lc === 'git push --force' || lc === 'git push -f') {
      say('err', "! [rejected] main -> main (you can't rewrite my history)")
      actions.shake()
    } else if (lc === 'git status') {
      say('text', 'On branch main')
      say('text', "Your branch is up to date with 'origin/main'.")
      say('muted', 'Changes not staged for commit:')
      say('err', '        modified:   future.md')
    } else if (lc === 'coffee' || lc === 'brew coffee') {
      const n = cups + 1
      setCups(n)
      say('text', `☕ brewing… cups today: ${n}${n > 3 ? ' (please stop)' : ''}`)
    } else if (['hi', 'hello', 'hey', 'yo'].includes(lc)) {
      say('text', "hey 👋 — try 'whoami' or 'git log'")
    } else if (lc === 'pwd') {
      say('text', `/home/${profile.handle}/life`)
    } else if (lc === 'date') {
      say('text', new Date().toString())
    } else if (lc === 'reboot' || lc === 'sudo reboot') {
      actions.reboot()
    } else {
      const guess = ALL.find((x) => x.cmd.startsWith(lc.split(' ')[0]))
      say('err', `command not found: ${s}`)
      say('muted', guess ? `did you mean '${guess.cmd}'?` : "type 'help' for the list")
      sound.error()
    }

    setLines((prev) => [...prev, ...out])
    setInput('')
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setNavigated(true)
      setSel((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setNavigated(true)
      setSel((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestions[sel]) setInput(suggestions[sel].cmd)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      // like a real shell: Enter runs what you typed, unless you picked a suggestion
      exec(!q || navigated ? (suggestions[sel]?.cmd ?? input) : input)
    }
  }

  return (
    <div className={`overlay ${open ? 'is-open' : ''}`} onPointerDown={(e) => e.target === e.currentTarget && onClose()} inert={!open}>
      <div className="sheet term" role="dialog" aria-modal="true" aria-label="Terminal">
        <div className="sheet__bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          <span>~/{profile.handle} — zsh</span>
        </div>

        <div className="term__out" ref={outRef} data-scrollable>
          {lines.map((l, i) => {
            if (l.t === 'row')
              return (
                <div key={i} className="line line--row">
                  <span className="accent">{l.a}</span>
                  <span className="muted">{l.b}</span>
                </div>
              )
            if (l.t === 'commit')
              return (
                <button key={i} className="line line--commit" onClick={() => actions.checkout(l.c.id)} data-cursor="checkout">
                  <span style={{ color: l.c.color }}>{l.c.hash}</span>
                  <span className="muted">{fmtMonth(l.c.t)}</span>
                  <span>{l.c.title}</span>
                </button>
              )
            return (
              <div key={i} className={`line line--${l.t}`}>
                {l.text}
              </div>
            )
          })}
        </div>

        <label className="term__input">
          <span className="accent">❯</span>
          <input
            ref={inputRef}
            value={input}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="type a command…"
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="Command"
          />
        </label>

        {suggestions.length > 0 && (
          <div className="term__suggest" data-scrollable>
            {suggestions.map((s, i) => (
              <button
                key={s.cmd}
                className={`sugg ${i === sel ? 'is-active' : ''}`}
                onPointerEnter={() => setSel(i)}
                onClick={() => exec(s.cmd)}
              >
                <span>{s.cmd}</span>
                <span>{s.desc}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(CommandPalette)
