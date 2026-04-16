import { create } from 'zustand';
import { Habit, HabitCompletion, Category, ViewMode, HabitWithCompletions } from '../types';
import * as api from '../services/api';

interface HabitState {
  habits: Habit[];
  completions: HabitCompletion[];
  categories: Category[];
  viewMode: ViewMode;
  selectedCategoryId: string | null;
  loading: boolean;

  setViewMode: (mode: ViewMode) => void;
  setSelectedCategory: (id: string | null) => void;

  loadHabits: (userId: string) => Promise<void>;
  loadCompletions: (userId: string, startDate: string, endDate: string) => Promise<void>;
  loadCategories: (userId: string) => Promise<void>;

  addHabit: (habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  editHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;

  toggleDay: (habitId: string, userId: string, date: string) => Promise<void>;

  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;

  getHabitsWithCompletions: () => HabitWithCompletions[];
  getFilteredHabits: () => HabitWithCompletions[];
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  completions: [],
  categories: [],
  viewMode: 'weekly',
  selectedCategoryId: null,
  loading: false,

  setViewMode: (mode) => set({ viewMode: mode }),
  setSelectedCategory: (id) => set({ selectedCategoryId: id }),

  loadHabits: async (userId) => {
    set({ loading: true });
    try {
      const habits = await api.fetchHabits(userId);
      set({ habits });
    } finally {
      set({ loading: false });
    }
  },

  loadCompletions: async (userId, startDate, endDate) => {
    const completions = await api.fetchCompletions(userId, startDate, endDate);
    set({ completions });
  },

  loadCategories: async (userId) => {
    const categories = await api.fetchCategories(userId);
    set({ categories });
  },

  addHabit: async (habit) => {
    const newHabit = await api.createHabit(habit);
    set((s) => ({ habits: [...s.habits, newHabit] }));
  },

  editHabit: async (id, updates) => {
    const updated = await api.updateHabit(id, updates);
    set((s) => ({ habits: s.habits.map((h) => (h.id === id ? updated : h)) }));
  },

  removeHabit: async (id) => {
    await api.deleteHabit(id);
    set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
  },

  toggleDay: async (habitId, userId, date) => {
    const result = await api.toggleCompletion(habitId, userId, date);
    set((s) => {
      if (result) {
        return { completions: [...s.completions, result] };
      }
      return {
        completions: s.completions.filter(
          (c) => !(c.habit_id === habitId && c.date === date)
        ),
      };
    });
  },

  addCategory: async (category) => {
    const newCat = await api.createCategory(category);
    set((s) => ({ categories: [...s.categories, newCat] }));
  },

  removeCategory: async (id) => {
    await api.deleteCategory(id);
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
  },

  getHabitsWithCompletions: () => {
    const { habits, completions } = get();
    return habits.map((habit) => {
      const habitCompletions = completions.filter((c) => c.habit_id === habit.id);
      const completionMap: Record<string, boolean> = {};
      habitCompletions.forEach((c) => { completionMap[c.date] = c.completed; });
      return { ...habit, completions: completionMap };
    });
  },

  getFilteredHabits: () => {
    const { selectedCategoryId } = get();
    const habitsWithCompletions = get().getHabitsWithCompletions();
    if (!selectedCategoryId) return habitsWithCompletions;
    return habitsWithCompletions.filter((h) => h.category_id === selectedCategoryId);
  },
}));
