import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { DatabaseProvider } from './context/DatabaseContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import ScrollProgress from './components/ScrollProgress';
import SmoothScroll from './components/SmoothScroll';
import TopGrid from './components/TopGrid';
import NeedleThread from './components/NeedleThread';
import BrandLogo from './components/BrandLogo';
import Dashboard from './pages/Dashboard';
import TodayRevision from './pages/TodayRevision';
import AllQuestions from './pages/AllQuestions';
import Calendar from './pages/Calendar';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function AppContent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isDrawerOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <ScrollProgress />
      <SmoothScroll />
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[80] px-4 py-2 bg-brand-600 text-white rounded-lg"
      >
        Skip to main content
      </a>

      {/* Top bar — hamburger controls drawer */}
      <header
        className={`fixed inset-x-0 top-0 z-40 h-16 border-b transition-colors duration-300 ${scrolled || isDrawerOpen ? "border-edge bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md" : "border-transparent bg-transparent"}`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-8">
          <BrandLogo size={34} />
          <button
            type="button"
            onClick={() => setIsDrawerOpen((v) => !v)}
            aria-expanded={isDrawerOpen}
            aria-controls="app-drawer"
            aria-label={isDrawerOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:border-brand-500/40 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-500/5 transition-colors"
          >
            {isDrawerOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Drawer — sidebar only after hamburger */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div id="app-drawer" className="relative flex w-64 h-full animate-in slide-in-from-left duration-250">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute right-3 top-3 z-10 p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X size={14} />
            </button>
            <div onClick={() => setIsDrawerOpen(false)} className="h-full w-full">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      <div className="app-glow flex min-h-screen text-zinc-900 dark:text-zinc-100 transition-colors duration-150 relative flex-col pt-16">
        {/* Top grid — sections on the top */}
        <div id="top" className="px-4 pt-4 md:px-8 md:pt-6">
          <TopGrid />
        </div>

        {/* Needle thread follows up */}
        <NeedleThread />

        {/* View Frame */}
        <main id="main-content" className="flex-1 px-4 py-6 md:px-8 md:py-8 relative">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<TodayRevision />} />
            <Route path="/questions" element={<AllQuestions />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </BrowserRouter>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export default App;