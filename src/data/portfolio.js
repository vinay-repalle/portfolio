/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ALL PORTFOLIO CONTENT LIVES IN THIS FILE.
 *
 *  Everything below is DUMMY DATA for the demo. Replace it with the real
 *  story later — the UI is driven entirely from these exports.
 *
 *  Dates are 'YYYY-MM'.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Vinay Repalle',
  firstName: 'Vinay',
  handle: 'vinay-repalle',
  role: 'Software Engineer',
  tagline: 'I build fast, playful, human things for the web — and occasionally break time.',
  location: 'Earth · UTC+5:30',
  status: 'Open to interesting problems',
  email: 'hello@example.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/vinay-repalle' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { label: 'Resume', url: '#' },
  ],
  skills: [
    { group: 'languages', items: ['JavaScript', 'Python', 'Go', 'SQL'] },
    { group: 'frontend', items: ['React', 'GSAP', 'Canvas / SVG', 'CSS'] },
    { group: 'backend', items: ['Node.js', 'PostgreSQL', 'Redis', 'WebSockets'] },
    { group: 'tools', items: ['Git', 'Docker', 'Linux', 'Figma'] },
  ],
}

/** The span of the timeline. `future` is how far the "uncommitted" zone runs. */
export const timeline = {
  start: '2018-01',
  now: '2026-11',
  future: '2027-08',
}

/**
 * Branches = lanes of the graph, drawn top → bottom in this order.
 * Every branch except `main` forks from main at `forkAt`
 * (put forkAt at or before the branch's first commit).
 * `mergeAt` merges it back into main; leave it out if the branch is still open.
 * color: a hex value, or 'ink' to follow the current era's text color.
 */
export const branches = [
  { id: 'edu', name: 'education', color: '#8ab4ff', forkAt: '2019-07', mergeAt: '2023-05' },
  { id: 'main', name: 'main', color: 'ink' },
  { id: 'work', name: 'work', color: '#ffc46b', forkAt: '2022-05' },
  { id: 'side', name: 'side-projects', color: '#ff7eb6', forkAt: '2020-03' },
]

/**
 * Commits = the moments. kind controls the node shape:
 *   project ● · job ◆ · milestone ✦ · edu ○ · merge ◎ · life •
 * label   → short text drawn on the graph
 * message → the "commit message" shown on hover
 * added / removed → rendered as a diff in the detail panel
 */
