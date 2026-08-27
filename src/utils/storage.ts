import { AppState, UserStats, ProblemStatus, RevisionItem, ActivityItem, Language } from '../types';

const STORAGE_KEY = 'dsaglazzer_state';

const DEFAULT_STATS: UserStats = {
  name: 'Aaryan Mittal',
  handle: 'interestingaary',
  streak: 0,
  lastActiveDate: '',
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
  rank: 'Beginner',
  rating: 800,
  badges: [],
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // corrupted data, reset
  }
  return getInitialState();
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or unavailable
  }
}

export function getInitialState(): AppState {
  return {
    stats: { ...DEFAULT_STATS },
    problemStatuses: {},
    revisions: [],
    activities: [],
    settings: {
      language: 'javascript',
      theme: 'dark',
      dailyGoal: 3,
    },
  };
}

export function updateProblemStatus(
  statuses: Record<string, ProblemStatus>,
  problemId: string,
  solved: boolean,
  language?: Language
): Record<string, ProblemStatus> {
  const existing = statuses[problemId];
  const now = Date.now();

  if (!existing) {
    return {
      ...statuses,
      [problemId]: {
        problemId,
        status: solved ? 'solved' : 'attempted',
        lastAttempted: now,
        attempts: 1,
        solvedLanguages: solved && language ? [language] as Language[] : [],
      },
    };
  }

  const updated = { ...existing };
  updated.lastAttempted = now;
  updated.attempts += 1;

  if (solved) {
    updated.status = 'solved';
    if (language && !updated.solvedLanguages.includes(language as Language)) {
      updated.solvedLanguages = [...updated.solvedLanguages, language as Language];
    }
  } else {
    updated.status = 'attempted';
  }

  return { ...statuses, [problemId]: updated };
}

export function addActivity(
  activities: ActivityItem[],
  activity: Omit<ActivityItem, 'id' | 'timestamp'>
): ActivityItem[] {
  const newActivity: ActivityItem = {
    ...activity,
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
  };
  return [newActivity, ...activities].slice(0, 50);
}

export function calculateStreak(activities: ActivityItem[]): number {
  const today = new Date().toDateString();
  const solvedToday = activities.some(
    (a) => a.type === 'solved' && new Date(a.timestamp).toDateString() === today
  );

  if (!solvedToday) return 0;

  let streak = 1;
  let checkDate = new Date();
  checkDate.setDate(checkDate.getDate() - 1);

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toDateString();
    const hasActivity = activities.some(
      (a) =>
        (a.type === 'solved' || a.type === 'revision') &&
        new Date(a.timestamp).toDateString() === dateStr
    );
    if (hasActivity) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function updateStats(stats: UserStats, activities: ActivityItem[]): UserStats {
  const now = new Date();
  const weekAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;

  const solvedThisWeek = activities.filter(
    (a) => a.type === 'solved' && a.timestamp > weekAgo
  ).length;

  const streak = calculateStreak(activities);

  const totalSolved = activities.filter((a) => a.type === 'solved').length;

  const easySolved = activities.filter(
    (a) => a.type === 'solved' && a.difficulty === 'Easy'
  ).length;
  const mediumSolved = activities.filter(
    (a) => a.type === 'solved' && a.difficulty === 'Medium'
  ).length;
  const hardSolved = activities.filter(
    (a) => a.type === 'solved' && a.difficulty === 'Hard'
  ).length;

  let rank = 'Beginner';
  let rating = 800;
  if (totalSolved >= 200) { rank = 'Master'; rating = 2000; }
  else if (totalSolved >= 100) { rank = 'Expert'; rating = 1600; }
  else if (totalSolved >= 50) { rank = 'Advanced'; rating = 1400; }
  else if (totalSolved >= 20) { rank = 'Intermediate'; rating = 1200; }
  else if (totalSolved >= 5) { rank = 'Apprentice'; rating = 1000; }

  const badges: string[] = [];
  if (streak >= 7) badges.push('7-Day Streak');
  if (streak >= 30) badges.push('30-Day Streak');
  if (totalSolved >= 10) badges.push('10 Problems Solved');
  if (totalSolved >= 50) badges.push('50 Problems Solved');
  if (totalSolved >= 100) badges.push('Century Club');
  if (easySolved >= 10) badges.push('Easy Master');
  if (mediumSolved >= 10) badges.push('Medium Master');
  if (hardSolved >= 5) badges.push('Hard Crusher');

  return {
    ...stats,
    streak,
    lastActiveDate: now.toDateString(),
    problemsThisWeek: solvedThisWeek,
    totalSolved,
    totalAttempts: stats.totalAttempts,
    totalPracticeMinutes: stats.totalPracticeMinutes,
    easySolved,
    mediumSolved,
    hardSolved,
    rank,
    rating,
    badges,
  };
}
