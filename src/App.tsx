import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DatabaseProvider } from './context/DatabaseContext';
import { ThemeProvider } from './context/ThemeContext';
import ScrollProgress from './components/ScrollProgress';
import SmoothScroll from './components/SmoothScroll';
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
import { PracticePage } from './pages/PracticePage';
import './App.css';

function AppContent() {
  return (
    <>
      <Navigation />
      <ScrollProgress />
      <SmoothScroll />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-[80] rounded-lg bg-[#10b981] px-4 py-2 text-black font-mono font-bold"
      >
        Skip to main content
      </a>

      <div className="relative flex min-h-screen flex-col pt-16 bg-[#080808] text-zinc-100 selection:bg-[#10b981]/30 selection:text-[#10b981]">
        <main id="main-content" className="mx-auto w-full max-w-[1360px] flex-1 px-4 py-6 md:px-6 md:py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/universe" element={<UniversePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/revision" element={<RevisionPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />

            {/* Preserved Secondary Views */}
            <Route path="/today" element={<TodayRevision />} />
            <Route path="/questions" element={<AllQuestions />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />

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
