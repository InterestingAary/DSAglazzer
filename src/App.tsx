import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { problems } from './data/problems';
import { Problem, Topic } from './types';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { DSAUniverse } from './components/DSAUniverse';
import { CodeEditorWorkspace } from './components/CodeEditorWorkspace';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { RevisionRadar } from './components/RevisionRadar';
import { RevisionView } from './components/RevisionView';
import { RoadmapView } from './components/RoadmapView';
import { PortfolioView } from './components/PortfolioView';
import { ActivityFeed } from './components/ActivityFeed';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { CosmicBackground } from './components/CosmicBackground';
import { Footer } from './components/Footer';
import { MyProblems } from './components/MyProblems';
import { ConnectedAccounts } from './components/ConnectedAccounts';
import { ImportExportModal } from './components/ImportExportModal';
import { AuthModal } from './components/AuthModal';
import { ProjectInfo } from './types';
import { Target, ArrowRight } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const AppContent: React.FC = () => {
  const { state, dispatch, getProblemStatus, getSolvedCount, isOnline, syncFromCloud, migrateLocalToCloud } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeProblem, setActiveProblem] = useState<Problem>(problems[0]);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isConnectedAccountsOpen, setIsConnectedAccountsOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const topicNodes = useMemo(() => {
    const topics: Topic[] = [
      'Arrays', 'Strings', 'Two Pointers', 'Linked Lists',
      'Stack & Queue', 'Binary Search', 'Trees', 'Heaps',
      'Graphs', 'Dynamic Programming', 'Backtracking', 'Tries', 'Bit Manipulation',
    ];
    return topics.map((topic, i) => {
      const topicProblems = problems.filter(p => p.topic === topic);
      const solvedCount = topicProblems.filter(p => getProblemStatus(p.id)?.status === 'solved').length;
      const angle = (i / topics.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 160;
      return {
        id: topic.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
        topic,
        progress: topicProblems.length > 0 ? (solvedCount / topicProblems.length) * 100 : 0,
        totalProblems: topicProblems.length,
        solvedProblems: solvedCount,
        status: solvedCount === topicProblems.length ? 'completed' as const :
                solvedCount > 0 ? 'in_progress' as const : 'locked' as const,
        description: `${solvedCount}/${topicProblems.length} solved`,
        position: { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius },
        connections: [],
      };
    });
  }, [state.problemStatuses]);

  const recentActivities = useMemo(() => state.activities.slice(0, 6), [state.activities]);

  const revisionItems = useMemo(() =>
    state.revisions.filter(r => r.nextReview <= Date.now() + 7 * 24 * 60 * 60 * 1000),
    [state.revisions]
  );

  const todayMissionProblems = useMemo(() => {
    const unsolved = problems.filter(p => !state.problemStatuses[p.id] || state.problemStatuses[p.id].status !== 'solved');
    const shuffled = [...unsolved].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  }, [state.problemStatuses]);

  const handleSelectProblem = (problem: Problem) => {
    setActiveProblem(problem);
    setCurrentTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProblemById = (problemId: string) => {
    const found = problems.find(p => p.id === problemId);
    if (found) handleSelectProblem(found);
  };

  const portfolioProjects: ProjectInfo[] = [
    {
      id: 'proj-1',
      title: 'DSAglazzer',
      description: 'Offline-first spaced repetition DSA tracker with heatmap, streaks, and analytics',
      tech: ['React 19', 'TypeScript', 'Vite', 'Tailwind'],
      githubUrl: 'https://github.com/InterestingAary/DSAglazzer',
      liveUrl: 'https://interestingaary.github.io/DSAglazzer/',
      featured: true,
    },
  ];

  const DIFFICULTY_CLASSES: Record<string, string> = {
    Easy: 'badge-emerald',
    Medium: 'badge-amber',
    Hard: 'badge-danger',
  };

  return (
    <div className="min-h-screen bg-[var(--color-deep)] text-[var(--color-text-primary)] flex flex-col selection:bg-[var(--color-accent)]/30 selection:text-white">
      <CosmicBackground />
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userStats={state.stats}
        onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
        onOpenPortfolioModal={() => setIsPortfolioModalOpen(true)}
        onOpenConnectedAccounts={() => setIsConnectedAccountsOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
      />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex flex-col gap-5 relative z-10">
        <AnimatePresence mode="wait">
          {currentTab === 'dashboard' && (
            <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-5">
              <HeroSection userStats={state.stats} />

              <motion.section
                className="card p-5 sm:p-6"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Today's Mission</h2>
                      <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">Recommended problems</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDailyChallengeOpen(true)}
                    className="text-[11px] font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-secondary)] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    Daily Challenge <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {todayMissionProblems.map((problem, i) => {
                    const status = getProblemStatus(problem.id);
                    const isSolved = status?.status === 'solved';
                    return (
                      <button
                        key={problem.id}
                        onClick={() => handleSelectProblem(problem)}
                        className="text-left p-3.5 rounded-lg bg-[var(--color-surface-elevated)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-overlay)] transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border ${DIFFICULTY_CLASSES[problem.difficulty]}`}>
                            {problem.difficulty}
                          </span>
                          {isSolved && (
                            <span className="text-[10px] font-semibold text-[var(--color-accent-emerald)]">Solved</span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors line-clamp-1">
                          {problem.title}
                        </h3>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-mono">{problem.topic}</p>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentTab('practice')}
                  className="mt-4 w-full spatial-btn-solid py-2.5 text-[11px] uppercase font-semibold tracking-wider cursor-pointer flex items-center justify-center gap-2"
                >
                  Start Practicing <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.section>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2">
                  <DSAUniverse
                    nodes={topicNodes}
                    problems={problems}
                    onSelectProblem={handleSelectProblem}
                  />
                </div>
                <div className="flex flex-col gap-5">
                  <RevisionRadar
                    items={revisionItems}
                    onReviewItem={handleSelectProblemById}
                  />
                  <ActivityFeed
                    activities={recentActivities}
                    onSelectProblemById={handleSelectProblemById}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentTab === 'practice' && (
            <motion.div key="practice" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <CodeEditorWorkspace
                problem={activeProblem}
                onBack={() => setCurrentTab('dashboard')}
              />
            </motion.div>
          )}

          {currentTab === 'roadmap' && (
            <motion.div key="roadmap" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <RoadmapView
                nodes={topicNodes}
                onSelectProblemById={handleSelectProblemById}
                onSelectTopic={(topic) => {
                  const topicProblem = problems.find(p => p.topic === topic);
                  if (topicProblem) handleSelectProblem(topicProblem);
                }}
              />
            </motion.div>
          )}

          {currentTab === 'progress' && (
            <motion.div key="progress" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ProgressAnalytics userStats={state.stats} nodes={topicNodes} />
            </motion.div>
          )}

          {currentTab === 'revision' && (
            <motion.div key="revision" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <RevisionView
                items={revisionItems}
                onReviewProblem={handleSelectProblemById}
              />
            </motion.div>
          )}

          {currentTab === 'my-problems' && (
            <motion.div key="my-problems" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <MyProblems />
            </motion.div>
          )}

          {currentTab === 'portfolio' && (
            <motion.div key="portfolio" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <PortfolioView projects={portfolioProjects} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer onSelectTab={setCurrentTab} />

      <AnimatePresence>
        {isDailyChallengeOpen && (
          <DailyChallengeModal
            problem={problems[Math.floor(Math.random() * problems.length)]}
            onClose={() => setIsDailyChallengeOpen(false)}
            onStartChallenge={(problem) => {
              setIsDailyChallengeOpen(false);
              handleSelectProblem(problem);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPortfolioModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-[var(--color-deep)]/80 backdrop-blur-sm" onClick={() => setIsPortfolioModalOpen(false)} />
            <motion.div
              className="relative card-elevated max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto rounded-xl"
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="flex justify-between items-center pb-4 border-b border-[var(--color-border)] mb-4">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">Aaryan Mittal</h2>
                <button
                  onClick={() => setIsPortfolioModalOpen(false)}
                  className="spatial-btn px-3 py-1.5 text-[11px] uppercase font-semibold text-[var(--color-text-secondary)] cursor-pointer"
                >
                  Close
                </button>
              </div>
              <PortfolioView projects={portfolioProjects} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isConnectedAccountsOpen && (
          <ConnectedAccounts onClose={() => setIsConnectedAccountsOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isImportExportOpen && (
          <ImportExportModal isOpen={isImportExportOpen} onClose={() => setIsImportExportOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthModalOpen && (
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            defaultMode={authMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;