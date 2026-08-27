import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AppState, UserStats, ProblemStatus, RevisionItem, ActivityItem, Language, Difficulty, Topic } from '../types';
import { loadState, saveState, updateProblemStatus, addActivity, updateStats } from '../utils/storage';
import { calculateSM2, ratingToQuality } from '../utils/spacedRepetition';
import { problems } from '../data/problems';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  solveProblem: (problemId: string, language: Language, difficulty: Difficulty, topic: Topic) => void;
  attemptProblem: (problemId: string, language: Language) => void;
  rateRevision: (revisionId: string, rating: 'again' | 'hard' | 'good' | 'mastered', problemId: string, title: string, topic: Topic, difficulty: Difficulty) => void;
  addRevision: (problemId: string, title: string, topic: Topic, difficulty: Difficulty) => void;
  getProblemStatus: (problemId: string) => ProblemStatus | undefined;
  getSolvedCount: () => number;
  getTopicProgress: (topic: Topic) => { solved: number; total: number };
}

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'UPDATE_STATS'; payload: UserStats }
  | { type: 'SET_PROBLEM_STATUSES'; payload: Record<string, ProblemStatus> }
  | { type: 'SET_REVISIONS'; payload: RevisionItem[] }
  | { type: 'SET_ACTIVITIES'; payload: ActivityItem[] }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'RESET' };

const AppContext = createContext<AppContextType | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'UPDATE_STATS':
      return { ...state, stats: action.payload };
    case 'SET_PROBLEM_STATUSES':
      return { ...state, problemStatuses: action.payload };
    case 'SET_REVISIONS':
      return { ...state, revisions: action.payload };
    case 'SET_ACTIVITIES':
      return { ...state, activities: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, settings: { ...state.settings, language: action.payload } };
    case 'RESET':
      return {
        stats: state.stats,
        problemStatuses: {},
        revisions: [],
        activities: [],
        settings: state.settings,
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const solveProblem = useCallback((problemId: string, language: Language, difficulty: Difficulty, topic: Topic) => {
    const newStatuses = updateProblemStatus(state.problemStatuses, problemId, true, language);
    const newActivities = addActivity(state.activities, {
      type: 'solved',
      title: `Solved problem`,
      detail: `${difficulty} ${topic}`,
      problemId,
      difficulty,
    });
    const newStats = updateStats({ ...state.stats, totalAttempts: state.stats.totalAttempts + 1 }, newActivities);

    dispatch({ type: 'SET_PROBLEM_STATUSES', payload: newStatuses });
    dispatch({ type: 'SET_ACTIVITIES', payload: newActivities });
    dispatch({ type: 'UPDATE_STATS', payload: newStats });
  }, [state]);

  const attemptProblem = useCallback((problemId: string, language: Language) => {
    const newStatuses = updateProblemStatus(state.problemStatuses, problemId, false, language);
    const newActivities = addActivity(state.activities, {
      type: 'attempted',
      title: `Attempted problem`,
      detail: `Tried solving`,
      problemId,
    });
    const newStats = updateStats({ ...state.stats, totalAttempts: state.stats.totalAttempts + 1 }, newActivities);

    dispatch({ type: 'SET_PROBLEM_STATUSES', payload: newStatuses });
    dispatch({ type: 'SET_ACTIVITIES', payload: newActivities });
    dispatch({ type: 'UPDATE_STATS', payload: newStats });
  }, [state]);

  const addRevision = useCallback((problemId: string, title: string, topic: Topic, difficulty: Difficulty) => {
    const exists = state.revisions.find(r => r.problemId === problemId);
    if (exists) return;

    const newRevision: RevisionItem = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      problemId,
      title,
      topic,
      difficulty,
      nextReview: Date.now() + 24 * 60 * 60 * 1000,
      ease: 2.5,
      interval: 1,
      repetitions: 0,
      retention: 100,
    };

    dispatch({ type: 'SET_REVISIONS', payload: [...state.revisions, newRevision] });
  }, [state.revisions]);

  const rateRevision = useCallback((revisionId: string, rating: 'again' | 'hard' | 'good' | 'mastered', problemId: string, title: string, topic: Topic, difficulty: Difficulty) => {
    const quality = ratingToQuality(rating);
    const existing = state.revisions.find(r => r.id === revisionId);

    if (existing) {
      const result = calculateSM2(quality, existing.ease, existing.interval, existing.repetitions);
      const updated: RevisionItem = {
        ...existing,
        ease: result.ease,
        interval: result.interval,
        repetitions: result.repetitions,
        nextReview: result.nextReview,
        retention: Math.max(0, Math.min(100, existing.retention + (rating === 'mastered' ? 20 : rating === 'good' ? 10 : rating === 'hard' ? -5 : -20))),
      };

      const newRevisions = state.revisions.map(r => r.id === revisionId ? updated : r);
      dispatch({ type: 'SET_REVISIONS', payload: newRevisions });

      const newActivities = addActivity(state.activities, {
        type: 'revision',
        title: `Reviewed ${title}`,
        detail: `Rated: ${rating} — Next review in ${result.interval}d`,
        problemId,
        difficulty,
      });
      dispatch({ type: 'SET_ACTIVITIES', payload: newActivities });
    } else {
      addRevision(problemId, title, topic, difficulty);
    }
  }, [state.revisions, state.activities, addRevision]);

  const getProblemStatus = useCallback((problemId: string) => {
    return state.problemStatuses[problemId];
  }, [state.problemStatuses]);

  const getSolvedCount = useCallback(() => {
    return Object.values(state.problemStatuses).filter(s => s.status === 'solved').length;
  }, [state.problemStatuses]);

  const getTopicProgress = useCallback((topic: Topic) => {
    const topicProblems = problems.filter(p => p.topic === topic);
    const total = topicProblems.length;
    const solved = topicProblems.filter(p => state.problemStatuses[p.id]?.status === 'solved').length;
    return { solved, total };
  }, [state.problemStatuses]);

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      solveProblem,
      attemptProblem,
      rateRevision,
      addRevision,
      getProblemStatus,
      getSolvedCount,
      getTopicProgress,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
