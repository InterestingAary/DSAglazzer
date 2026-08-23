export type ALDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ATestCase {
  id: string;
  input: string;
  expectedOutput: string;
  explanation?: string;
  isCustom?: boolean;
}

export interface AProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: ALDifficulty;
  topic: string;
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
  testCases: ATestCase[];
  status: 'solved' | 'failed' | 'unattempted';
  lastAttempted?: string;
  nextRevisionDate?: string;
  tags: string[];
}

export interface AUniverseNode {
  id: string;
  topic: string;
  progress: number;
  totalProblems: number;
  solvedProblems: number;
  status: 'completed' | 'in_progress' | 'locked';
  description: string;
  position: { x: number; y: number };
  connections: string[];
}

export interface AActivityItem {
  id: string;
  type: 'solved' | 'failed' | 'badge' | 'streak' | 'revision';
  title: string;
  detail: string;
  timeAgo: string;
  difficulty?: ALDifficulty;
  problemId?: string;
  topic: string;
}

export interface ARevisionItem {
  id: string;
  problemId: string;
  title: string;
  topic: string;
  difficulty: ALDifficulty;
  daysAgo: number;
  urgency: 'urgent' | 'warning' | 'normal';
  retention: number; // percentage
  intervalDays: number;
}

export interface AUserStats {
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

export interface AProjectInfo {
  id: string;
  title: string;
  description: string;
  tech: string[];
  stars?: number;
  githubUrl: string;
  liveUrl?: string;
  featured?: boolean;
}