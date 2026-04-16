import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { HABIT_COLORS } from '../../constants/habits';
import { getMonthDays, formatDate } from '../../utils/dates';

interface Props {
  completions: Record<string, boolean>;
  color: string;
  year: number;
  month: number;
  dotSize?: number;
  dotGap?: number;
}

export function HeatmapGrid({ completions, color, year, month, dotSize = 8, dotGap = 3 }: Props) {
  const { theme } = useTheme();
  const days = getMonthDays(year, month);
  const colors = HABIT_COLORS[color] ?? HABIT_COLORS.purple;
  const today = formatDate(new Date());

  return (
    <View style={[styles.grid, { gap: dotGap }]}>
      {days.map((day) => {
        const isCompleted = completions[day];
        const isFuture = day > today;
        return (
          <View
            key={day}
            style={[
              styles.dot,
              {
                width: dotSize,
                height: dotSize,
                borderRadius: dotSize / 4,
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
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dot: {},
});
