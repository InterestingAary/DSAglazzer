import type { RevisionSchedule } from '../types';
import { addDays } from './dateUtils';

// Generates the initial 3 revisions for Day 3, Day 7, and Day 30
export function createRevisionSchedules(solvedDate: string): RevisionSchedule[] {
  const intervals = [3, 7, 30];
  
  return intervals.map(days => {
    const dueDate = addDays(solvedDate, days);
    return {
      dueDate,
      intervalDays: days,
      status: 'pending',
    };
  });
}

// Helper to check if a revision is overdue based on today's date
export function checkIsOverdue(dueDate: string, todayStr: string, status: string): boolean {
  if (status !== 'pending' && status !== 'overdue') {
    return false;
  }
  return dueDate < todayStr;
}
