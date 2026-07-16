export type Platform = 'LeetCode' | 'Striver' | 'GFG' | 'CodeStudio' | 'Other';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface RevisionSchedule {
  dueDate: string;       // ISO Date format YYYY-MM-DD
  intervalDays: number;   // 3, 7, or 30 days
  status: 'pending' | 'completed' | 'skipped' | 'overdue';
  revisedAt?: string;     // ISO Date format YYYY-MM-DD
}

export interface Question {
  id: string;
  name: string;
  platform: Platform;
  topic: string;
  difficulty: Difficulty;
  link: string;
  solvedDate: string;     // ISO Date format YYYY-MM-DD
  notes: string;
  isFavourite: boolean;
  needsPractice: boolean;
  revisions: RevisionSchedule[]; // Exactly 3 revisions (day 3, 7, 30)
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  solvedCount: number;
  dueTodayCount: number;
  overdueCount: number;
  totalRevisionsCompleted: number;
  currentStreak: number;
  longestStreak: number;
}

export interface ActivityDay {
  date: string;  // YYYY-MM-DD
  count: number; // Combined solved and revised counts
}

export interface DatabaseState {
  questions: Question[];
  stats: UserStats;
  streakLastUpdated: string | null; // ISO Date YYYY-MM-DD
}
