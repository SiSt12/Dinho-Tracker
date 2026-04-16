import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useHabitStore } from '../../src/stores/habitStore';
import { useAuthStore } from '../../src/stores/authStore';
import { HabitGridCard } from '../../src/components/habits/HabitGridCard';
import { HabitListCard } from '../../src/components/habits/HabitListCard';
import { HabitWeeklyRow, WeeklyHeader } from '../../src/components/habits/HabitWeeklyRow';
import { CategoryFilter } from '../../src/components/habits/CategoryFilter';
import { ViewModeSelector } from '../../src/components/habits/ViewModeSelector';
import { formatDate } from '../../src/utils/dates';
import { startOfYear, endOfYear, format } from 'date-fns';

export default function HabitsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const {
    viewMode,
    setViewMode,
    categories,
    selectedCategoryId,
    setSelectedCategory,
    loadHabits,
    loadCompletions,
    loadCategories,
    getFilteredHabits,
    toggleDay,
    loading,
  } = useHabitStore();

  const habits = getFilteredHabits();
  const today = formatDate(new Date());

  useEffect(() => {
    if (user) {
      const now = new Date();
      const yearStart = format(startOfYear(now), 'yyyy-MM-dd');
      const yearEnd = format(endOfYear(now), 'yyyy-MM-dd');
      loadHabits(user.id);
      loadCompletions(user.id, yearStart, yearEnd);
      loadCategories(user.id);
    }
  }, [user]);

  const handleCheckToday = useCallback(
    (habitId: string) => {
      if (user) toggleDay(habitId, user.id, today);
    },
    [user, today, toggleDay]
  );

  const handleToggleDay = useCallback(
    (habitId: string, date: string) => {
      if (user) toggleDay(habitId, user.id, date);
    },
    [user, toggleDay]
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.innerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/settings')}>
          <MaterialCommunityIcons name="cog-outline" size={24} color={theme.textSecondary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>
          Dinho<Text style={{ color: theme.primary }}>Tracker</Text>
        </Text>
        <View style={styles.headerRight}>
          <Pressable onPress={() => router.push('/(tabs)/stats')}>
            <MaterialCommunityIcons name="chart-bar" size={24} color={theme.textSecondary} />
          </Pressable>
          <Pressable onPress={() => router.push('/habit/new')}>
            <MaterialCommunityIcons name="plus-circle-outline" size={24} color={theme.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Category Filter */}
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedId={selectedCategoryId}
          onSelect={setSelectedCategory}
        />
      )}

      {/* View Mode Selector */}
      <View style={styles.viewModeRow}>
        <ViewModeSelector current={viewMode} onChange={setViewMode} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {habits.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="playlist-plus" size={64} color={theme.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>
              {t('habits.noHabits')}
            </Text>
            <Text style={[styles.emptyDesc, { color: theme.textTertiary }]}>
              {t('habits.noHabitsDesc')}
            </Text>
          </View>
        ) : viewMode === 'grid' ? (
          <View style={styles.gridContainer}>
            {habits.map((habit) => (
              <HabitGridCard
                key={habit.id}
                habit={habit}
                onPress={() => router.push(`/habit/${habit.id}`)}
                onCheckToday={() => handleCheckToday(habit.id)}
              />
            ))}
          </View>
        ) : viewMode === 'list' ? (
          <View style={styles.listContainer}>
            {habits.map((habit) => (
              <HabitListCard
                key={habit.id}
                habit={habit}
                onPress={() => router.push(`/habit/${habit.id}`)}
                onCheckToday={() => handleCheckToday(habit.id)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.weeklyContainer}>
            <WeeklyHeader label={t('views.last5days')} />
            {habits.map((habit) => (
              <HabitWeeklyRow
                key={habit.id}
                habit={habit}
                onPress={() => router.push(`/habit/${habit.id}`)}
                onToggleDay={(date) => handleToggleDay(habit.id, date)}
              />
            ))}
          </View>
        )}
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  viewModeRow: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  listContainer: {},
  weeklyContainer: {},
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyDesc: {
    fontSize: 14,
  },
});
