import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
import * as api from '../../src/services/api';

export default function StatsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const habits = useHabitStore((s) => s.habits);
  const [selectedHabitIndex, setSelectedHabitIndex] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());
  const [habitCompletions, setHabitCompletions] = useState<Record<string, boolean>>({});

  const selectedHabit = habits[selectedHabitIndex];

  useEffect(() => {
    if (selectedHabit && user) {
      api.fetchCompletionsForHabit(selectedHabit.id, user.id).then((completions) => {
        const map: Record<string, boolean> = {};
        completions.forEach((c) => { map[c.date] = c.completed; });
        setHabitCompletions(map);
      });
    }
  }, [selectedHabit, user]);

  const stats = selectedHabit
    ? calculateStats(habitCompletions, selectedHabit.created_at)
    : { totalCompleted: 0, completionRate: 0, weeklyDays: Array(7).fill(false), currentStreak: 0, bestStreak: 0, completionsByMonth: {} };

  if (!selectedHabit) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {t('habits.noHabits')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.innerContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Habit Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.habitSelector}
          contentContainerStyle={styles.habitSelectorContent}
        >
          <Pressable style={[styles.doneButton, { backgroundColor: theme.primary }]} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#FFFFFF" />
          </Pressable>
          {habits.map((habit, index) => (
            <Pressable
              key={habit.id}
              style={[
                styles.habitChip,
                {
                  backgroundColor:
                    index === selectedHabitIndex ? theme.primaryLight : theme.surfaceVariant,
                  borderColor: index === selectedHabitIndex ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setSelectedHabitIndex(index)}
            >
              <MaterialCommunityIcons
                name={(habit.icon as any) || 'pulse'}
                size={18}
                color={index === selectedHabitIndex ? theme.primary : theme.textSecondary}
              />
            </Pressable>
          ))}
        </ScrollView>

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
          <YearHeatmap
            completions={habitCompletions}
            color={selectedHabit.color}
            year={year}
          />
        </View>

        {/* Stat Cards */}
        <View style={styles.statRow}>
          <StatCard
            label={t('stats.completedDays')}
            value={stats.totalCompleted}
            icon="#"
            color={selectedHabit.color}
          />
          <View style={{ width: 12 }} />
          <WeeklyRateCard
            label={t('stats.completionRate')}
            rate={stats.completionRate}
            weeklyDays={stats.weeklyDays}
            color={selectedHabit.color}
          />
        </View>

        {/* Completions Chart */}
        <View style={{ paddingHorizontal: 16 }}>
          <CompletionsChart
            data={stats.completionsByMonth}
            color={selectedHabit.color}
            year={year}
          />
        </View>

        {/* Streak Cards */}
        <View style={styles.statRow}>
          <StatCard
            label={t('stats.currentStreak')}
            value={stats.currentStreak}
            icon="🔥"
            color={selectedHabit.color}
          />
          <View style={{ width: 12 }} />
          <StatCard
            label={t('stats.bestStreak')}
            value={stats.bestStreak}
            icon="🔥"
            color={selectedHabit.color}
          />
        </View>

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
  habitSelector: {
    paddingVertical: 12,
  },
  habitSelectorContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  habitChip: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
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
    marginHorizontal: 16,
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
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
