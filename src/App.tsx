import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import ScrollProgress from './components/ScrollProgress';
import SmoothScroll from './components/SmoothScroll';
import AppNavbar from './components/AppNavbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import TodayRevision from './pages/TodayRevision';
import AllQuestions from './pages/AllQuestions';
import Calendar from './pages/Calendar';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navigation } from './components/Navigation';
import { UniversePage } from './pages/UniversePage';
import { RoadmapPage } from './pages/RoadmapPage';
import { RevisionPage } from './pages/RevisionPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { PortfolioPage } from './pages/PortfolioPage';
import './App.css';

function AppContent() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      <Navigation />

      <ScrollProgress />
      <SmoothScroll />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-[80] rounded-lg bg-brand-600 px-4 py-2 text-white"
      >
        Skip to main content
      </a>

      <AppNavbar drawerOpen={isDrawerOpen} onToggleDrawer={() => setIsDrawerOpen(v => !v)} />

      {/* Drawer — collapsible left panel */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div id="app-drawer" className="relative flex h-full w-64 animate-in slide-in-from-left duration-250">
            <div onClick={() => setIsDrawerOpen(false)} className="h-full w-full">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      <div className="app-glow relative flex min-h-screen flex-col pt-16 text-zinc-900 transition-colors duration-150 dark:text-zinc-100">
        <main id="main-content" className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-6 md:px-6 md:py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<TodayRevision />} />
            <Route path="/questions" element={<AllQuestions />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />

            {/* ALGO_ELITE Command Center routes */}
            <Route path="/universe" element={<UniversePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/revision" element={<RevisionPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
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