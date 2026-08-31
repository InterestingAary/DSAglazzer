export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          handle: string | null;
          avatar_url: string | null;
          rating: number;
          rank: string | null;
          total_solved: number;
          total_attempts: number;
          total_practice_minutes: number;
          streak: number;
          last_active_date: string | null;
          problems_this_week: number;
          easy_solved: number;
          easy_total: number;
          medium_solved: number;
          medium_total: number;
          hard_solved: number;
          hard_total: number;
          badges: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          handle?: string | null;
          avatar_url?: string | null;
          rating?: number;
          rank?: string | null;
          total_solved?: number;
          total_attempts?: number;
          total_practice_minutes?: number;
          streak?: number;
          last_active_date?: string | null;
          problems_this_week?: number;
          easy_solved?: number;
          easy_total?: number;
          medium_solved?: number;
          medium_total?: number;
          hard_solved?: number;
          hard_total?: number;
          badges?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string | null;
          handle?: string | null;
          avatar_url?: string | null;
          rating?: number;
          rank?: string | null;
          total_solved?: number;
          total_attempts?: number;
          total_practice_minutes?: number;
          streak?: number;
          last_active_date?: string | null;
          problems_this_week?: number;
          easy_solved?: number;
          easy_total?: number;
          medium_solved?: number;
          medium_total?: number;
          hard_solved?: number;
          hard_total?: number;
          badges?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      connected_accounts: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          platform_user_id: string | null;
          platform_username: string | null;
          access_token: string | null;
          refresh_token: string | null;
          token_expires_at: string | null;
          sync_enabled: boolean;
          last_synced_at: string | null;
          last_sync_status: string | null;
          last_sync_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          platform_user_id?: string | null;
          platform_username?: string | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          sync_enabled?: boolean;
          last_synced_at?: string | null;
          last_sync_status?: string | null;
          last_sync_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          platform_user_id?: string | null;
          platform_username?: string | null;
          access_token?: string | null;
          refresh_token?: string | null;
          token_expires_at?: string | null;
          sync_enabled?: boolean;
          last_synced_at?: string | null;
          last_sync_status?: string | null;
          last_sync_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      problems: {
        Row: {
          id: string;
          title: string;
          slug: string;
          difficulty: 'Easy' | 'Medium' | 'Hard';
          topics: string[];
          acceptance_rate: number | null;
          description: string | null;
          examples: Json | null;
          constraints: string[] | null;
          starter_code: Json | null;
          solution_code: Json | null;
          test_cases: Json | null;
          hints: string[] | null;
          tags: string[] | null;
          time_complexity: string | null;
          space_complexity: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          difficulty: 'Easy' | 'Medium' | 'Hard';
          topics?: string[];
          acceptance_rate?: number | null;
          description?: string | null;
          examples?: Json | null;
          constraints?: string[] | null;
          starter_code?: Json | null;
          solution_code?: Json | null;
          test_cases?: Json | null;
          hints?: string[] | null;
          tags?: string[] | null;
          time_complexity?: string | null;
          space_complexity?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          difficulty?: 'Easy' | 'Medium' | 'Hard';
          topics?: string[];
          acceptance_rate?: number | null;
          description?: string | null;
          examples?: Json | null;
          constraints?: string[] | null;
          starter_code?: Json | null;
          solution_code?: Json | null;
          test_cases?: Json | null;
          hints?: string[] | null;
          tags?: string[] | null;
          time_complexity?: string | null;
          space_complexity?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      problem_sources: {
        Row: {
          id: string;
          problem_id: string;
          platform: string;
          platform_problem_id: string | null;
          platform_slug: string | null;
          url: string | null;
          is_canonical: boolean;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          problem_id: string;
          platform: string;
          platform_problem_id?: string | null;
          platform_slug?: string | null;
          url?: string | null;
          is_canonical?: boolean;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          problem_id?: string;
          platform?: string;
          platform_problem_id?: string | null;
          platform_slug?: string | null;
          url?: string | null;
          is_canonical?: boolean;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_problems: {
        Row: {
          id: string;
          user_id: string;
          problem_id: string;
          status: 'solved' | 'attempted' | 'unattempted';
          difficulty: 'Easy' | 'Medium' | 'Hard';
          topic: string;
          solved_at: string | null;
          first_attempted_at: string | null;
          last_attempted_at: string | null;
          attempts: number;
          best_time_ms: number | null;
          solved_languages: string[];
          source_platform: string | null;
          source_submission_id: string | null;
          source_solved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          problem_id: string;
          status?: 'solved' | 'attempted' | 'unattempted';
          difficulty?: 'Easy' | 'Medium' | 'Hard';
          topic?: string;
          solved_at?: string | null;
          first_attempted_at?: string | null;
          last_attempted_at?: string | null;
          attempts?: number;
          best_time_ms?: number | null;
          solved_languages?: string[];
          source_platform?: string | null;
          source_submission_id?: string | null;
          source_solved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          problem_id?: string;
          status?: 'solved' | 'attempted' | 'unattempted';
          difficulty?: 'Easy' | 'Medium' | 'Hard';
          topic?: string;
          solved_at?: string | null;
          first_attempted_at?: string | null;
          last_attempted_at?: string | null;
          attempts?: number;
          best_time_ms?: number | null;
          solved_languages?: string[];
          source_platform?: string | null;
          source_submission_id?: string | null;
          source_solved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      solutions: {
        Row: {
          id: string;
          user_id: string;
          problem_id: string;
          language: string;
          source_code: string;
          submission_result: Json | null;
          test_results: Json | null;
          execution_time_ms: number | null;
          is_latest: boolean;
          attempt_number: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          problem_id: string;
          language: string;
          source_code: string;
          submission_result?: Json | null;
          test_results?: Json | null;
          execution_time_ms?: number | null;
          is_latest?: boolean;
          attempt_number?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          problem_id?: string;
          language?: string;
          source_code?: string;
          submission_result?: Json | null;
          test_results?: Json | null;
          execution_time_ms?: number | null;
          is_latest?: boolean;
          attempt_number?: number;
          created_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          user_id: string;
          problem_id: string;
          language: string;
          source_code: string;
          status: 'passed' | 'failed' | 'error';
          test_results: Json | null;
          execution_time_ms: number | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          problem_id: string;
          language: string;
          source_code: string;
          status: 'passed' | 'failed' | 'error';
          test_results?: Json | null;
          execution_time_ms?: number | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          problem_id?: string;
          language?: string;
          source_code?: string;
          status?: 'passed' | 'failed' | 'error';
          test_results?: Json | null;
          execution_time_ms?: number | null;
          error_message?: string | null;
          created_at?: string;
        };
      };
      revision_cards: {
        Row: {
          id: string;
          user_id: string;
          problem_id: string;
          ease_factor: number;
          interval_days: number;
          repetitions: number;
          next_review_at: string;
          last_reviewed_at: string | null;
          retention: number;
          status: 'learning' | 'familiar' | 'strong' | 'mastered';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          problem_id: string;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review_at: string;
          last_reviewed_at?: string | null;
          retention?: number;
          status?: 'learning' | 'familiar' | 'strong' | 'mastered';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          problem_id?: string;
          ease_factor?: number;
          interval_days?: number;
          repetitions?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
          retention?: number;
          status?: 'learning' | 'familiar' | 'strong' | 'mastered';
          created_at?: string;
          updated_at?: string;
        };
      };
      revision_events: {
        Row: {
          id: string;
          revision_card_id: string;
          user_id: string;
          rating: 'again' | 'hard' | 'good' | 'mastered';
          quality: number;
          previous_ease: number;
          previous_interval: number;
          previous_repetitions: number;
          new_ease: number;
          new_interval: number;
          new_repetitions: number;
          new_next_review_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          revision_card_id: string;
          user_id: string;
          rating: 'again' | 'hard' | 'good' | 'mastered';
          quality: number;
          previous_ease: number;
          previous_interval: number;
          previous_repetitions: number;
          new_ease: number;
          new_interval: number;
          new_repetitions: number;
          new_next_review_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          revision_card_id?: string;
          user_id?: string;
          rating?: 'again' | 'hard' | 'good' | 'mastered';
          quality?: number;
          previous_ease?: number;
          previous_interval?: number;
          previous_repetitions?: number;
          new_ease?: number;
          new_interval?: number;
          new_repetitions?: number;
          new_next_review_at?: string;
          created_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          type: 'solved' | 'attempted' | 'revision' | 'badge' | 'streak' | 'sync' | 'import';
          title: string;
          detail: string;
          problem_id: string | null;
          difficulty: 'Easy' | 'Medium' | 'Hard' | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'solved' | 'attempted' | 'revision' | 'badge' | 'streak' | 'sync' | 'import';
          title: string;
          detail: string;
          problem_id?: string | null;
          difficulty?: 'Easy' | 'Medium' | 'Hard' | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'solved' | 'attempted' | 'revision' | 'badge' | 'streak' | 'sync' | 'import';
          title?: string;
          detail?: string;
          problem_id?: string | null;
          difficulty?: 'Easy' | 'Medium' | 'Hard' | null;
          metadata?: Json | null;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          user_id: string;
          language: string;
          theme: 'dark' | 'light';
          daily_goal: number;
          revision_reminders: boolean;
          daily_reminder: boolean;
          reminder_time: string;
          sync_on_startup: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          language?: string;
          theme?: 'dark' | 'light';
          daily_goal?: number;
          revision_reminders?: boolean;
          daily_reminder?: boolean;
          reminder_time?: string;
          sync_on_startup?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          language?: string;
          theme?: 'dark' | 'light';
          daily_goal?: number;
          revision_reminders?: boolean;
          daily_reminder?: boolean;
          reminder_time?: string;
          sync_on_startup?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      import_jobs: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          status: 'pending' | 'syncing' | 'completed' | 'failed';
          total_fetched: number;
          new_imported: number;
          duplicates_skipped: number;
          errors: Json | null;
          started_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          status?: 'pending' | 'syncing' | 'completed' | 'failed';
          total_fetched?: number;
          new_imported?: number;
          duplicates_skipped?: number;
          errors?: Json | null;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          status?: 'pending' | 'syncing' | 'completed' | 'failed';
          total_fetched?: number;
          new_imported?: number;
          duplicates_skipped?: number;
          errors?: Json | null;
          started_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      user_problem_summary: {
        Row: {
          user_id: string;
          problem_id: string;
          title: string;
          slug: string;
          difficulty: 'Easy' | 'Medium' | 'Hard';
          topics: string[];
          status: 'solved' | 'attempted' | 'unattempted';
          solved_at: string | null;
          last_attempted_at: string | null;
          attempts: number;
          source_platform: string | null;
          revision_status: 'learning' | 'familiar' | 'strong' | 'mastered' | null;
          next_review_at: string | null;
          is_overdue: boolean | null;
        };
      };
      revision_due_summary: {
        Row: {
          user_id: string;
          overdue_count: number;
          due_today_count: number;
          upcoming_count: number;
          total_count: number;
        };
      };
    };
    Functions: {};
    Enums: {};
    CompositeTypes: {};
  };
}

export type Tables = Database['public']['Tables'];
export type ProfilesRow = Tables['profiles']['Row'];
export type ConnectedAccountsRow = Tables['connected_accounts']['Row'];
export type ProblemsRow = Tables['problems']['Row'];
export type ProblemSourcesRow = Tables['problem_sources']['Row'];
export type UserProblemsRow = Tables['user_problems']['Row'];
export type SolutionsRow = Tables['solutions']['Row'];
export type SubmissionsRow = Tables['submissions']['Row'];
export type RevisionCardsRow = Tables['revision_cards']['Row'];
export type RevisionEventsRow = Tables['revision_events']['Row'];
export type ActivitiesRow = Tables['activities']['Row'];
export type UserPreferencesRow = Tables['user_preferences']['Row'];
export type ImportJobsRow = Tables['import_jobs']['Row'];