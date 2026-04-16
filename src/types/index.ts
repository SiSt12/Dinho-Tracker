export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string;
  icon: string;
  color: HabitColor;
  category_id: string | null;
  frequency: HabitFrequency;
  target_days: number[]; // 0=Sun, 1=Mon, ... 6=Sat
  created_at: string;
  updated_at: string;
  archived: boolean;
  sort_order: number;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export type HabitColor =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'stone';

export type HabitFrequency = 'daily' | 'weekly' | 'custom';

export type ViewMode = 'grid' | 'list' | 'weekly';

export interface HabitWithCompletions extends Habit {
  completions: Record<string, boolean>; // date string -> completed
}

export interface HabitStats {
  totalCompleted: number;
  completionRate: number;
  weeklyDays: boolean[]; // Sun(0) to Sat(6) — true if completed
  currentStreak: number;
  bestStreak: number;
  completionsByMonth: Record<string, number>;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}
