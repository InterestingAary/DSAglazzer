-- DSA GLAZZER Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  handle TEXT UNIQUE,
  avatar_url TEXT,
  rating INTEGER DEFAULT 0,
  rank TEXT,
  total_solved INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  total_practice_minutes INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_active_date DATE,
  problems_this_week INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  easy_total INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  medium_total INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  hard_total INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CONNECTED ACCOUNTS
-- =====================================================
CREATE TABLE public.connected_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_user_id TEXT,
  platform_username TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  sync_enabled BOOLEAN DEFAULT TRUE,
  last_synced_at TIMESTAMPTZ,
  last_sync_status TEXT,
  last_sync_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- =====================================================
-- PROBLEMS (Canonical problem library)
-- =====================================================
CREATE TABLE public.problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  topics TEXT[] DEFAULT '{}',
  acceptance_rate NUMERIC,
  description TEXT,
  examples JSONB,
  constraints TEXT[],
  starter_code JSONB,
  solution_code JSONB,
  test_cases JSONB,
  hints TEXT[],
  tags TEXT[],
  time_complexity TEXT,
  space_complexity TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROBLEM SOURCES (Multi-platform identity)
-- =====================================================
CREATE TABLE public.problem_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_problem_id TEXT,
  platform_slug TEXT,
  url TEXT,
  is_canonical BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(problem_id, platform, platform_problem_id)
);

-- =====================================================
-- USER PROBLEMS (User's problem library)
-- =====================================================
CREATE TABLE public.user_problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'unattempted' CHECK (status IN ('solved', 'attempted', 'unattempted')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  topic TEXT NOT NULL,
  solved_at TIMESTAMPTZ,
  first_attempted_at TIMESTAMPTZ,
  last_attempted_at TIMESTAMPTZ,
  attempts INTEGER DEFAULT 0,
  best_time_ms INTEGER,
  solved_languages TEXT[] DEFAULT '{}',
  source_platform TEXT,
  source_submission_id TEXT,
  source_solved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- =====================================================
-- SOLUTIONS (User's saved solutions)
-- =====================================================
CREATE TABLE public.solutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  source_code TEXT NOT NULL,
  submission_result JSONB,
  test_results JSONB,
  execution_time_ms INTEGER,
  is_latest BOOLEAN DEFAULT TRUE,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- SUBMISSIONS (All attempts history)
-- =====================================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  source_code TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('passed', 'failed', 'error')),
  test_results JSONB,
  execution_time_ms INTEGER,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- REVISION CARDS (SM-2 Spaced Repetition)
-- =====================================================
CREATE TABLE public.revision_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  ease_factor NUMERIC DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review_at TIMESTAMPTZ NOT NULL,
  last_reviewed_at TIMESTAMPTZ,
  retention NUMERIC DEFAULT 100,
  status TEXT DEFAULT 'learning' CHECK (status IN ('learning', 'familiar', 'strong', 'mastered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- =====================================================
-- REVISION EVENTS (History of all reviews)
-- =====================================================
CREATE TABLE public.revision_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  revision_card_id UUID NOT NULL REFERENCES public.revision_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('again', 'hard', 'good', 'mastered')),
  quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
  previous_ease NUMERIC,
  previous_interval INTEGER,
  previous_repetitions INTEGER,
  new_ease NUMERIC,
  new_interval INTEGER,
  new_repetitions INTEGER,
  new_next_review_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ACTIVITIES (Activity feed)
-- =====================================================
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('solved', 'attempted', 'revision', 'badge', 'streak', 'sync', 'import')),
  title TEXT NOT NULL,
  detail TEXT,
  problem_id UUID REFERENCES public.problems(id) ON DELETE SET NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USER PREFERENCES
-- =====================================================
CREATE TABLE public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'javascript',
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  daily_goal INTEGER DEFAULT 3,
  revision_reminders BOOLEAN DEFAULT TRUE,
  daily_reminder BOOLEAN DEFAULT FALSE,
  reminder_time TIME DEFAULT '09:00:00',
  sync_on_startup BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- IMPORT JOBS (Sync tracking)
-- =====================================================
CREATE TABLE public.import_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'syncing', 'completed', 'failed')),
  total_fetched INTEGER DEFAULT 0,
  new_imported INTEGER DEFAULT 0,
  duplicates_skipped INTEGER DEFAULT 0,
  errors JSONB,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_connected_accounts_user_id ON public.connected_accounts(user_id);