export const commits = [
  {
    id: 'hello-world',
    hash: 'e3b0c44',
    branch: 'main',
    date: '2018-03',
    kind: 'milestone',
    label: 'Hello, World',
    title: 'Initial commit',
    message: 'printf("Hello, World\\n");',
    summary:
      'Wrote my first program on a borrowed laptop and stared at the terminal for a solid minute. Something clicked that has not un-clicked since.',
    added: ['Curiosity, unbounded', 'A text editor with far too many themes'],
    removed: ['The belief that computers are magic'],
    stack: ['C', 'Notepad++'],
  },
  {
    id: 'enroll',
    hash: '9fa2c1d',
    branch: 'edu',
    date: '2019-08',
    kind: 'edu',
    label: 'B.Tech CSE',
    title: 'chore: enroll in B.Tech, Computer Science',
    message: 'chore: enroll in B.Tech, Computer Science',
    summary:
      'Four years of algorithms, operating systems and late-night labs. (Dummy text — swap in the real university, years and highlights.)',
    added: ['Data structures & algorithms', 'Operating systems', 'Computer networks'],
    removed: ['A sensible sleep schedule'],
    stack: ['C++', 'Java', 'Linux'],
  },
  {
    id: 'orbit',
    hash: '4c1e7b0',
    branch: 'side',
    date: '2020-06',
    kind: 'project',
    label: 'Orbit',
    title: 'Orbit — a CLI task manager',
    message: 'feat(orbit): tasks that orbit by priority',
    summary:
      'A terminal task manager where tasks drift closer to the center as their deadlines approach. The first project anyone else actually used (hi, roommates).',
    added: ['Published my first package', 'Wrote tests before they were cool'],
    removed: ['Sticky notes — all of them'],
    stack: ['Python', 'Click', 'SQLite'],
    links: [{ label: 'source', url: '#' }],
  },
  {
    id: 'dsa',
    hash: 'b81d5e2',
    branch: 'edu',
    date: '2020-11',
    kind: 'edu',
    label: 'DSA clicked',
    title: 'feat: data structures finally clicked',
    message: 'feat: data structures finally clicked',
    summary:
      'The semester recursion stopped being scary. Solved 300+ problems and started explaining trees to anyone who would listen.',
    added: ['300+ problems solved', 'A deep fondness for graphs'],
    removed: ['Fear of recursion'],
    stack: ['C++', 'LeetCode'],
  },
  {
    id: 'coffee',
    hash: 'c0ffee1',
    branch: 'main',
    date: '2021-02',
    kind: 'life',
    label: 'fix: coffee',
    title: 'fix: discovered coffee',
    message: 'fix: discovered coffee (closes #42)',
    summary:
      'Critical dependency added. Throughput up, sleep down. Considered a breaking change by some.',
    added: ['coffee@latest'],
    removed: ['8 hours of sleep'],
    stack: ['Espresso', 'Pour-over'],
  },
  {
    id: 'inkwell',
    hash: '7d3f9a4',
    branch: 'side',
    date: '2021-09',
    kind: 'project',
    label: 'Inkwell',
    title: 'Inkwell — a markdown notes editor',
    message: 'feat(inkwell): live-preview markdown with zero lag',
    summary:
      'A distraction-free markdown editor with live preview, offline storage and keyboard-first navigation. My first real React app.',
    added: ['Learned React the hard way', 'Offline-first storage'],
    removed: ['Paper notebooks'],
    stack: ['React', 'IndexedDB', 'CSS'],
    links: [
      { label: 'live demo', url: '#' },
      { label: 'source', url: '#' },
    ],
  },
  {
    id: 'hackathon',
    hash: '1a9e0f3',
    branch: 'edu',
    date: '2021-12',
    kind: 'milestone',
    label: 'Hackathon win',
    title: 'feat: won the campus hackathon',
    message: 'feat: 36 hours, 4 people, 1 trophy',
    summary:
      'Built a real-time campus bus tracker in 36 hours. Took first place and a lifetime supply of instant noodles.',
    added: ['1st place', 'Shipping under pressure'],
    removed: ['The instant-noodle stockpile'],
    stack: ['Node.js', 'Socket.io', 'Maps API'],
  },
  {
    id: 'intern',
    hash: '3e6b2c8',
    branch: 'work',
    date: '2022-06',
    kind: 'job',
    label: 'Intern @ Lumen',
    title: 'Software Engineering Intern — Lumen Labs',
    message: 'feat(work): first commit to a real production repo',
    summary:
      'Summer internship at a fictional company (dummy data). Shipped an internal analytics page and learned what code review really means.',
    added: ['Code-review etiquette', 'CI/CD pipelines'],
    removed: ['"It works on my machine"'],
    stack: ['JavaScript', 'React', 'Jest'],
  },
  {
    id: 'pixel-garden',
    hash: 'a5c4e19',
    branch: 'side',
    date: '2022-09',
    kind: 'project',
    label: 'Pixel Garden',
    title: 'Pixel Garden — generative art that grows',
    message: 'feat(garden): plants grow from your commit history',
    summary:
      "Turns anyone's GitHub history into a growing pixel garden. Every repo is a plant; every commit, a leaf.",
    added: ['Generative art', 'Canvas performance tricks'],
    removed: ['Boring contribution graphs'],
    stack: ['Canvas', 'JavaScript', 'GitHub API'],
    links: [{ label: 'live demo', url: '#' }],
  },
  {
    id: 'graduate',
    hash: 'd4e8f0a',
    branch: 'main',
    date: '2023-05',
    kind: 'merge',
    label: 'Graduated',
    title: "Merge branch 'education' into main",
    message: "Merge branch 'education' — graduated",
    summary:
      'Wrapped up the degree. Every lab, late night and hackathon merged cleanly into main — no conflicts (mostly).',
    added: ['B.Tech, Computer Science', 'A network of brilliant friends'],
    removed: ['Exam anxiety'],
    stack: [],
  },
  {
    id: 'acme',
    hash: '6f2a8d1',
    branch: 'work',
    date: '2023-07',
    kind: 'job',
    label: 'SWE @ Acme',
    title: 'Software Engineer — Acme Systems',
    message: 'feat(work): joined Acme Systems full-time',
    summary:
      'First full-time role at a fictional company (dummy data). Worked across the stack on a B2B platform used by thousands of teams.',
    added: ['Owned features end to end', 'On-call (survived)'],
    removed: ['The intern badge'],
    stack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'pulse',
    hash: 'e9b13c7',
    branch: 'side',
    date: '2024-02',
    kind: 'project',
    label: 'Pulse',
    title: 'Pulse — realtime metrics, beautifully',
    message: 'feat(pulse): 60fps charts over websockets',
    summary:
      'A realtime dashboard that streams metrics over WebSockets and renders them at 60fps. Used by a handful of indie teams.',
    added: ['WebSockets at scale', '2k monthly users'],
    removed: ['Polling every 5 seconds'],
    stack: ['React', 'Go', 'Redis', 'WebSockets'],
    links: [
      { label: 'live demo', url: '#' },
      { label: 'source', url: '#' },
    ],
  },
  {
    id: 'latency',
    hash: '0b7c4e2',
    branch: 'work',
    date: '2024-07',
    kind: 'project',
    label: '−40% latency',
    title: 'perf: cut API p95 latency by 40%',
    message: 'perf(api): cache hot paths, batch the rest',
    summary:
      'Profiled the slowest endpoints, added a caching layer and request batching. p95 dropped by 40% and the on-call channel got noticeably quieter.',
    added: ['Redis caching layer', 'Request batching'],
    removed: ['400ms of waiting', 'Several pager alerts'],
    stack: ['Node.js', 'Redis', 'Grafana'],
  },
  {
    id: 'design-system',
    hash: '58d0a3f',
    branch: 'work',
    date: '2025-04',
    kind: 'project',
    label: 'Design system',
    title: 'feat: led the design-system rollout',
    message: 'feat(ui): one component library to rule them all',
    summary:
      'Led a four-person effort to unify three UI codebases into one component library — with docs, tokens and accessibility baked in.',
    added: ['40+ shared components', 'Accessibility audits'],
    removed: ['3 shades of almost-the-same blue'],
    stack: ['React', 'Storybook', 'CSS variables'],
  },
  {
    id: 'atlas',
    hash: 'f17a6b5',
    branch: 'side',
    date: '2025-08',
    kind: 'project',
    label: 'Atlas',
    title: 'Atlas — offline-first maps',
    message: 'feat(atlas): maps that work in airplane mode',
    summary:
      'A PWA for hikers that caches map tiles and routes for offline use, with GPS tracking that barely sips battery.',
    added: ['Service workers', 'Vector tiles'],
    removed: ['"No signal" panic'],
    stack: ['React', 'Service Workers', 'MapLibre'],
    links: [{ label: 'live demo', url: '#' }],
  },
  {
    id: 'senior',
    hash: '2c9e7d4',
    branch: 'work',
    date: '2026-04',
    kind: 'milestone',
    label: 'Senior',
    title: 'Promoted to Senior Engineer',
    message: 'release: v2.0.0 — senior engineer',
    summary:
      'Promoted to Senior. Now mentoring two engineers and spending more time on architecture docs than I ever expected to enjoy.',
    added: ['Mentoring', 'System design'],
    removed: ['Imposter syndrome (partially)'],
    stack: [],
  },
  {
    id: 'time-machine',
    hash: 'ab12f9e',
    branch: 'main',
    date: '2026-10',
    kind: 'milestone',
    label: 'This site',
    title: 'feat: rebuilt my portfolio as a time machine',
    message: 'feat: portfolio is now a time machine',
    summary:
      'You are looking at it. A portfolio you can scrub through like a video — built with React, GSAP and a slightly unhealthy love of git.',
    added: ['Time travel', 'A hidden terminal (try Ctrl/⌘ + K)'],
    removed: ['Boring scroll-down portfolios'],
    stack: ['React', 'Vite', 'GSAP', 'Canvas'],
  },
]

