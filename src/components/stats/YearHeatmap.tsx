import React from 'react';
import { View, StyleSheet } from 'react-native';
import { HABIT_COLORS } from '../../constants/habits';
import { useTheme } from '../../contexts/ThemeContext';
import { getYearDays, formatDate } from '../../utils/dates';

interface Props {
  completions: Record<string, boolean>;
  color: string;
  year: number;
}

export function YearHeatmap({ completions, color, year }: Props) {
  const { theme } = useTheme();
  const days = getYearDays(year);
  const colors = HABIT_COLORS[color] ?? HABIT_COLORS.purple;
  const today = formatDate(new Date());

  // Build 53 columns (weeks) x 7 rows layout
  const firstDay = new Date(year, 0, 1).getDay(); // 0=Sun
  const weeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = Array(firstDay).fill(null);

  for (const day of days) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {weeks.map((week, wi) => (
          <View key={wi} style={styles.column}>
            {week.map((day, di) => {
              if (!day) {
                return <View key={`pad-${wi}-${di}`} style={styles.dot} />;
              }
              const isCompleted = completions[day];
              const isFuture = day > today;
              return (
                <View
                  key={day}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isFuture
                        ? 'transparent'
                        : isCompleted
                        ? colors.base
                        : colors.light,
                    },
                  ]}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  grid: {
    flexDirection: 'row',
    gap: 2,
  },
  column: {
    flexDirection: 'column',
    gap: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
});
