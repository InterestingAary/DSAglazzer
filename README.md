# DSA Revision Tracker

![DSA Revision Tracker Preview](https://via.placeholder.com/1200x600?text=DSA+Revision+Tracker)

## 🌐 Live Demo

> **Temporary GitHub Pages deployment** — the project will move to a custom domain in the future.

**https://avaneetg10371-create.github.io/dsa-revision-tracker/**

## 📌 Overview

The **DSA Revision Tracker** is a developer-focused, offline-first web application designed to help students and software engineers systematically track and revise Data Structures and Algorithms (DSA) questions. It leverages the power of spaced repetition to ensure that problems are revisited at scientifically optimal intervals (Day 3, Day 7, Day 30), drastically improving long-term retention.

### Who is it for?

Anyone preparing for coding interviews — students, competitive programmers, and working professionals — who wants a reliable way to remember the problems they solve, instead of forgetting them within a week.

### How the revision system works

1. You solve a DSA problem and add it to the tracker.
2. The app automatically schedules revision sessions at expanding intervals (default: Day 3, Day 7, Day 30 — fully customizable in Settings).
3. Each due revision appears on the **Today's Revision** queue. Complete it to advance to the next interval, or skip it to postpone by one day.
4. Missed revisions become **overdue** and are prioritized on your dashboard, so nothing slips through the cracks.

## ✨ Features

* **Spaced Repetition Engine:** Automatically schedules revisions at 3, 7, and 30 days after a problem is solved — with fully customizable intervals.
* **Offline-First (LocalStorage):** 100% of data is stored securely in your browser's local storage. No accounts, no database latency, no privacy concerns. Works as a PWA.
* **GitHub-Style Heatmap:** A visual 365-day grid tracking your daily problem-solving and revision activity.
* **Smart Streaks:** Dynamic daily streak calculation based on your latest activity.
* **Full CRUD & Filters:** Add, edit, delete, search, and deeply filter questions by Topic, Difficulty, Platform, Algorithm Tags, and custom flags.
* **Bulk Operations:** Select multiple questions to delete or export them in one action.
* **Calendar Agenda:** A dedicated month-view calendar showing scheduled, upcoming, overdue, and completed revisions with interactive dot indicators.
* **Progress Analytics:** Recharts-powered graphs analyzing your progress by difficulty, topic, and revision performance.
* **Algorithm Tags:** 23 granular tags (Two Pointers, Sliding Window, DP, Graphs, etc.) with filtering.
* **Dark Mode:** Sleek light/dark theme with automatic persistence.
* **Data Portability:** Export your entire database to a JSON file and import it anytime.
* **Web Notifications:** Get browser alerts when revisions are due to keep your streak alive.
* **Chrome Extension (MV3):** Auto-detects solved problems on LeetCode, GFG, Codeforces, CodeChef, and AtCoder to quickly add them to your tracker.

## 🛠 Tech Stack

* **Core:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React
* **Charts:** Recharts
* **Routing:** React Router v7
* **State Management:** React Context API + LocalStorage Sync
* **Testing:** Vitest + React Testing Library
* **CI/CD:** GitHub Actions (lint, typecheck, tests, build, GitHub Pages deployment)
* **PWA:** vite-plugin-pwa (offline support + installable)

## 📂 Folder Structure

```
dsa-revision-tracker/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI primitives and complex components (Sidebar, Heatmap, Cards)
│   ├── context/            # Global state managers (DatabaseContext, ThemeContext)
│   ├── pages/              # Application views (Dashboard, Calendar, AllQuestions, etc.)
│   ├── types/              # TypeScript interfaces and type definitions
│   ├── utils/              # Helper functions for spaced repetition and date math
│   ├── App.tsx             # Root router and layout container
│   ├── index.css           # Global Tailwind directives and CSS variables
│   └── main.tsx            # React application entry point
├── extension/              # Chrome extension (MV3) source and build tooling
├── .github/workflows/      # CI/CD pipeline (build, test, deploy to GitHub Pages)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/avaneetg10371-create/dsa-revision-tracker.git
   cd dsa-revision-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## 💻 Running Locally

To start the Vite development server, run:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser. All your data will save instantly and persist locally.

## 🧪 Running Tests

```bash
npm test
```

## 🏗 Build Instructions

To generate a production-ready optimized build:
```bash
npm run build
```
This runs the strict TypeScript compiler and outputs minified static assets to the `dist/` directory. You can preview the production build using:
```bash
npm run preview
```

## 🚢 Deployment

The project deploys to **GitHub Pages** via GitHub Actions on every push to `main`:

```text
push to main
    ↓
GitHub Actions (npm install → lint → typecheck → test → build)
    ↓
upload Pages artifact
    ↓
deploy to GitHub Pages
```

The workflow lives in `.github/workflows/ci.yml`. GitHub Pages must be enabled in the repository settings (**Settings → Pages → Source: GitHub Actions**).

## 🔮 Future Improvements

* **Cloud Sync:** Optional OAuth and Supabase/Firebase integration for syncing progress across multiple devices.
* **Custom Domain:** Move the temporary GitHub Pages URL to a dedicated custom domain.

## 👥 Contributors

### Aaryan Mittal

**@InterestingAary**

Contributor / Developer

### Avaneet

**@avaneetg10371-create**

Repository Owner / Developer

## 🧩 Contributions

### Aaryan Mittal

Aaryan contributed substantially to the development of the project, including work across the application's implementation, UI, functionality, debugging, and project development. Concrete contributions include:

* **UI implementation:** refined the application's design system — sidebar, dashboard, cards, and page layouts
* **Frontend components:** built reusable UI primitives (Button, Card, Badge, Modal) and feature components (Heatmap, QuestionCard)
* **Application logic:** implemented the spaced-repetition scheduling engine and bulk operations
* **Feature development:** PWA support, customizable revision intervals, algorithm pattern tags, and the Chrome extension (MV3) with platform detectors
* **Testing:** set up the Vitest + React Testing Library suite (49 tests covering scheduling, date utilities, and state management)
* **Bug fixes & debugging:** resolved CI failures, type issues, and accessibility gaps
* **Deployment work:** configured the CI/CD pipeline and GitHub Pages deployment

## 🙏 Acknowledgements

This project was developed collaboratively by Aaryan Mittal and Avaneet.

The repository is maintained by the project team, with Avaneet as the repository owner and Aaryan contributing as a collaborator.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).