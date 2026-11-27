/**
 * ─────────────────────────────────────────────────────────────────────────
 *  ALL PORTFOLIO CONTENT LIVES IN THIS FILE.
 *
 *  Real data, first draft (2026-11-27): built from the resume, the public
 *  GitHub READMEs and project notes. Lines marked  // CHECK  are guesses that
 *  need confirming.
 *
 *  Dates are 'YYYY-MM' or 'YYYY-MM-DD'.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const profile = {
  name: 'Vinay Repalle',
  firstName: 'Vinay',
  handle: 'vinay-repalle',
  role: 'Full-stack & AI Developer', // CHECK
  tagline:
    'I build full-stack web apps and AI tools — real-time games, placement platforms, RAG pipelines and code sandboxes.',
  location: 'Chennai, India',
  status: 'Trainee at Ampera · open to opportunities', // CHECK
  email: 'repallevinay13@gmail.com',
  socials: [
    { label: 'GitHub', url: 'https://github.com/vinay-repalle' },
    { label: 'GitHub (Ampera)', url: 'https://github.com/Vinay-Ampera' },
    // { label: 'LinkedIn', url: '' },   // add when ready
    // { label: 'Resume', url: '' },     // add the PDF link when ready
  ],
  skills: [
    { group: 'languages', items: ['Python', 'JavaScript', 'Java', 'C', 'SQL'] },
    { group: 'frontend', items: ['React', 'Next.js', 'Vite', 'Tailwind CSS', 'HTML / CSS'] },
    { group: 'backend', items: ['Node.js', 'Express', 'FastAPI', 'Socket.IO', 'REST · JWT · OAuth'] },
    { group: 'data', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'pgvector'] },
    { group: 'ai', items: ['LangGraph', 'RAG', 'Gemini API', 'Sentence Transformers'] },
    { group: 'tools', items: ['Git & GitHub', 'GitHub Actions', 'Docker', 'Linux', 'Judge0'] },
  ],
}

/** The span of the timeline. `future` is how far the "uncommitted" zone runs. */
export const timeline = {
  start: '2020-01',
  now: '2026-11-27',
  future: '2027-06',
}

/**
 * Branches = lanes of the graph, drawn top → bottom in this order.
 * Every branch except `main` forks from main at `forkAt`
 * (put forkAt at or before the branch's first commit).
 * `mergeAt` merges it back into main; leave it out if the branch is still open.
 * color: a hex value, or 'ink' to follow the current era's text color.
 */
export const branches = [
  { id: 'edu', name: 'education', color: '#8ab4ff', forkAt: '2020-07', mergeAt: '2026-05' }, // CHECK graduation month
  { id: 'main', name: 'main', color: 'ink' },
  { id: 'work', name: 'ampera', color: '#5eead4', forkAt: '2026-08' },
  { id: 'side', name: 'side-projects', color: '#ff7eb6', forkAt: '2025-03' },
]

/**
 * Commits = the moments. kind controls the node shape:
 *   project ● · job ◆ · milestone ✦ · edu ○ · merge ◎ · life •
 * label   → short text drawn on the graph (keep it short — about 12 characters)
 * message → the "commit message" shown on hover
 * added / removed → rendered as a diff in the detail panel
 */
const GH = 'https://github.com/vinay-repalle'
const GH_WORK = 'https://github.com/Vinay-Ampera'

