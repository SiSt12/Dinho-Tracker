import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { showConfirm } from '../../src/utils/alert';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useHabitStore } from '../../src/stores/habitStore';
import { useAuthStore } from '../../src/stores/authStore';
import { YearHeatmap } from '../../src/components/stats/YearHeatmap';
import { StatCard } from '../../src/components/stats/StatCard';
import { WeeklyRateCard } from '../../src/components/stats/WeeklyRateCard';
import { CompletionsChart } from '../../src/components/stats/CompletionsChart';
import { calculateStats } from '../../src/utils/dates';
import { HABIT_COLORS } from '../../src/constants/habits';
import * as api from '../../src/services/api';

export default function HabitDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const habits = useHabitStore((s) => s.habits);
  const removeHabit = useHabitStore((s) => s.removeHabit);

  const [year, setYear] = useState(new Date().getFullYear());
  const [completions, setCompletions] = useState<Record<string, boolean>>({});

  const habit = habits.find((h) => h.id === id);
  const colors = HABIT_COLORS[habit?.color ?? 'purple'] ?? HABIT_COLORS.purple;

  useEffect(() => {
    if (habit && user) {
      api.fetchCompletionsForHabit(habit.id, user.id).then((data) => {
        const map: Record<string, boolean> = {};
        data.forEach((c) => { map[c.date] = c.completed; });
        setCompletions(map);
      });
    }
  }, [habit, user]);

  if (!habit) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: theme.textSecondary }]}>Habit not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const stats = calculateStats(completions, habit.created_at);

  const handleDelete = () => {
    showConfirm(
      t('common.confirm'),
      t('habits.deleteConfirm'),
      async () => {
        await removeHabit(habit.id);
        router.back();
      },
      t('common.delete'),
      t('common.cancel')
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.innerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={theme.textSecondary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <View style={[styles.iconCircle, { backgroundColor: colors.light }]}>
            <MaterialCommunityIcons
              name={(habit.icon as any) || 'pulse'}
              size={22}
              color={colors.base}
            />
          </View>
          <Text style={[styles.habitName, { color: theme.text }]}>{habit.name}</Text>
        </View>
        <Pressable onPress={handleDelete}>
          <MaterialCommunityIcons name="delete-outline" size={24} color={theme.error} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Year Navigation */}
        <View style={styles.yearNav}>
          <Pressable onPress={() => setYear((y) => y - 1)}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={theme.textSecondary} />
          </Pressable>
          <Text style={[styles.yearText, { color: theme.text }]}>{year}</Text>
          <Pressable onPress={() => setYear((y) => y + 1)}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondary} />
          </Pressable>
        </View>

        {/* Year Heatmap */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.monthLabels}>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
              <Text key={m} style={[styles.monthLabel, { color: theme.textTertiary }]}>{m}</Text>
            ))}
          </View>
          <YearHeatmap completions={completions} color={habit.color} year={year} />
        </View>

        {/* Stats */}
        <View style={styles.statRow}>
          <StatCard
            label={t('stats.completedDays')}
            value={stats.totalCompleted}
            icon="#"
            color={habit.color}
          />
          <View style={{ width: 12 }} />
          <WeeklyRateCard
            label={t('stats.completionRate')}
            rate={stats.completionRate}
            weeklyDays={stats.weeklyDays}
            color={habit.color}
          />
        </View>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <CompletionsChart data={stats.completionsByMonth} color={habit.color} year={year} />
        </View>

        {/* Streaks */}
        <View style={styles.statRow}>
          <StatCard
            label={t('stats.currentStreak')}
            value={stats.currentStreak}
            icon="🔥"
            color={habit.color}
          />
          <View style={{ width: 12 }} />
          <StatCard
            label={t('stats.bestStreak')}
            value={stats.bestStreak}
            icon="🔥"
            color={habit.color}
          />
        </View>

        {/* Description */}
        {habit.description ? (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <Text style={[styles.descLabel, { color: theme.textSecondary }]}>
              {t('habits.description')}
            </Text>
            <Text style={[styles.descText, { color: theme.text }]}>{habit.description}</Text>
          </View>
        ) : null}

        <View style={{ height: 40 }} />
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
    paddingVertical: 12,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  yearNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 12,
  },
  yearText: {
    fontSize: 18,
    fontWeight: '900',
  },
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  monthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  monthLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  statRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  chartContainer: {
    marginBottom: 0,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    fontSize: 16,
  },
  descLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  descText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
