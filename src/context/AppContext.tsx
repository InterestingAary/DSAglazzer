import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useMemo } from 'react';
import { AppState, UserStats, ProblemStatus, RevisionItem, ActivityItem, Language, Difficulty, Topic } from '../types';
import { loadState, saveState, updateProblemStatus, addActivity, updateStats } from '../utils/storage';
import { calculateSM2, ratingToQuality } from '../utils/spacedRepetition';
import { problems } from '../data/problems';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ProfilesRow, UserProblemsRow, RevisionCardsRow, ActivitiesRow, UserPreferencesRow } from '../lib/database.types';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  solveProblem: (problemId: string, language: Language, difficulty: Difficulty, topic: Topic) => Promise<void>;
  attemptProblem: (problemId: string, language: Language) => Promise<void>;
  rateRevision: (revisionId: string, rating: 'again' | 'hard' | 'good' | 'mastered', problemId: string, title: string, topic: Topic, difficulty: Difficulty) => Promise<void>;
  addRevision: (problemId: string, title: string, topic: Topic, difficulty: Difficulty) => Promise<void>;
  getProblemStatus: (problemId: string) => ProblemStatus | undefined;
  getSolvedCount: () => number;
  getTopicProgress: (topic: Topic) => { solved: number; total: number };
  isOnline: boolean;
  syncFromCloud: () => Promise<void>;
  syncToCloud: () => Promise<void>;
  migrateLocalToCloud: () => Promise<void>;
}

type Action =
  | { type: 'SET_STATE'; payload: AppState }
  | { type: 'UPDATE_STATS'; payload: UserStats }
  | { type: 'SET_PROBLEM_STATUSES'; payload: Record<string, ProblemStatus> }
  | { type: 'SET_REVISIONS'; payload: RevisionItem[] }
  | { type: 'SET_ACTIVITIES'; payload: ActivityItem[] }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'RESET' };

const initialState: AppState = {
  stats: {
    name: 'Aaryan',
    handle: 'interestingaary',
    streak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
    problemsThisWeek: 0,
    totalSolved: 0,
    totalAttempts: 0,
    totalPracticeMinutes: 0,
    easySolved: 0,
    easyTotal: 0,
    mediumSolved: 0,
    mediumTotal: 0,
    hardSolved: 0,
    hardTotal: 0,
    rank: 'Unranked',
    rating: 0,
    badges: [],
  },
  problemStatuses: {},
  revisions: [],
  activities: [],
  settings: {
    language: 'javascript',
    theme: 'dark',
    dailyGoal: 3,
  },
};

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
    case 'SET_ONLINE':
      return state;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState, loadState);
  const [isOnline, setIsOnline] = useState(false);

  // Check online status
  useEffect(() => {
    const checkOnline = async () => {
      setIsOnline(isSupabaseConfigured() && !!supabase);
    };
    checkOnline();
  }, []);

  // Persist to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Convert Supabase data to local AppState
  const convertProfileToStats = useCallback((profile: ProfilesRow): UserStats => ({
    name: profile.name || 'User',
    handle: profile.handle || 'user',
    streak: profile.streak,
    lastActiveDate: profile.last_active_date || new Date().toISOString().split('T')[0],
    problemsThisWeek: profile.problems_this_week,
    totalSolved: profile.total_solved,
    totalAttempts: profile.total_attempts,
    totalPracticeMinutes: profile.total_practice_minutes,
    easySolved: profile.easy_solved,
    easyTotal: profile.easy_total,
    mediumSolved: profile.medium_solved,
    mediumTotal: profile.medium_total,
    hardSolved: profile.hard_solved,
    hardTotal: profile.hard_total,
    rank: profile.rank || 'Unranked',
    rating: profile.rating,
    badges: profile.badges || [],
  }), []);

  const convertUserProblemsToStatuses = useCallback((userProblems: UserProblemsRow[]): Record<string, ProblemStatus> => {
    const statuses: Record<string, ProblemStatus> = {};
    for (const up of userProblems) {
      statuses[up.problem_id] = {
        problemId: up.problem_id,
        status: up.status,
        lastAttempted: up.last_attempted_at ? new Date(up.last_attempted_at).getTime() : undefined,
        attempts: up.attempts,
        bestTime: up.best_time_ms || undefined,
        solvedLanguages: (up.solved_languages || []) as string[],
      };
    }
    return statuses;
  }, []);