export const commits = [
  // ── main ────────────────────────────────────────────────────────────────
  {
    id: 'class-10',
    hash: 'a10f0c2',
    branch: 'main',
    date: '2020-06', // CHECK month
    kind: 'milestone',
    label: 'Class 10',
    title: 'Initial commit — Class 10 with a perfect GPA',
    message: 'init: school done — GPA 10/10',
    summary:
      'Finished Class 10 at St. Ann’s (EM) High School, Avanigadda, with a perfect 10 GPA — and branched off towards engineering.',
    added: ['GPA 10 / 10'],
    removed: ['The school bag'],
    stack: [],
  },
  {
    id: 'graduated',
    hash: 'd4e8f0a',
    branch: 'main',
    date: '2026-05', // CHECK
    kind: 'merge',
    label: 'Graduated',
    title: "Merge branch 'education' into main",
    message: "Merge branch 'education' — B.Tech CSE complete",
    summary:
      'Six years at RGUKT Nuzvid — the Pre-University Course and a B.Tech in Computer Science — merged cleanly into main.',
    added: ['B.Tech, Computer Science — CGPA 8.46'],
    removed: ['Exam timetables'],
    stack: [],
  },
  {
    id: 'portfolio',
    hash: 'ab12f9e',
    branch: 'main',
    date: '2026-11-27',
    kind: 'milestone',
    label: 'This site',
    title: 'feat: my portfolio is now a time machine',
    message: 'feat: portfolio is now a time machine',
    summary:
      'You are looking at it: my story as a git graph you can scrub through like a video, with a guided tour and a hidden terminal.',
    added: ['Time travel', 'A hidden terminal (try Ctrl/⌘ + K)'],
    removed: ['Boring scroll-down portfolios'],
    stack: ['React', 'Vite', 'GSAP', 'SVG', 'Canvas'],
    links: [{ label: 'source', url: `${GH}/portfolio` }],
  },

  // ── education ───────────────────────────────────────────────────────────
  {
    id: 'puc',
    hash: '9fa2c1d',
    branch: 'edu',
    date: '2020-08', // CHECK
    kind: 'edu',
    label: 'PUC · RGUKT',
    title: 'Pre-University Course — RGUKT Nuzvid',
    message: 'chore: join RGUKT Nuzvid (PUC)',
    summary:
      'Two years of the Pre-University Course at Rajiv Gandhi University of Knowledge Technologies (RGUKT), Nuzvid — finished in 2022 with a CGPA of 9.29.',
    added: ['CGPA 9.29'],
    removed: [],
    stack: [],
  },
  {
    id: 'nss',
    hash: '5e55a11',
    branch: 'edu',
    date: '2021-06',
    kind: 'life',
    label: 'NSS',
    title: 'NSS volunteer (2020 – 2022)',
    message: 'feat: volunteer with the National Service Scheme',
    summary: 'Served as a National Service Scheme (NSS) volunteer from 2020 to 2022.',
    added: ['Community service', 'Teamwork outside the classroom'],
    removed: [],
    stack: [],
  },
  {
    id: 'btech',
    hash: 'b7ec5e0',
    branch: 'edu',
    date: '2022-08', // CHECK
    kind: 'edu',
    label: 'B.Tech CSE',
    title: 'B.Tech, Computer Science — RGUKT Nuzvid',
    message: 'feat: start B.Tech in Computer Science',
    summary:
      'Bachelor of Technology in Computer Science at RGUKT Nuzvid, with a CGPA of 8.46. Data structures, web development and a lot of building on the side.',
    added: ['CGPA 8.46', 'Data structures & algorithms', 'Full-stack web development'],
    removed: [],
    stack: ['C', 'Java', 'JavaScript', 'MySQL'],
  },
  {
    id: 'dsa',
    hash: 'b81d5e2',
    branch: 'edu',
    date: '2024-03', // CHECK
    kind: 'milestone',
    label: '170+ DSA',
    title: 'feat: 170+ DSA problems solved',
    message: 'feat: 120+ on LeetCode, 50+ on HackerRank',
    summary:
      'Built a solid foundation in data structures and algorithms: 120+ problems solved on LeetCode and 50+ on HackerRank.',
    added: ['120+ LeetCode', '50+ HackerRank'],
    removed: ['Fear of recursion'],
    stack: ['Java', 'C'],
  },
  {
    id: 'workshops',
    hash: '0f3c7a9',
    branch: 'edu',
    date: '2025-02', // CHECK
    kind: 'life',
    label: 'Workshops',
    title: 'Organised technical workshops at the college fest',
    message: 'feat: teach what I learned',
    summary: 'Organised and ran technical workshops for fellow students during the college fest.',
    added: ['Teaching', 'Event organising'],
    removed: [],
    stack: [],
  },

  // ── side projects ───────────────────────────────────────────────────────
  {
    id: 'alumni-site',
    hash: '4c1e7b0',
    branch: 'side',
    date: '2025-04-15',
    kind: 'life',
    label: 'Alumni site',
    title: 'Alumni Interactive Website (mini project)',
    message: 'feat: alumni ↔ student sessions',
    summary:
      'My college mini project: a web app where alumni and students connect through sessions, with role-based logins. It later grew into CDPC.',
    added: [],
    removed: [],
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    // the old Vercel deployment (alumni-interactive-website.vercel.app) is offline
    links: [{ label: 'source', url: `${GH}/mini_project_alumni_sessions` }],
  },
  {
    id: 'bingov',
    hash: 'e9b13c7',
    branch: 'side',
    date: '2025-08-22',
    kind: 'project',
    label: 'BingoV',
    title: 'BingoV — real-time multiplayer Bingo',
    message: 'feat(bingov): play bingo with friends in real time',
    summary:
      'A full-stack Bingo game: real-time multiplayer over Socket.IO, an AI opponent for solo play, coins, stats, leaderboards and an admin portal. Frontend on Vercel, backend on Render.',
    added: ['Real-time multiplayer', 'JWT, Google OAuth & email OTP', 'Admin portal and leaderboards'],
    removed: ['Paper bingo cards'],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'Socket.IO'],
    links: [
      { label: 'play it', url: 'https://bingov.vercel.app' },
      { label: 'source', url: `${GH}/Bingov` },
    ],
  },
  {
    id: 'cdpc',
    hash: 'cd0c17a',
    branch: 'side',
    date: '2025-12', // CHECK
    kind: 'milestone',
    label: 'CDPC',
    title: 'CDPC — Career Development & Placement Cell',
    message: 'feat(cdpc): one home for placements, alumni and sessions',
    summary:
      'A full-stack platform for the placement cell at RGUKT Nuzvid: secure logins for admins, faculty, alumni and students; placement drives; an automated NOC request and approval workflow; alumni mentorship sessions; notifications; and a statistics dashboard with exports. (Private repository — screenshots coming soon.)',
    added: [
      'OTP login, protected routes, admin approvals',
      'NOC request & approval workflow',
      'Analytics dashboard, email alerts, Excel import / export',
    ],
    removed: ['Manual placement paperwork'],
    stack: ['React', 'Vite', 'Tailwind CSS', 'Context API', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    id: 'advret',
    hash: 'adf7e01',
    branch: 'side',
    date: '2026-03-15',
    kind: 'life',
    label: 'ADVRET',
    title: 'ADVRET — adversarial robustness testing',
    message: 'feat: how easily can an image classifier be fooled?',
    summary:
      'A small project that tests how image-classification models hold up against adversarial attacks, with a web interface and benchmark reports.',
    added: [],
    removed: [],
    stack: [],
    links: [{ label: 'source', url: `${GH}/ADVERT_project` }],
  },
  {
    id: 'market-agents',
    hash: '3a9d6f2',
    branch: 'side',
    date: '2026-10-28',
    kind: 'project',
    label: 'Market bots',
    title: 'Market Intelligence Agents',
    message: 'feat: daily AI-news and stock briefs on Telegram',
    summary:
      'Two scheduled agents that run free on GitHub Actions: one collects, ranks and summarises AI news; the other posts a morning brief on the Indian market. Gemini only writes the summaries — every number comes from the data, never from the model.',
    added: ['Daily AI-news digest', 'Pre-market brief: NIFTY, SENSEX, sectors'],
    removed: ['Doom-scrolling for news'],
    stack: ['Python', 'Gemini', 'GitHub Actions', 'Telegram Bot API'],
    links: [{ label: 'source', url: `${GH}/market-intelligence-agents` }],
  },
  {
    id: 'synccraft',
    hash: '5c7c2af',
    branch: 'side',
    date: '2026-11-11',
    kind: 'project',
    label: 'SyncCraft',
    title: 'SyncCraft — a 3D teamwork simulator',
    message: 'feat: learn how software teams ship, in 3D',
    summary:
      'A free, browser-only 3D game that teaches how software teams work together — from the first Jira ticket through API contracts, Git branches, pull requests and tests to the live product. No backend, no login.',
    added: ['Five playable levels', 'Frontend and backend seats'],
    removed: [],
    stack: ['React', 'Vite', 'React Three Fiber', 'Tailwind CSS', 'Zustand', 'CodeMirror'],
    links: [
      { label: 'play it', url: 'https://synccrafts.pages.dev' },
      { label: 'source', url: `${GH}/SyncCraft` },
    ],
  },
  {
    id: 'tools',
    hash: '7001ab3',
    branch: 'side',
    date: '2026-11-20',
    kind: 'life',
    label: 'Tools',
    title: 'Small tools: job alerts & a GATE tracker',
    message: 'chore: automate the boring stuff',
    summary:
      'Two small utilities: a daily job-alert bot (GitHub Actions collects openings, hides scam-looking posts, updates an installable web app and emails the best matches) and a GATE 2027 syllabus progress tracker.',
    added: ['Daily job alerts by email', 'Syllabus progress tracker'],
    removed: [],
    stack: ['Python', 'GitHub Actions', 'JavaScript'],
    links: [
      { label: 'job alerts', url: `${GH}/job_search` },
      { label: 'GATE tracker', url: `${GH}/gate-v` },
    ],
  },
  {
    id: 'unlockwall',
    hash: '9a11e4f',
    branch: 'side',
    date: '2026-11-25',
    kind: 'project',
    label: 'UnlockWall',
    title: 'UnlockWall — an Android wallpaper app',
    message: 'feat: a different wallpaper for every way you unlock',
    summary:
      'An Android app that shows a different home-screen wallpaper depending on how you unlocked the phone — fast (fingerprint or face) or slow (PIN or pattern) — by timing the unlock. No internet, no accounts, no ads.',
    added: ['Per-unlock wallpapers', 'Activity log you can export'],
    removed: [],
    stack: ['Kotlin', 'Android'],
    links: [{ label: 'source', url: `${GH}/UnlockWall` }],
  },

  // ── work: Ampera ────────────────────────────────────────────────────────
  {
    id: 'ampera',
    hash: '3e6b2c8',
    branch: 'work',
    date: '2026-08-04', // CHECK exact day
    kind: 'job',
    label: 'Ampera',
    title: 'Trainee — Ampera, Chennai', // CHECK title
    message: 'feat(work): first day at Ampera',
    summary:
      'Joined Ampera in Chennai as a trainee. Learning by building: AI applications, agents and RAG systems, production-grade backends — and shipping them with a team.',
    added: ['Python & FastAPI', 'LangGraph, RAG & Gemini', 'Docker and code reviews'],
    removed: ['The student ID card'],
    stack: [],
  },
  {
    id: 'ai-tutor',
    hash: 'a1707e5',
    branch: 'work',
    date: '2026-10-03',
    kind: 'life',
    label: 'AI Tutor',
    title: 'AI Tutor — a teaching assistant',
    message: 'feat: React → FastAPI → LangGraph → Gemini',
    summary: 'An AI-powered teaching assistant that keeps each learner’s session context, even across page refreshes.',
    added: [],
    removed: [],
    stack: ['React', 'FastAPI', 'LangGraph', 'Gemini'],
    links: [{ label: 'source', url: `${GH_WORK}/ai-tutor` }],
  },
  {
    id: 'ragforge',
    hash: 'f0e9e12',
    branch: 'work',
    date: '2026-10-12', // CHECK
    kind: 'project',
    label: 'RAGForge',
    title: 'RAGForge — answers grounded in your own knowledge',
    message: 'feat(rag): ingest, retrieve, generate, evaluate, retry',
    summary:
      'A general-purpose RAG application. It ingests documents, web pages and API responses (masking personal data), chunks and embeds them into PostgreSQL with pgvector, then answers questions with Gemini — applying guardrails, evaluating each answer and retrying when needed. Includes an admin area and voice input / output in the chat.',
    added: ['Ingestion pipeline with PII masking', 'pgvector similarity search', 'Guardrails, evaluation & retry loop'],
    removed: ['Answers the model made up'],
    stack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'Sentence Transformers', 'Gemini', 'React'],
  },
  {
    id: 'sentinel',
    hash: '5e471e1',
    branch: 'work',
    date: '2026-10-22',
    kind: 'life',
    label: 'Sentinel AI',
    title: 'Sentinel AI — an application-quality platform',
    message: 'feat: evidence-driven testing and investigation',
    summary:
      'An evidence-driven quality platform: risk-gated test planning, sandboxed execution, security and accessibility checks, failure investigation and regression-test proposals.',
    added: [],
    removed: [],
    stack: ['Python', 'PostgreSQL', 'Redis', 'Docker'],
    links: [{ label: 'source', url: `${GH_WORK}/Sentinel-AI` }],
  },
  {
    id: 'saferun',
    hash: '5afe210',
    branch: 'work',
    date: '2026-10-28',
    kind: 'milestone',
    label: 'SafeRun',
    title: 'SafeRun — check AI-generated code before you run it',
    message: 'release: saferun-cli on PyPI',
    summary:
      'A CLI that scans AI-generated code (Semgrep and an offline OSV dependency scan) inside a locked-down analyzer container, then runs it only in a hardened Docker sandbox: no network, non-root, read-only and resource-limited. Signed analyzer images; published on PyPI as saferun-cli.',
    added: ['Hardened Docker sandbox', 'PASS / WARNING / FAIL verdicts', 'Published on PyPI'],
    removed: ['Running random scripts and hoping'],
    stack: ['Python', 'Docker', 'Semgrep', 'OSV-Scanner', 'cosign'],
    links: [
      { label: 'website', url: 'https://safe-run.netlify.app' },
      { label: 'PyPI', url: 'https://pypi.org/project/saferun-cli/' },
      { label: 'source', url: `${GH}/saferun` },
    ],
  },
  {
    id: 'pramaan',
    hash: 'b4a3aa0',
    branch: 'work',
    date: '2026-10-30',
    kind: 'project',
    label: 'Pramaan',
    title: 'Pramaan — a loan pre-underwriting copilot (capstone)',
    message: 'feat: multi-agent loan checks, human in the loop',
    summary:
      'Capstone project: a copilot for banks and NBFCs. A LangGraph multi-agent pipeline checks an applicant’s documents stage by stage — KYC, income and FOIR, credit, policy fit — scores the case in code and writes a report with policy citations. A human confirms every case. Synthetic data only.',
    added: ['LangGraph multi-agent pipeline', 'Role-based access with 2-step verification', 'Prometheus + Grafana monitoring'],
    removed: [],
    stack: ['Python', 'LangGraph', 'PostgreSQL', 'pgvector', 'Docker', 'Grafana'],
    links: [{ label: 'source', url: `${GH_WORK}/Loan_Pre_Underwriting_Copilot` }],
  },
  {
    id: 'recruitment',
    hash: '2c0d3e9',
    branch: 'work',
    date: '2026-11-10',
    kind: 'project',
    label: 'Hiring R2',
    title: 'Smart Recruitment Platform — Round 2 (coding)',
    message: 'feat(round-2): run, judge and score code in 6 languages',
    summary:
      'A six-person team project for campus hiring. I own Round 2, the coding round, across backend and frontend: a self-hosted Judge0 that runs SQL, Python, C, C++, Java and Go; Run (3 sample cases) and Submit (18 cases — hidden ones never reach the browser); code and timer drafts that survive refreshes and network loss; and the cut-off, ranking and advance-to-next-round logic.',
    added: [
      'Judge0 integration for 6 languages',
      'Run / Submit APIs with hidden test cases',
      'Draft and timer recovery',
      'Cut-off, ranking and round advancement',
    ],
    removed: ['Checking code by hand'],
    stack: ['Python', 'FastAPI', 'SQLAlchemy', 'Alembic', 'Judge0', 'Docker', 'Next.js', 'React', 'Monaco Editor'],
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
      text: "This isn't a normal portfolio — my journey is a git repository, and you're about to time-travel through it. Let me show you around.",
    },
    {
      id: 'graph',
      title: 'My life, as a git graph',
      text: 'Each line is a branch of my story — education, my work at Ampera and my side projects. Every dot is a commit: a project, a job or a milestone.',
    },
    {
      id: 'travel',
      year: 2023,
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
      commit: 'bingov',
      title: 'Check out any commit',
      text: 'Click any dot to open it: the story behind it, what changed (as a diff), the stack and live links. Arrow keys flip between commits.',
    },
    {
      id: 'terminal',
      command: 'whoami',
      title: 'Prefer the keyboard?',
      text: 'Press `Ctrl/⌘ K` anytime to open my terminal. Try `git log`, `ls skills`, `goto 2022` — and hunt for a few hidden commands.',
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
  { at: '2020-01', title: 'Hello, World', subtitle: 'school’s out, curiosity compiles', bg: '#04090a', ink: '#d9ffe9', accent: '#39ff88' },
  { at: '2020-08', title: 'The RGUKT years', subtitle: 'PUC at Nuzvid — where it all started', bg: '#060a1d', ink: '#e3e8ff', accent: '#6f8cff' },
  { at: '2022-08', title: 'Engineering mode', subtitle: 'B.Tech CSE, DSA and late-night labs', bg: '#0f0a1c', ink: '#f0e6ff', accent: '#c084fc' },
  { at: '2025-03', title: 'Builder season', subtitle: 'shipping real things for real users', bg: '#140d06', ink: '#fff1dc', accent: '#ffb547' },
  { at: '2026-05', title: 'Merged & graduated', subtitle: 'degree done, next branch loading', bg: '#160810', ink: '#ffe4ee', accent: '#ff5c8a' },
  { at: '2026-08', title: 'Ampera, Chennai', subtitle: 'AI, agents & production habits', bg: '#04161a', ink: '#dcfbff', accent: '#2de2e6' },
  { at: '2026-11-15', title: 'Right now', subtitle: 'HEAD → main, still compiling', bg: '#0a0b07', ink: '#f4f8e6', accent: '#d4ff3a' },
]
