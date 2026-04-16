import { supabase } from './supabase';
import { Habit, HabitCompletion, Category } from '../types';

// ── Habits ──────────────────────────────────────────────
export async function fetchHabits(userId: string): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
    .eq('archived', false)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createHabit(habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .insert(habit)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', id);
  if (error) throw error;
}

// ── Completions ─────────────────────────────────────────
export async function fetchCompletions(
  userId: string,
  startDate: string,
  endDate: string
): Promise<HabitCompletion[]> {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate);
  if (error) throw error;
  return data ?? [];
}

export async function toggleCompletion(
  habitId: string,
  userId: string,
  date: string
): Promise<HabitCompletion | null> {
  // Check existing
  const { data: existing } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .eq('date', date)
    .single();

  if (existing) {
    // Delete to toggle off
    await supabase.from('habit_completions').delete().eq('id', existing.id);
    return null;
  } else {
    // Insert to toggle on
    const { data, error } = await supabase
      .from('habit_completions')
      .insert({ habit_id: habitId, user_id: userId, date, completed: true })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export async function fetchCompletionsForHabit(
  habitId: string,
  userId: string
): Promise<HabitCompletion[]> {
  const { data, error } = await supabase
    .from('habit_completions')
    .select('*')
    .eq('habit_id', habitId)
    .eq('user_id', userId)
    .order('date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ── Categories ──────────────────────────────────────────
export async function fetchCategories(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}
