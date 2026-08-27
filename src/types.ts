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

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isCustom?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  topic: Topic;
  acceptanceRate: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: {
    typescript: string;
    python: string;
    cpp: string;
    java: string;
  };
  solutionCode: {
    typescript: string;
    python: string;
    cpp: string;
    java: string;
  };
  timeComplexity: string;
  spaceComplexity: string;
  hints: string[];
  testCases: TestCase[];
  status: 'solved' | 'failed' | 'unattempted';
  lastAttempted?: string;
  nextRevisionDate?: string;
  tags: string[];
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

export interface ActivityItem {
  id: string;
  type: 'solved' | 'failed' | 'badge' | 'streak' | 'revision';
  title: string;
  detail: string;
  timeAgo: string;
  difficulty?: Difficulty;
  problemId?: string;
}

export interface RevisionItem {
  id: string;
  problemId: string;
  title: string;
  topic: Topic;
  difficulty: Difficulty;
  daysAgo: number;
  urgency: 'urgent' | 'warning' | 'normal';
  retention: number;
  intervalDays: number;
}

export interface UserStats {
  name: string;
  handle: string;
  streak: number;
  problemsThisWeek: number;
  accuracy: number;
  totalPracticeHours: number;
  totalSolved: number;
  totalProblems: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  rank: string;
  rating: number;
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