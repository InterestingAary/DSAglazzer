import type { Question } from '../types';

// Helper to get today's date in YYYY-MM-DD in the local timezone
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Add days to YYYY-MM-DD date and return YYYY-MM-DD
export function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Parse string YYYY-MM-DD to Date object in local time
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Format Date object to YYYY-MM-DD in local time
export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Return list of dates (YYYY-MM-DD) for the last N days
export function getLastNDays(n: number): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(formatLocalDate(d));
  }
  return dates;
}

// Get all activity dates (solves and completed revisions)
export function getActivityMap(questions: Question[]): Map<string, number> {
  const activityMap = new Map<string, number>();

  questions.forEach(q => {
    // 1. Solve activity
    if (q.solvedDate) {
      activityMap.set(q.solvedDate, (activityMap.get(q.solvedDate) || 0) + 1);
    }
    // 2. Revision activity
    q.revisions.forEach(rev => {
      if (rev.status === 'completed' && rev.revisedAt) {
        activityMap.set(rev.revisedAt, (activityMap.get(rev.revisedAt) || 0) + 1);
      }
    });
  });

  return activityMap;
}

// Calculate streaks: current streak and longest streak based on activity dates
export function calculateStreak(questions: Question[]): { currentStreak: number; longestStreak: number } {
  const activityMap = getActivityMap(questions);
  const activeDates = Array.from(activityMap.keys()).sort(); // Chronological order YYYY-MM-DD
  
  if (activeDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  let longestStreak = 0;
  let currentStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  // Calculate longest streak by scanning sorted chronological dates
  activeDates.forEach(dateStr => {
    const currentDate = parseLocalDate(dateStr);
    
    if (prevDate === null) {
      runningStreak = 1;
    } else {
      const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day
        runningStreak++;
      } else if (diffDays > 1) {
        // Gap, reset running streak
        runningStreak = 1;
      }
      // If diffDays is 0 (same day), runningStreak doesn't change
    }
    
    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }
    prevDate = currentDate;
  });

  // Calculate current streak checking from today backwards
  const todayStr = getTodayDateString();
  const yesterdayStr = addDays(todayStr, -1);
  
  const hasActivityToday = activityMap.has(todayStr);
  const hasActivityYesterday = activityMap.has(yesterdayStr);

  if (!hasActivityToday && !hasActivityYesterday) {
    currentStreak = 0;
  } else {
    // Start tracking back from whichever date is active (today or yesterday)
    let startStr = hasActivityToday ? todayStr : yesterdayStr;
    currentStreak = 0;
    
    while (activityMap.has(startStr)) {
      currentStreak++;
      startStr = addDays(startStr, -1);
    }
  }

  // Double check longest streak is at least current streak
  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return { currentStreak, longestStreak };
}
