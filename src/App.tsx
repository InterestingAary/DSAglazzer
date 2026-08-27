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
import { ProjectInfo } from './types';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const AppContent: React.FC = () => {
  const { state, dispatch, getProblemStatus, getSolvedCount } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeProblem, setActiveProblem] = useState<Problem>(problems[0]);
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);

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

  const recentActivities = useMemo(() => state.activities.slice(0, 8), [state.activities]);

  const revisionItems = useMemo(() =>
    state.revisions.filter(r => r.nextReview <= Date.now() + 7 * 24 * 60 * 60 * 1000),
    [state.revisions]
  );

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
    {
      id: 'proj-2',
      title: 'Algorithm Visualizer',
      description: 'Interactive algorithm visualizations for DSA',
      tech: ['D3.js', 'React', 'Canvas'],
      githubUrl: 'https://github.com/InterestingAary/algorithm-visualizer',
    },
    {
      id: 'proj-3',
      title: 'Code Challenges Bot',
      description: 'Telegram bot for daily coding problems',
      tech: ['Node.js', 'Python', 'API'],
      githubUrl: 'https://github.com/InterestingAary/code-bot',
    },
  ];

  return (
    <div className="min-h-screen bg-deep text-text-primary flex flex-col selection:bg-accent/40 selection:text-white">
      <CosmicBackground />
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        userStats={state.stats}
        onOpenDailyChallenge={() => setIsDailyChallengeOpen(true)}
        onOpenPortfolioModal={() => setIsPortfolioModalOpen(true)}
      />

      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6 relative z-10">
        <AnimatePresence mode="wait">
          {currentTab === 'dashboard' && (
            <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex flex-col gap-6">
              <HeroSection userStats={state.stats} />
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
            <div className="absolute inset-0 bg-deep/80 backdrop-blur-xl" onClick={() => setIsPortfolioModalOpen(false)} />
            <motion.div
              className="relative spatial-card-heavy max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto rounded-3xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
            >
              <div className="flex justify-between items-center pb-4 border-b border-glass-border mb-4">
                <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary gradient-text">Aaryan Mittal</h2>
                <button onClick={() => setIsPortfolioModalOpen(false)} className="spatial-btn px-3 py-1.5 text-xs uppercase font-bold text-text-secondary cursor-pointer">Close</button>
              </div>
              <PortfolioView projects={portfolioProjects} />
            </motion.div>
          </motion.div>
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
