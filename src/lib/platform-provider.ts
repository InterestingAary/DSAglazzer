// Platform Provider Abstraction
// Allows adding new coding platforms without rewriting core logic

export type Platform = 'leetcode' | 'codechef' | 'hackerrank' | 'codecademy' | 'neetcode';

export interface PlatformProblem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  tags: string[];
  acceptanceRate?: number;
  url: string;
  solvedAt?: Date;
  submissionId?: string;
  language?: string;
  sourceCode?: string;
}

export interface PlatformUser {
  id: string;
  username: string;
  profileUrl: string;
  avatarUrl?: string;
}

export interface SyncResult {
  totalFetched: number;
  newImported: number;
  duplicatesSkipped: number;
  errors: string[];
}

export interface PlatformProvider {
  // Platform identification
  readonly id: Platform;
  readonly name: string;
  readonly icon: string;
  readonly color: string;
  readonly description: string;
  readonly available: boolean;

  // Authentication
  connect(token: string): Promise<{ success: boolean; username?: string; error?: string }>;
  disconnect(): Promise<void>;
  validateToken(token: string): Promise<boolean>;
  getUserProfile(token: string): Promise<PlatformUser | null>;

  // Problem fetching
  fetchSolvedProblems(token: string, lastSyncedAt?: Date): Promise<PlatformProblem[]>;
  fetchProblemDetails(slug: string, token?: string): Promise<PlatformProblem | null>;
  fetchSolution(slug: string, language: string, token?: string): Promise<string | null>;

  // Sync
  sync(token: string, lastSyncedAt?: Date): Promise<SyncResult>;

  // Utilities
  getProblemUrl(slug: string): string;
  getSubmissionUrl(submissionId: string): string;
}

export abstract class BasePlatformProvider implements PlatformProvider {
  abstract readonly id: Platform;
  abstract readonly name: string;
  abstract readonly icon: string;
  abstract readonly color: string;
  abstract readonly description: string;
  abstract readonly available: boolean;

  abstract connect(token: string): Promise<{ success: boolean; username?: string; error?: string }>;
  abstract disconnect(): Promise<void>;
  abstract validateToken(token: string): Promise<boolean>;
  abstract getUserProfile(token: string): Promise<PlatformUser | null>;
  abstract fetchSolvedProblems(token: string, lastSyncedAt?: Date): Promise<PlatformProblem[]>;
  abstract fetchProblemDetails(slug: string, token?: string): Promise<PlatformProblem | null>;
  abstract fetchSolution(slug: string, language: string, token?: string): Promise<string | null>;
  abstract sync(token: string, lastSyncedAt?: Date): Promise<SyncResult>;
  abstract getProblemUrl(slug: string): string;
  abstract getSubmissionUrl(submissionId: string): string;

  protected async makeGraphQLRequest<T>(
    url: string,
    query: string,
    variables: Record<string, unknown> = {},
    headers: Record<string, string> = {}
  ): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(result.errors.map((e: { message: string }) => e.message).join(', '));
    }

    return result.data as T;
  }

  protected normalizeDifficulty(difficulty: string | number): 'Easy' | 'Medium' | 'Hard' {
    if (typeof difficulty === 'number') {
      if (difficulty === 1) return 'Easy';
      if (difficulty === 2) return 'Medium';
      return 'Hard';
    }
    const lower = difficulty.toLowerCase();
    if (lower.includes('easy')) return 'Easy';
    if (lower.includes('medium')) return 'Medium';
    if (lower.includes('hard')) return 'Hard';
    return 'Medium';
  }

  protected extractTopics(tags: string[]): string {
    const topicMap: Record<string, string> = {
      'array': 'Arrays',
      'string': 'Strings',
      'hash-table': 'Hashing',
      'two-pointers': 'Two Pointers',
      'linked-list': 'Linked Lists',
      'stack': 'Stack & Queue',
      'queue': 'Stack & Queue',
      'binary-search': 'Binary Search',
      'tree': 'Trees',
      'binary-tree': 'Trees',
      'heap': 'Heaps',
      'priority-queue': 'Heaps',
      'graph': 'Graphs',
      'dynamic-programming': 'Dynamic Programming',
      'backtracking': 'Backtracking',
      'trie': 'Tries',
      'bit-manipulation': 'Bit Manipulation',
      'greedy': 'Greedy',
      'sorting': 'Sorting',
      'sliding-window': 'Two Pointers',
      'prefix-sum': 'Arrays',
      'depth-first-search': 'Trees',
      'breadth-first-search': 'Trees',
    };

    for (const tag of tags) {
      const normalized = tag.toLowerCase().replace(/[^a-z-]/g, '');
      if (topicMap[normalized]) {
        return topicMap[normalized];
      }
    }
    return 'Arrays'; // Default
  }
}

export class ProviderRegistry {
  private static providers: Map<Platform, PlatformProvider> = new Map();

  static register(provider: PlatformProvider) {
    this.providers.set(provider.id, provider);
  }

  static get(id: Platform): PlatformProvider | undefined {
    return this.providers.get(id);
  }

  static getAll(): PlatformProvider[] {
    return Array.from(this.providers.values());
  }

  static getAvailable(): PlatformProvider[] {
    return this.getAll().filter(p => p.available);
  }
}