/**
 * Guided tour, shown to first-time visitors and restartable from the hero
 * button or the `tour` terminal command. Each step spotlights part of the
 * site and *does* something there. Keep the ids (they pick the spotlight and
 * the action); rewrite titles and text freely.
 *   `code`  → wrap words in backticks to render them as code
 *   {era}   → replaced with the era the visitor is currently in
 *   commit  → (commit step) which commit to open, by id
 *   command → (terminal step) what gets typed into the terminal
 *   year    → (travel step) which year to travel back to
 */
export const tour = {
  prompt: {
    hint: 'hint: you look new here',
    title: 'First time here?',
    text: 'This portfolio is a little time machine. Take a 40-second tour of how it works?',
  },
  steps: [
    {
      id: 'welcome',
      title: "Hi, I'm Vinay 👋",
      text: "This isn't a normal portfolio — my career is a git repository, and you're about to time-travel through it. Let me show you around.",
    },
    {
      id: 'graph',
      title: 'My life, as a git graph',
      text: 'Each line is a branch of my story — education, work and side-projects. Every dot is a commit: a project, a job or a milestone.',
    },
    {
      id: 'travel',
      year: 2021,
      title: 'This is a time machine',
      text: 'Scroll, drag the graph or this track, or use the arrow keys to travel. Watch — I’m taking you back a few years right now.',
    },
    {
      id: 'eras',
      title: 'Every era has its own look',
      text: 'Notice everything changed colour? You’re now in “{era}”. The whole site re-themes itself as you move through my timeline.',
    },
    {
      id: 'commit',
      commit: 'pulse',
      title: 'Check out any commit',
      text: 'Click any dot to open it: the story behind it, what changed (as a diff), the stack and links. Arrow keys flip between commits.',
    },
    {
      id: 'terminal',
      command: 'whoami',
      title: 'Prefer the keyboard?',
      text: 'Press `Ctrl/⌘ K` anytime to open my terminal. Try `git log`, `goto 2021` — and hunt for a few hidden commands.',
    },
    {
      id: 'contact',
      title: 'The future is uncommitted',
      text: 'Got an idea, a role or just a hello? Click this dashed commit — or “Open a PR” up top — and it lands straight in my inbox.',
    },
    {
      id: 'finish',
      title: "That's the tour!",
      text: 'Scroll to travel, click to explore, press `space` to replay the whole story. Have fun poking around.',
    },
  ],
}

