-- ╔══════════════════════════════════════════════════════════╗
-- ║  Dinho Tracker — Supabase Database Schema              ║
-- ║  Run this SQL in Supabase SQL Editor                    ║
-- ╚══════════════════════════════════════════════════════════╝

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Categories ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'star',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Habits ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'pulse',
  color TEXT NOT NULL DEFAULT 'purple',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  frequency TEXT NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'custom')),
  target_days INTEGER[] NOT NULL DEFAULT '{0,1,2,3,4,5,6}',
  archived BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Habit Completions ───────────────────────────────────
CREATE TABLE IF NOT EXISTS habit_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  habit_id UUID NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(habit_id, user_id, date)
);

-- ── Indexes ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_category ON habits(category_id);
CREATE INDEX IF NOT EXISTS idx_completions_habit ON habit_completions(habit_id);
CREATE INDEX IF NOT EXISTS idx_completions_user ON habit_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_completions_date ON habit_completions(date);
CREATE INDEX IF NOT EXISTS idx_completions_lookup ON habit_completions(habit_id, user_id, date);
CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);

-- ── Row Level Security ──────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own categories"
  ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories"
  ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories"
  ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories"
  ON categories FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own completions"
  ON habit_completions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own completions"
  ON habit_completions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own completions"
  ON habit_completions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own completions"
  ON habit_completions FOR DELETE USING (auth.uid() = user_id);
