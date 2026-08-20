import type { RevisionSchedule } from '../types';
import { addDays } from './dateUtils';
import { DEFAULT_INTERVALS } from '../types';

export { DEFAULT_INTERVALS };

export function createRevisionSchedules(solvedDate: string, intervals: number[] = DEFAULT_INTERVALS): RevisionSchedule[] {
  return intervals.map(days => {
    const dueDate = addDays(solvedDate, days);
    return {
      dueDate,
      intervalDays: days,
      status: 'pending',
    };
  });
}

export function checkIsOverdue(dueDate: string, todayStr: string, status: string): boolean {
  if (status !== 'pending' && status !== 'overdue') {
    return false;
  }
  return dueDate < todayStr;
}

export function getRevisionIntervals(): number[] {
  if (typeof window === 'undefined') return DEFAULT_INTERVALS;
  try {
    const stored = localStorage.getItem('dsa_tracker_settings');
    if (stored) {
      const settings = JSON.parse(stored);
      if (settings.intervals && Array.isArray(settings.intervals) && settings.intervals.length > 0) {
        return settings.intervals;
      }
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_INTERVALS;
}

export function setRevisionIntervals(intervals: number[]): void {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem('dsa_tracker_settings');
    const settings = stored ? JSON.parse(stored) : {};
    settings.intervals = intervals;
    localStorage.setItem('dsa_tracker_settings', JSON.stringify(settings));
  } catch {
    // Ignore errors
  }
}