/** The ghost commit sitting in the future — clicking it opens the contact PR. */
export const futureCommit = {
  label: 'your idea?',
  message: "This commit hasn't been written yet. Want to write it together?",
}

/**
 * Eras re-theme the whole site as you travel. Colors blend smoothly
 * into each era just before it starts.
 */
export const eras = [
  { at: '2018-01', title: 'Hello, World', subtitle: 'curiosity compiles', bg: '#04090a', ink: '#d9ffe9', accent: '#39ff88' },
  { at: '2019-07', title: 'The undergrad arc', subtitle: 'lectures by day, side quests by night', bg: '#060a1d', ink: '#e3e8ff', accent: '#6f8cff' },
  { at: '2020-09', title: 'Side-project season', subtitle: 'shipping things nobody asked for', bg: '#0f0a1c', ink: '#f0e6ff', accent: '#c084fc' },
  { at: '2022-05', title: 'First commit to prod', subtitle: 'real users, real pagers', bg: '#140d06', ink: '#fff1dc', accent: '#ffb547' },
  { at: '2024-01', title: 'Builder mode', subtitle: 'owning things end to end', bg: '#160810', ink: '#ffe4ee', accent: '#ff5c8a' },
  { at: '2025-04', title: 'Leveling up', subtitle: 'systems, scale & mentoring', bg: '#04161a', ink: '#dcfbff', accent: '#2de2e6' },
  { at: '2026-08', title: 'Right now', subtitle: 'HEAD → main, still compiling', bg: '#0a0b07', ink: '#f4f8e6', accent: '#d4ff3a' },
]
