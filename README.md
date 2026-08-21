<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Space+Grotesk&size=26&pause=900&color=14B8A6&center=true&vCenter=true&width=640&lines=DSAglazzer;Spaced+Repetition+for+DSA;Build+in+Public" alt="Typing SVG" />

# DSAglazzer

**Remember what you solve. Revise on time. Never forget a pattern.**

<a href="https://interestingaary.github.io/DSAglazzer/"><img src="https://img.shields.io/badge/Live_Demo-14b8a6?style=for-the-badge&logo=github&logoColor=white" alt="Live Demo" /></a>
<a href="https://github.com/InterestingAary/DSAglazzer/actions"><img src="https://img.shields.io/github/actions/workflow/status/InterestingAary/DSAglazzer/ci.yml?label=CI%2FCD&style=for-the-badge&logo=github" alt="CI/CD" /></a>
<a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-0d9488?style=for-the-badge" alt="MIT License" /></a>
<a href="https://interestingaary.github.io/portfolio/"><img src="https://img.shields.io/badge/Portfolio-%E2%9C%A8-F7A928?style=for-the-badge" alt="Portfolio" /></a>

<br/>
<sup>Crafted by <a href="https://github.com/InterestingAary">Aaryan Mittal</a> — Developer • Builder • Creator • B.Tech CCE • Srujana 2026 Hackathon Winner • Google Student Ambassador 2026</sup>

</div>

---

