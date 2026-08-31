export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Topic =
  | 'Arrays'
  | 'Strings'
  | 'Two Pointers'
  | 'Linked Lists'
  | 'Stack & Queue'
  | 'Binary Search'
  | 'Trees'
  | 'Heaps'
  | 'Graphs'
  | 'Dynamic Programming'
  | 'Backtracking'
  | 'Tries'
  | 'Bit Manipulation';

export type Language = 'javascript' | 'python' | 'cpp' | 'java';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: Topic;
  acceptanceRate: number;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  starterCode: Record<Language, string>;
  solutionCode: Record<Language, string>;
  testCases: TestCase[];
  hints: string[];
  tags: string[];
  timeComplexity: string;
  spaceComplexity: string;
}

export interface ProblemStatus {
  problemId: string;
  status: 'solved' | 'attempted' | 'unattempted';
  lastAttempted?: number;
  attempts: number;
  bestTime?: number;
  solvedLanguages: string[];
  lastReviewedAt?: number;
}

export interface RevisionItem {
  id: string;
  problemId: string;
  title: string;
  topic: Topic;
  difficulty: Difficulty;
  nextReview: number;
  ease: number;
  interval: number;
  repetitions: number;
  retention: number;
  status?: 'learning' | 'familiar' | 'strong' | 'mastered';
  lastReviewedAt?: number;
}

export interface ActivityItem {
  id: string;
  type: 'solved' | 'attempted' | 'revision' | 'badge' | 'streak' | 'sync' | 'import';
  title: string;
  detail: string;
  timestamp: number;
  problemId?: string;
  difficulty?: Difficulty;
  metadata?: Record<string, unknown>;
}

export interface UserStats {
  name: string;
  handle: string;
  streak: number;
  lastActiveDate: string;
  problemsThisWeek: number;
  totalSolved: number;
  totalAttempts: number;
  totalPracticeMinutes: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  rank: string;
  rating: number;
  badges: string[];
}

export interface AppState {
  stats: UserStats;
  problemStatuses: Record<string, ProblemStatus>;
  revisions: RevisionItem[];
  activities: ActivityItem[];
  settings: {
    language: Language;
    theme: 'dark' | 'light';
    dailyGoal: number;
  };
}

export interface UniverseNode {
  id: string;
  topic: Topic;
  progress: number;
  totalProblems: number;
  solvedProblems: number;
  status: 'completed' | 'in_progress' | 'locked';
  description: string;
  position: { x: number; y: number };
  connections: string[];
}

export interface ProjectInfo {
  id: string;
  title: string;
  description: string;
  tech: string[];
  stars?: number;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  output: string;
  code: number;
  signal: string | null;
  compile?: { output: string; stderr: string; code: number };
}