CREATE INDEX idx_problems_slug ON public.problems(slug);
CREATE INDEX idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX idx_problem_sources_problem_id ON public.problem_sources(problem_id);
CREATE INDEX idx_problem_sources_platform ON public.problem_sources(platform);
CREATE INDEX idx_user_problems_user_id ON public.user_problems(user_id);
CREATE INDEX idx_user_problems_problem_id ON public.user_problems(problem_id);
CREATE INDEX idx_user_problems_status ON public.user_problems(status);
CREATE INDEX idx_user_problems_next_review ON public.user_problems(problem_id); -- For revision joins
CREATE INDEX idx_solutions_user_problem ON public.solutions(user_id, problem_id);
CREATE INDEX idx_solutions_latest ON public.solutions(user_id, problem_id, is_latest);
CREATE INDEX idx_submissions_user_problem ON public.submissions(user_id, problem_id);
CREATE INDEX idx_revision_cards_user_next ON public.revision_cards(user_id, next_review_at);
CREATE INDEX idx_revision_cards_status ON public.revision_cards(status);
CREATE INDEX idx_revision_events_user ON public.revision_events(user_id);
CREATE INDEX idx_revision_events_card ON public.revision_events(revision_card_id);
CREATE INDEX idx_activities_user_created ON public.activities(user_id, created_at DESC);
CREATE INDEX idx_import_jobs_user ON public.import_jobs(user_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles: Users can read all, but only manage their own
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Connected Accounts: Only owner can access
CREATE POLICY "Users can view their own connected accounts" ON public.connected_accounts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own connected accounts" ON public.connected_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own connected accounts" ON public.connected_accounts
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own connected accounts" ON public.connected_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Problems: Public read, admin write (we'll use service role for seeding)
CREATE POLICY "Problems are viewable by everyone" ON public.problems
  FOR SELECT USING (true);

-- Problem Sources: Public read
CREATE POLICY "Problem sources are viewable by everyone" ON public.problem_sources
  FOR SELECT USING (true);

-- User Problems: Users can only access their own
CREATE POLICY "Users can view their own problems" ON public.user_problems
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own problems" ON public.user_problems
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own problems" ON public.user_problems
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own problems" ON public.user_problems
  FOR DELETE USING (auth.uid() = user_id);

-- Solutions: Users can only access their own
CREATE POLICY "Users can view their own solutions" ON public.solutions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own solutions" ON public.solutions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own solutions" ON public.solutions
  FOR UPDATE USING (auth.uid() = user_id);

-- Submissions: Users can only access their own
CREATE POLICY "Users can view their own submissions" ON public.submissions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Revision Cards: Users can only access their own
CREATE POLICY "Users can view their own revision cards" ON public.revision_cards
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own revision cards" ON public.revision_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own revision cards" ON public.revision_cards
  FOR UPDATE USING (auth.uid() = user_id);

-- Revision Events: Users can only access their own
CREATE POLICY "Users can view their own revision events" ON public.revision_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own revision events" ON public.revision_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activities: Users can only access their own
CREATE POLICY "Users can view their own activities" ON public.activities
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own activities" ON public.activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Preferences: Users can only access their own
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Import Jobs: Users can only access their own
CREATE POLICY "Users can view their own import jobs" ON public.import_jobs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own import jobs" ON public.import_jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own import jobs" ON public.import_jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_connected_accounts_updated_at BEFORE UPDATE ON public.connected_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_problems_updated_at BEFORE UPDATE ON public.problems
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_problem_sources_updated_at BEFORE UPDATE ON public.problem_sources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_problems_updated_at BEFORE UPDATE ON public.user_problems
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_connected_accounts_updated_at_2 BEFORE UPDATE ON public.connected_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- VIEWS
-- =====================================================

-- User Problem Summary View
CREATE VIEW public.user_problem_summary AS
SELECT
  up.user_id,
  up.problem_id,
  p.title,
  p.slug,
  up.difficulty,
  up.topic,
  up.status,
  up.solved_at,
  up.last_attempted_at,
  up.attempts,
  up.source_platform,
  rc.status AS revision_status,
  rc.next_review_at,
  CASE
    WHEN rc.next_review_at IS NOT NULL AND rc.next_review_at < NOW() THEN true
    ELSE false
  END AS is_overdue
FROM public.user_problems up
JOIN public.problems p ON p.id = up.problem_id
LEFT JOIN public.revision_cards rc ON rc.user_id = up.user_id AND rc.problem_id = up.problem_id;

-- Revision Due Summary View
CREATE VIEW public.revision_due_summary AS
SELECT
  rc.user_id,
  COUNT(*) FILTER (WHERE rc.next_review_at < NOW() - INTERVAL '3 days') AS overdue_count,
  COUNT(*) FILTER (WHERE rc.next_review_at < NOW() AND rc.next_review_at >= NOW() - INTERVAL '3 days') AS due_today_count,
  COUNT(*) FILTER (WHERE rc.next_review_at >= NOW() AND rc.next_review_at < NOW() + INTERVAL '2 days') AS upcoming_count,
  COUNT(*) AS total_count
FROM public.revision_cards rc
GROUP BY rc.user_id;

-- Grant access to views
GRANT SELECT ON public.user_problem_summary TO authenticated;
GRANT SELECT ON public.revision_due_summary TO authenticated;