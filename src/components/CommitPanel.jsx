import { memo, useEffect, useRef } from 'react'
import { profile } from '../data/portfolio.js'
import { BRANCH, COMMITS } from '../lib/story.js'
import { fmtMonth } from '../lib/utils.js'
import CommitArt from './CommitArt.jsx'
import './CommitPanel.css'

// "git checkout <hash>" — the detail view for one commit, styled like git show.
function CommitPanel({ commit, onClose, onStep }) {
  const lastRef = useRef(commit)
  const scrollRef = useRef(null)
  if (commit) lastRef.current = commit
  const c = lastRef.current // keep content while the panel slides out
  const open = !!commit

  useEffect(() => {
    if (commit) scrollRef.current?.focus({ preventScroll: true })
  }, [commit])

  const cmd = c ? `git checkout ${c.hash}` : ''

  return (
    <>
      <div className={`scrim ${open ? 'is-open' : ''}`} onClick={onClose} />
      <aside
        className={`panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={c?.title ?? 'Commit'}
        aria-hidden={!open}
        inert={!open}
        style={{ '--c': c?.color }}
      >
        {c && (
          <>
            <div className="panel__scroll" data-scrollable tabIndex={-1} ref={scrollRef} key={c.id}>
              <div className="panel__cmd">
                <span className="accent">❯</span>
                <span className="panel__typed" style={{ '--n': cmd.length }}>
                  {cmd}
                </span>
              </div>

              <div className="panel__art">
                <CommitArt seed={c.fullHash} color={c.color} />
                <span className="panel__art-tag">{BRANCH[c.branch].name}</span>
              </div>

              <div className="panel__meta">
                <div>
                  <span className="panel__hash">commit {c.fullHash}</span>
                </div>
                <div>
                  Author: {profile.name} &lt;{profile.handle}@users.noreply.github.com&gt;
                </div>
                <div>Date:&nbsp;&nbsp; {fmtMonth(c.t)}</div>
                <div className="panel__msg">{c.message}</div>
              </div>

              <h2 className="panel__title">{c.title}</h2>
              <p className="panel__summary">{c.summary}</p>

              {(c.added?.length > 0 || c.removed?.length > 0) && (
                <div className="diff">
                  <div className="diff__head">
                    <span>diff --git a/me b/me</span>
                    <span>
                      <span className="diff__plus">+{c.added?.length ?? 0}</span>{' '}
                      <span className="diff__minus">−{c.removed?.length ?? 0}</span>
                    </span>
                  </div>
                  {c.added?.map((line) => (
                    <div key={`a${line}`} className="diff__line diff__line--add">
                      <span>+</span>
                      {line}
                    </div>
                  ))}
                  {c.removed?.map((line) => (
                    <div key={`r${line}`} className="diff__line diff__line--del">
                      <span>−</span>
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {c.stack?.length > 0 && (
                <>
                  <div className="section-label">stack</div>
                  <div className="panel__chips">
                    {c.stack.map((s) => (
                      <span className="chip" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}

              {c.links?.length > 0 && (
                <>
                  <div className="section-label">links</div>
                  <div className="panel__chips">
                    {c.links.map((l) => (
                      <a key={l.label} className="btn btn--sm" href={l.url} target="_blank" rel="noreferrer" data-cursor="open">
                        {l.label} ↗
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>

            <footer className="panel__nav">
              <button className="btn btn--sm" onClick={() => onStep(-1)} disabled={c.index === 0} data-cursor="older">
                ← older
              </button>
              <button className="btn btn--sm panel__close" onClick={onClose} data-cursor="close">
                <span className="mono">git checkout main</span>
                <span className="kbd">esc</span>
              </button>
              <button className="btn btn--sm" onClick={() => onStep(1)} disabled={c.index === COMMITS.length - 1} data-cursor="newer">
                newer →
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}

export default memo(CommitPanel)
