// LeetCode Platform Provider
import { PlatformProvider, PlatformProblem, PlatformUser, SyncResult, BasePlatformProvider } from './platform-provider';

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

interface LeetCodeUser {
  user: {
    username: string;
    profile: {
      userSlug: string;
    };
  };
}

interface LeetCodeProblem {
  title: string;
  titleSlug: string;
  difficulty: string;
  topicTags: Array<{ name: string; slug: string }>;
  acRate: number;
  paidOnly: boolean;
}

interface LeetCodeSubmission {
  id: string;
  title: string;
  titleSlug: string;
  statusDisplay: string;
  lang: string;
  timestamp: number;
  url: string;
}

interface LeetCodeUserSubmissions {
  recentAcSubmissionList: LeetCodeSubmission[];
}

export class LeetCodeProvider extends BasePlatformProvider {
  readonly id = 'leetcode' as const;
  readonly name = 'LeetCode';
  readonly icon = '🟠';
  readonly color = '#FFA116';
  readonly description = 'Import solved problems, submissions, and solutions from LeetCode';
  readonly available = true;

  private token: string | null = null;
  private username: string | null = null;

  async connect(token: string): Promise<{ success: boolean; username?: string; error?: string }> {
    try {
      this.token = token;

      // Validate token by fetching user profile
      const profile = await this.getUserProfile(token);
      if (!profile) {
        return { success: false, error: 'Invalid token or unable to fetch profile' };
      }

      this.username = profile.username;
      return { success: true, username: profile.username };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    }
  }

  async disconnect(): Promise<void> {
    this.token = null;
    this.username = null;
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile(token);
      return !!profile;
    } catch {
      return false;
    }
  }

  async getUserProfile(token: string): Promise<PlatformUser | null> {
    try {
      const data = await this.makeGraphQLRequest<LeetCodeUser>(
        LEETCODE_GRAPHQL_URL,
        `
          query getCurrentUser {
            user {
              username
              profile {
                userSlug
              }
            }
          }
        `,
        {},
        { 'Cookie': `LEETCODE_SESSION=${token}` }
      );

      if (!data.user?.username) return null;

      return {
        id: data.user.profile.userSlug,
        username: data.user.username,
        profileUrl: `https://leetcode.com/${data.user.profile.userSlug}/`,
      };
    } catch {
      return null;
    }
  }

  async fetchSolvedProblems(token: string, lastSyncedAt?: Date): Promise<PlatformProblem[]> {
    const problems: PlatformProblem[] = [];
    let hasMore = true;
    let offset = 0;
    const limit = 50;

    while (hasMore) {
      try {
        const data = await this.makeGraphQLRequest<{ recentAcSubmissionList: LeetCodeSubmission[] }>(
          LEETCODE_GRAPHQL_URL,
          `
            query recentAcSubmissions($username: String!, $limit: Int!, $offset: Int!) {
              recentAcSubmissionList(username: $username, limit: $limit, offset: $offset) {
                id
                title
                titleSlug
                statusDisplay
                lang
                timestamp
                url
              }
            }
          `,
          { username: this.username, limit, offset },
          { 'Cookie': `LEETCODE_SESSION=${token}` }
        );

        const submissions = data.recentAcSubmissionList || [];
        if (submissions.length === 0) break;

        for (const sub of submissions) {
          const solvedAt = new Date(sub.timestamp * 1000);
          
          // If lastSyncedAt is provided, stop when we reach older submissions
          if (lastSyncedAt && solvedAt <= lastSyncedAt) {
            hasMore = false;
            break;
          }

          // Fetch problem details
          const problemDetails = await this.fetchProblemDetails(sub.titleSlug, token);
          if (problemDetails) {
            problems.push({
              ...problemDetails,
              solvedAt,
              submissionId: sub.id,
              language: sub.lang,
            });
          }
        }

        if (submissions.length < limit) {
          hasMore = false;
        } else {
          offset += limit;
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        break;
      }
    }

    return problems;
  }

  async fetchProblemDetails(slug: string, token?: string): Promise<PlatformProblem | null> {
    try {
      const data = await this.makeGraphQLRequest<{ question: LeetCodeProblem }>(
        LEETCODE_GRAPHQL_URL,
        `
          query questionData($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
              title
              titleSlug
              difficulty
              topicTags { name slug }
              acRate
              paidOnly
            }
          }
        `,
        { titleSlug: slug },
        token ? { 'Cookie': `LEETCODE_SESSION=${token}` } : {}
      );

      const question = data.question;
      if (!question || question.paidOnly) return null;

      return {
        id: slug,
        title: question.title,
        slug: question.titleSlug,
        difficulty: this.normalizeDifficulty(question.difficulty),
        topic: this.extractTopics(question.topicTags.map(t => t.name)),
        tags: question.topicTags.map(t => t.name),
        acceptanceRate: question.acRate,
        url: `https://leetcode.com/problems/${slug}/`,
      };
    } catch {
      return null;
    }
  }

  async fetchSolution(slug: string, language: string, token?: string): Promise<string | null> {
    try {
      // LeetCode doesn't expose user's solution code via public API
      // This is a limitation - we can only get submission info, not the actual code
      return null;
    } catch {
      return null;
    }
  }

  async sync(token: string, lastSyncedAt?: Date): Promise<SyncResult> {
    const result: SyncResult = {
      totalFetched: 0,
      newImported: 0,
      duplicatesSkipped: 0,
      errors: [],
    };

    try {
      const problems = await this.fetchSolvedProblems(token, lastSyncedAt);
      result.totalFetched = problems.length;
      // The actual import logic would be handled by the caller
      result.newImported = problems.length;
    } catch (error) {
      result.errors.push((error as Error).message);
    }

    return result;
  }

  getProblemUrl(slug: string): string {
    return `https://leetcode.com/problems/${slug}/`;
  }

  getSubmissionUrl(submissionId: string): string {
    return `https://leetcode.com/submissions/detail/${submissionId}/`;
  }
}