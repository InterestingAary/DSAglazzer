export type Platform = 'LeetCode' | 'Striver' | 'GFG' | 'CodeStudio' | 'Other';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type AlgorithmTag = 
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Binary Search'
  | 'Prefix Sum'
  | 'Stack'
  | 'Queue'
  | 'Linked List'
  | 'Trees'
  | 'Graphs'
  | 'Dynamic Programming'
  | 'Greedy'
  | 'Backtracking'
  | 'Bit Manipulation'
  | 'Math & Geometry'
  | 'Hash Map'
  | 'Heap / Priority Queue'
  | 'Trie'
  | 'Union Find'
  | 'Segment Tree'
  | 'Fenwick Tree'
  | 'Monotonic Stack'
  | 'Monotonic Queue'
  | 'Divide & Conquer'
  | 'Other';

export interface RevisionSchedule {
  dueDate: string;       // ISO Date format YYYY-MM-DD
  intervalDays: number;   // Custom interval days
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
  algorithmTags: AlgorithmTag[];
  revisions: RevisionSchedule[]; // Custom intervals
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

export interface SpacedRepetitionSettings {
  intervals: number[]; // e.g., [3, 7, 30]
}

export const DEFAULT_INTERVALS = [3, 7, 30];
export const SETTINGS_KEY = 'dsa_tracker_settings';
export const ALGORITHM_TAGS: AlgorithmTag[] = [
  'Two Pointers',
  'Sliding Window',
  'Binary Search',
  'Prefix Sum',
  'Stack',
  'Queue',
  'Linked List',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Bit Manipulation',
  'Math & Geometry',
  'Hash Map',
  'Heap / Priority Queue',
  'Trie',
  'Union Find',
  'Segment Tree',
  'Fenwick Tree',
  'Monotonic Stack',
  'Monotonic Queue',
  'Divide & Conquer',
  'Other',
];
