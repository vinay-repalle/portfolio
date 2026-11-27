# git log --life

An interactive portfolio where a career is drawn as a **git graph you can time-travel through**.
Scroll, drag or press play and the whole site re-themes itself era by era.

**Live:** https://vinay-repalle.pages.dev · deployed on Cloudflare Pages (every push to `main` redeploys).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Editing content

Everything lives in **`src/data/portfolio.js`**; no component changes are needed:

| export          | what it controls                                                    |
| --------------- | ------------------------------------------------------------------- |
| `profile`       | name, role, tagline, email, socials, skills                         |
| `timeline`      | start date, "now", and how far the uncommitted future zone extends |
| `branches`      | graph lanes (education, work, side-projects…), fork & merge dates   |
| `commits`       | every moment on the graph: label, story, diff, stack, links         |
| `eras`          | color themes + titles the site morphs through as you travel         |
| `futureCommit`  | the ghost commit in the future (opens the contact form)             |
| `tour`          | the guided tour: the "First time here?" card plus each step's text  |

## Interactions

| input                   | does                                       |
| ----------------------- | ------------------------------------------ |
| "Take the tour" / `tour`| guided walkthrough that drives the site itself |
| scroll / drag the graph | travel through time                        |
| drag the bottom track   | scrub like a video                         |
| `space`                 | play / pause the whole story               |
| `←` `→`                 | hop to the previous / next commit          |
| `Enter`                 | open the commit HEAD points to             |
| click a commit          | `git checkout` it, opening the detail panel |
| `Ctrl/⌘ + K` or `/`     | open the terminal                          |
| `Esc`                   | close whatever is open                     |

Terminal commands: `help`, `tour`, `whoami`, `git log`, `ls skills`, `goto 2021`, `play`, `now`,
`git checkout <id>`, `contact`, `sound`, `clear`, plus a few hidden ones.

## Structure

```
src/
  data/portfolio.js        ← all content
  lib/
    story.js               ← derives commits/branches/eras from the data
    theme.js               ← time → era palette → CSS variables
    sound.js               ← tiny Web Audio synth (no audio files)
    utils.js, hooks.js
  components/
    BootSequence           ← fake `git clone` intro
    WarpField              ← canvas background that streaks while you scrub
    HUD, Hero              ← top bar, name, rolling year counter
    GitGraph               ← the SVG timeline
    TimeScrubber           ← video-style track
    CommitPanel, CommitArt ← commit detail + generative cover art
    CommandPalette         ← the terminal
    PullRequest            ← contact form disguised as a PR
    Tour                   ← guided tour (spotlight + card) and the first-visit prompt
    Cursor                 ← custom cursor
  App.jsx                  ← owns `time`, the single source of truth
```

Stack: React + Vite (JavaScript only), GSAP, SVG and Canvas. No UI libraries.
