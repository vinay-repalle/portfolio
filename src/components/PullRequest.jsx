import { memo, useEffect, useRef, useState } from 'react'
import { profile } from '../data/portfolio.js'
import './PullRequest.css'

// Contact form disguised as a GitHub pull request. Submitting runs a few
// fake CI checks, then opens the visitor's mail app with everything filled in.
const CHECKS = [
  'lint — your message reads beautifully',
  'no merge conflicts with my calendar',
  'vibe check — immaculate',
]
const STEP_MS = 650

function PullRequest({ open, onClose, onMerged }) {
  const [form, setForm] = useState({ title: '', email: '', body: '' })
  const [stage, setStage] = useState('form') // form → checks → merged
  const [passed, setPassed] = useState(0)
  const [copied, setCopied] = useState(false)
  const titleRef = useRef(null)
  const timers = useRef([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    if (!open) {
      clearTimers()
      return
    }
    setStage('form')
    setPassed(0)
    setCopied(false)
    const id = setTimeout(() => titleRef.current?.focus(), 80)
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(id)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => clearTimers, [])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const mailto = () => {
    const subject = form.title || 'Hello from your portfolio'
    const body = `${form.body}\n\n— ${form.email || 'a visitor'}`
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const submit = (e) => {
    e.preventDefault()
    setStage('checks')
    setPassed(0)
    CHECKS.forEach((_, i) => timers.current.push(setTimeout(() => setPassed(i + 1), STEP_MS * (i + 1))))
    timers.current.push(
      setTimeout(() => {
        setStage('merged')
        onMerged?.()
        window.location.href = mailto()
      }, STEP_MS * CHECKS.length + 450),
    )
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={`overlay ${open ? 'is-open' : ''}`} onPointerDown={(e) => e.target === e.currentTarget && onClose()} inert={!open}>
      <div className="sheet pr" role="dialog" aria-modal="true" aria-labelledby="pr-title">
        <div className="sheet__bar">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          <span>
            {profile.handle}/life · pull request #{new Date().getFullYear()}
          </span>
        </div>

        <div className="pr__body" data-scrollable>
          <h2 className="pr__title" id="pr-title">
            Open a pull request
          </h2>
          <div className="pr__branches">
            <span className="chip">base: {profile.firstName.toLowerCase()}/main</span>
            <span className="muted">←</span>
            <span className="chip">compare: you/new-idea</span>
            <span className="pr__mergeable">✓ Able to merge</span>
          </div>

          {stage === 'form' && (
            <form className="pr__form" onSubmit={submit}>
              <label>
                <span className="section-label">title</span>
                <input ref={titleRef} required value={form.title} onChange={update('title')} placeholder="feat: let's build something great" />
              </label>
              <label>
                <span className="section-label">your email</span>
                <input type="email" value={form.email} onChange={update('email')} placeholder="you@somewhere.dev" />
              </label>
              <label>
                <span className="section-label">description</span>
                <textarea
                  rows={5}
                  value={form.body}
                  onChange={update('body')}
                  placeholder={'## What’s on your mind?\nA project, a role, or just a hello.'}
                />
              </label>
              <div className="pr__actions">
                <div className="pr__socials">
                  {profile.socials.map((s) => (
                    <a key={s.label} href={s.url} target="_blank" rel="noreferrer" data-cursor="open">
                      {s.label}
                    </a>
                  ))}
                </div>
                <div className="pr__buttons">
                  <button type="button" className="btn btn--sm" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn--accent btn--sm" data-cursor="ship it">
                    Create pull request
                  </button>
                </div>
              </div>
            </form>
          )}

          {stage !== 'form' && (
            <div className="pr__checks">
              {CHECKS.map((c, i) => (
                <div key={c} className={`check ${i < passed ? 'is-done' : i === passed ? 'is-running' : ''}`}>
                  <span className="check__icon" />
                  {c}
                </div>
              ))}
              {stage === 'merged' && (
                <div className="pr__merged">
                  <div className="pr__merged-title">Merged! 🎉</div>
                  <p>
                    Your mail app should be opening with everything filled in. If it didn't, write to me directly at{' '}
                    <a href={`mailto:${profile.email}`}>{profile.email}</a>.
                  </p>
                  <div className="pr__buttons">
                    <button className="btn btn--sm" onClick={copyEmail}>
                      {copied ? 'Copied ✓' : 'Copy email'}
                    </button>
                    <button className="btn btn--accent btn--sm" onClick={onClose}>
                      Back to the timeline
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(PullRequest)
