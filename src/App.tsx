import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { DatabaseProvider } from './context/DatabaseContext';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import TodayRevision from './pages/TodayRevision';
import AllQuestions from './pages/AllQuestions';
import Calendar from './pages/Calendar';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import './App.css';

function AppContent() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-600 text-white rounded-lg"
      >
        Skip to main content
      </a>
      <div className="flex min-h-screen app-glow text-zinc-900 dark:text-zinc-100 transition-colors duration-150">
      
      {/* Desktop Sidebar Panel */}
      <div className="hidden md:block shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          {/* Content Container */}
          <div className="relative flex flex-col w-64 h-full bg-zinc-950 border-r border-zinc-800 animate-in slide-in-from-left duration-250">
            {/* Close trigger */}
            <div className="absolute top-4 right-4 z-55">
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-white/[0.06] cursor-pointer"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
            {/* Navigation options click container */}
            <div onClick={() => setIsMobileMenuOpen(false)} className="h-full">
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Primary Display Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header Bar */}
        <header className="h-16 px-6 border-b border-zinc-800/70 dark:border-zinc-800/50 bg-zinc-950 flex items-center justify-between md:hidden shrink-0 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg brand-gradient flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">DSA Revise</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-200 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
        </header>

        {/* View Frame */}
        <main id="main-content" className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
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