![DSAglazzer Preview](https://via.placeholder.com/1200x600/0a0a0d/14b8a6?text=DSAglazzer+—+Portfolio-grade+DSA+Tracker)

> **Live:** **https://interestingaary.github.io/DSAglazzer/** — GitHub Pages (custom domain planned later). Add to Home Screen — it's a PWA.

## 📌 Overview

**DSAglazzer** is a developer-focused, offline-first DSA revision tracker built with **React 19 + Vite + Tailwind CSS v4**. It schedules every solved problem through **spaced repetition** (Day 3 · Day 7 · Day 30 — fully customizable) so you revisit patterns at the exact moment you'd otherwise forget them.

**Who is it for?** Students, competitive programmers, and interview prep grinders who are tired of solving 300 problems and remembering 30.

**How it works**

1. Solve a problem → `Add Question` with platform, topic, difficulty, algorithm tags.
2. App auto-schedules revisions at expanding intervals.
3. **Today's Revision** queue surfaces what's due. `Complete` advances, `Skip` postpones by a day, missed becomes `Overdue`.
4. Dashboard, Heatmap, Calendar, and Analytics keep you honest.

> Originally a collaborative tracker with [@avaneetg10371-create](https://github.com/avaneetg10371-create) — now iterated as **DSAglazzer** under [@InterestingAary](https://github.com/InterestingAary) at portfolio-level polish: grain + dot-grid + `Lenis` smooth scroll + `framer-motion` reveals + `Space Grotesk` / `Instrument Serif` typography.

## ✨ Features

- **Spaced Repetition Engine** — 3/7/30 defaults, editable in Settings (1–365 days, sorted & persisted).
- **Offline-First** — 100% LocalStorage, PWA installable, works offline.
- **Heatmap** — 365-day GitHub-style activity grid (teal scale).
- **Streaks** — smart daily streak from solves + revisions.
- **Full CRUD & Smart Filters** — topic, difficulty, platform, 23 algorithm tags, favourites, needs-practice, revision status + bulk delete/export.
- **Calendar** — month view with overdue/due/upcoming/completed dots + agenda drawer.
- **Analytics** — Recharts difficulty donut + top-topics bars + completion rate.
- **Portfolio-grade UI** — `Inter` + `Space Grotesk` + `Instrument Serif`, film grain, dot-grid, `card-lift`, `line` markers, scroll-progress bar, `Lenis`, `Reveal` entrances.
- **Dark/Light** — token-based themes, persisted.
- **Notifications** — browser push when revisions are due.
- **Data Portability** — import/export JSON, Danger Zone reset.
- **Chrome Extension (MV3)** — auto-detects *Accepted* solves on **LeetCode, GFG, Codeforces, CodeChef, AtCoder** → sync via `storage`.

## 🛠 Tech Stack

<p align="center">
  <a href="https://skillicons.dev"><img src="https://skillicons.dev/icons?i=react,typescript,vite,tailwind,nodejs,git,github,vscode&perline=8" alt="Stack" /></a>
</p>

- **Core:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS 4, custom tokens (`--color-brand-*`, grain, dot-grid, card-lift)
- **Motion:** `framer-motion` 13, `lenis` 1.3
- **Icons:** `lucide-react`
- **Charts:** `recharts` 3
- **Routing:** `react-router-dom` 7
- **State:** React Context API + LocalStorage sync
- **Testing:** `vitest` 4 + `@testing-library/react` 16 + `jsdom` (49 tests)
- **Extension:** `esbuild` 0.20, MV3
- **CI/CD:** GitHub Actions → GitHub Pages

## 📂 Structure

```
DSAglazzer/
├── public/                 # icons, manifest
├── src/
│   ├── components/         # ui/* + Reveal, SmoothScroll, ScrollProgress, Heatmap, QuestionCard, Sidebar
│   ├── context/            # DatabaseContext, ThemeContext
│   ├── pages/              # Dashboard, TodayRevision, AllQuestions, Calendar, Progress, Settings
│   ├── types/ & utils/     # spacedRepetition, dateUtils
│   ├── App.tsx & index.css # app-glow, dot-grid, grain, card-lift
│   └── main.tsx
├── extension/              # MV3: src/contentScripts/*, background.js, public/popup.*
├── .github/workflows/      # ci.yml (lint → typecheck → test → build → Pages)
└── vite.config.ts          # base: /DSAglazzer/
```

## 🚀 Quickstart

```bash
git clone https://github.com/InterestingAary/DSAglazzer.git
cd DSAglazzer
npm install
npm run dev        # http://localhost:5173
```

## 🧪 Tests

```bash
npm test           # 49 tests — dateUtils, spacedRepetition, DatabaseContext
```

## 🏗 Build

```bash
npm run build      # tsc -b && vite build → dist/
npm run preview
```

## 🧩 Chrome Extension

```bash
cd extension
npm install
npm run build      # → dist/ (load unpacked in chrome://extensions)
npm run package    # → dsa-tracker-extension.zip
```

Covers LeetCode (`/problems/*`), GFG (`/problems/*` + `/practice/*`), Codeforces (`/problemset/problem/*` etc.), CodeChef (`/problems/*`), AtCoder (`/contests/*/tasks/*`).

## 🚢 Deployment

Push to `main` → **GitHub Actions**: lint → typecheck → test → build → `upload Pages artifact` → deploy. Pages source: **GitHub Actions** (`/DSAglazzer/` base + `/DSAglazzer/sw.js`).

## 👤 Author

<div align="center">

**Aaryan Mittal** — [@InterestingAary](https://github.com/InterestingAary) · [Portfolio](https://interestingaary.github.io/portfolio/) · [LinkedIn](https://www.linkedin.com/in/aryan-mittal-3217b9381/) · Gaming & Vlog on YouTube

*B.Tech CCE — Building software, games, and ideas. 1st Place Srujana 2026 · Google Student Ambassador 2026.*

<img src="https://skillicons.dev/icons?i=js,ts,react,nodejs,python,cpp,html,css,tailwind,git,github&perline=9" alt="Aaryan skills" />

</div>

## 🙏 Acknowledgements

Evolved from a collaborative tracker with **Avaneet (@avaneetg10371-create)**. Original repo remains at `avaneetg10371-create/dsa-revision-tracker` (reset to initial). **DSAglazzer** is now maintained by **Aaryan Mittal** as a portfolio-grade iteration.

## 📄 License

MIT © 2026 [Aaryan Mittal](./LICENSE) — see [LICENSE](./LICENSE).
