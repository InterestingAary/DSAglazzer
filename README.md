# DSA Revision Tracker

![DSA Revision Tracker Preview](https://via.placeholder.com/1200x600?text=DSA+Revision+Tracker)

## 📌 Overview
The **DSA Revision Tracker** is a developer-focused, offline-first web application designed to help students and software engineers systematically track and revise Data Structures and Algorithms (DSA) questions. It leverages the power of spaced repetition to ensure that problems are revisited at scientifically optimal intervals (Day 3, Day 7, Day 30), drastically improving long-term retention. 

## ✨ Features
* **Spaced Repetition Engine:** Automatically schedules revisions for 3, 7, and 30 days after a problem is solved.
* **Offline-First (LocalStorage):** 100% of data is stored securely in your browser's local storage. No accounts, no database latency, no privacy concerns.
* **GitHub-Style Heatmap:** A visual 365-day grid tracking your daily problem-solving and revision activity.
* **Smart Streaks:** Dynamic daily streak calculation based on your latest activity.
* **Full CRUD & Filters:** Add, edit, delete, search, and deeply filter questions by Topic, Difficulty, Platform, and custom flags.
* **Calendar Agenda:** A dedicated month-view calendar showing scheduled, upcoming, overdue, and completed revisions with interactive dot indicators.
* **Progress Analytics:** Recharts-powered graphs analyzing your progress by difficulty and topic.
* **Dark Mode & Premium UI:** Built with Tailwind CSS v4 featuring sleek, modern UI components inspired by Linear and Vercel.
* **Data Portability:** Export your entire database to a JSON file and import it anytime.
* **Web Notifications:** Get browser alerts when revisions are due to keep your streak alive.

## 🛠 Tech Stack
* **Core:** React 19, TypeScript, Vite
* **Styling:** Tailwind CSS v4
* **Icons:** Lucide React
* **Charts:** Recharts
* **Routing:** React Router v7
* **State Management:** React Context API + LocalStorage Sync

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
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🚀 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/dsa-revision-tracker.git
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

## 🏗 Build Instructions

To generate a production-ready optimized build:
```bash
npm run build
```
This runs the strict TypeScript compiler and outputs minified static assets to the `dist/` directory. You can preview the production build using:
```bash
npm run preview
```

## 🔮 Future Improvements
* **Platform Integrations:** ✅ Chrome extension (MV3) auto-detects solved questions from LeetCode, GFG, Codeforces, CodeChef, AtCoder and syncs to web app.
* **Custom Intervals:** ✅ User-configurable spaced-repetition schedules in Settings.
* **Cloud Sync:** Optional OAuth and Supabase/Firebase integration for syncing progress across multiple devices.
* **Algorithm Tags:** ✅ 23 granular tags (Two Pointers, Sliding Window, DP, Graphs, etc.) with filtering.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