const convertRevisionCards = useCallback((cards: RevisionCardsRow[]): RevisionItem[] => {
    return cards.map(rc => ({
      id: rc.id,
      problemId: rc.problem_id,
      title: '', // Will be filled from problems
      topic: 'Arrays' as Topic, // Will be filled from problems
      difficulty: 'Easy' as Difficulty, // Will be filled
      nextReview: new Date(rc.next_review_at).getTime(),
      ease: rc.ease_factor,
      interval: rc.interval_days,
      repetitions: rc.repetitions,
      retention: rc.retention,
      status: rc.status,
      lastReviewedAt: rc.last_reviewed_at ? new Date(rc.last_reviewed_at).getTime() : undefined,
    }));
  }, []);

  const convertActivities = useCallback((activities: ActivitiesRow[]): ActivityItem[] => {
    return activities.map(a => ({
      id: a.id,
      type: a.type,
      title: a.title,
      detail: a.detail,
      timestamp: new Date(a.created_at).getTime(),
      problemId: a.problem_id || undefined,
      difficulty: a.difficulty || undefined,
      metadata: a.metadata as Record<string, unknown> | undefined,
    }));
  }, []);

  // Sync from cloud to local state
  const syncFromCloud = useCallback(async () => {
    if (!supabase) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        dispatch({ type: 'UPDATE_STATS', payload: convertProfileToStats(profile) });
      }

      // Fetch user problems
      const { data: userProblems } = await supabase
        .from('user_problems')
        .select('*')
        .eq('user_id', user.id);

      if (userProblems) {
        dispatch({ type: 'SET_PROBLEM_STATUSES', payload: convertUserProblemsToStatuses(userProblems) });
      }

      // Fetch revision cards
      const { data: revisionCards } = await supabase
        .from('revision_cards')
        .select('*')
        .eq('user_id', user.id);

      if (revisionCards) {
        dispatch({ type: 'SET_REVISIONS', payload: convertRevisionCards(revisionCards) });
      }

      // Fetch activities
      const { data: activities } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (activities) {
        dispatch({ type: 'SET_ACTIVITIES', payload: convertActivities(activities) });
      }

      // Fetch preferences
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (preferences) {
        dispatch({ type: 'SET_LANGUAGE', payload: preferences.language as Language });
      }
    } catch (error) {
      console.error('Sync from cloud failed:', error);
    }
  }, [convertProfileToStats, convertUserProblemsToStatuses, convertRevisionCards, convertActivities]);

  // Sync local state to cloud
  const syncToCloud = useCallback(async () => {
    if (!supabase) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update profile
      await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: state.stats.name,
          handle: state.stats.handle,
          rating: state.stats.rating,
          rank: state.stats.rank,
          total_solved: state.stats.totalSolved,
          total_attempts: state.stats.totalAttempts,
          total_practice_minutes: state.stats.totalPracticeMinutes,
          streak: state.stats.streak,
          last_active_date: state.stats.lastActiveDate,
          problems_this_week: state.stats.problemsThisWeek,
          easy_solved: state.stats.easySolved,
          easy_total: state.stats.easyTotal,
          medium_solved: state.stats.mediumSolved,
          medium_total: state.stats.mediumTotal,
          hard_solved: state.stats.hardSolved,
          hard_total: state.stats.hardTotal,
          badges: state.stats.badges,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      // Sync user problems
      for (const [problemId, status] of Object.entries(state.problemStatuses)) {
        await supabase
          .from('user_problems')
          .upsert({
            user_id: user.id,
            problem_id: problemId,
            status: status.status,
            difficulty: status.status === 'solved' ? 'Easy' : 'Easy', // TODO: get actual difficulty
            topic: '', // TODO: get from problems
            solved_at: status.status === 'solved' ? new Date().toISOString() : null,
            last_attempted_at: status.lastAttempted ? new Date(status.lastAttempted).toISOString() : null,
            attempts: status.attempts,
            best_time_ms: status.bestTime,
            solved_languages: status.solvedLanguages as string[],
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,problem_id' });
      }

      // Sync revisions
      for (const rev of state.revisions) {
        await supabase
          .from('revision_cards')
          .upsert({
            user_id: user.id,
            problem_id: rev.problemId,
            ease_factor: rev.ease,
            interval_days: rev.interval,
            repetitions: rev.repetitions,
            next_review_at: new Date(rev.nextReview).toISOString(),
            last_reviewed_at: rev.lastReviewedAt ? new Date(rev.lastReviewedAt).toISOString() : null,
            retention: rev.retention,
            status: rev.status || 'learning',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id,problem_id' });
      }

      // Sync activities (only new ones)
      for (const activity of state.activities.slice(0, 50)) {
        await supabase
          .from('activities')
          .insert({
            user_id: user.id,
            type: activity.type,
            title: activity.title,
            detail: activity.detail,
            problem_id: activity.problemId,
            difficulty: activity.difficulty,
            metadata: activity.metadata,
            created_at: new Date(activity.timestamp).toISOString(),
          });
      }

      // Sync preferences
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          language: state.settings.language,
          theme: state.settings.theme,
          daily_goal: state.settings.dailyGoal,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

    } catch (error) {
      console.error('Sync to cloud failed:', error);
    }
  }, [state]);

  // Migrate localStorage data to cloud
  const migrateLocalToCloud = useCallback(async () => {
    if (!supabase) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await syncToCloud();
  }, [syncToCloud]);

  const solveProblem = useCallback(async (problemId: string, language: Language, difficulty: Difficulty, topic: Topic) => {
    const newStatuses = updateProblemStatus(state.problemStatuses, problemId, true, language);
    const newActivities = addActivity(state.activities, {
      type: 'solved',
      title: `Solved ${difficulty} problem`,
      detail: topic,
      problemId,
      difficulty,
    });
    const newStats = updateStats({ ...state.stats, totalAttempts: state.stats.totalAttempts + 1 }, newActivities);

    dispatch({ type: 'SET_PROBLEM_STATUSES', payload: newStatuses });
    dispatch({ type: 'SET_ACTIVITIES', payload: newActivities });
    dispatch({ type: 'UPDATE_STATS', payload: newStats });

    // Add to revision queue
    addRevision(problemId, '', topic, difficulty);

    if (isOnline) await syncToCloud();
  }, [state, isOnline, syncToCloud]);

  const attemptProblem = useCallback(async (problemId: string, language: Language) => {
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

    if (isOnline) await syncToCloud();
  }, [state, isOnline, syncToCloud]);

  const addRevision = useCallback(async (problemId: string, title: string, topic: Topic, difficulty: Difficulty) => {
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
      status: 'learning',
    };

    const newRevisions = [...state.revisions, newRevision];
    dispatch({ type: 'SET_REVISIONS', payload: newRevisions });

    if (isOnline) {
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('revision_cards').upsert({
            user_id: user.id,
            problem_id: problemId,
            ease_factor: 2.5,
            interval_days: 1,
            repetitions: 0,
            next_review_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            retention: 100,
            status: 'learning',
          }, { onConflict: 'user_id,problem_id' });
        }
      }
    }
  }, [state, isOnline]);

  const rateRevision = useCallback(async (revisionId: string, rating: 'again' | 'hard' | 'good' | 'mastered', problemId: string, title: string, topic: Topic, difficulty: Difficulty) => {
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
        lastReviewedAt: Date.now(),
        status: rating === 'mastered' ? 'mastered' : rating === 'good' ? 'strong' : rating === 'hard' ? 'familiar' : 'learning',
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

      if (isOnline && supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Update revision card
          await supabase.from('revision_cards').update({
            ease_factor: result.ease,
            interval_days: result.interval,
            repetitions: result.repetitions,
            next_review_at: new Date(result.nextReview).toISOString(),
            retention: updated.retention,
            status: updated.status,
            last_reviewed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }).eq('id', revisionId);

          // Log revision event
          await supabase.from('revision_events').insert({
            revision_card_id: revisionId,
            user_id: user.id,
            rating,
            quality,
            previous_ease: existing.ease,
            previous_interval: existing.interval,
            previous_repetitions: existing.repetitions,
            new_ease: result.ease,
            new_interval: result.interval,
            new_repetitions: result.repetitions,
            new_next_review_at: new Date(result.nextReview).toISOString(),
          });
        }
      }
    } else {
      await addRevision(problemId, title, topic, difficulty);
    }
  }, [state, isOnline, addRevision]);

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
      isOnline,
      syncFromCloud,
      syncToCloud,
      migrateLocalToCloud,
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