import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { HeatmapGrid } from './HeatmapGrid';
import { HabitWithCompletions } from '../../types';
import { HABIT_COLORS } from '../../constants/habits';

interface Props {
  habit: HabitWithCompletions;
  onPress: () => void;
  onCheckToday: () => void;
}

export function HabitGridCard({ habit, onPress, onCheckToday }: Props) {
  const { theme } = useTheme();
  const now = new Date();
  const colors = HABIT_COLORS[habit.color] ?? HABIT_COLORS.purple;

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <Pressable
          style={[styles.checkbox, { backgroundColor: colors.light, borderColor: colors.base }]}
          onPress={onCheckToday}
        >
          <MaterialCommunityIcons name="check" size={14} color={colors.base} />
        </Pressable>
        <View style={styles.titleContainer}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {habit.name}
          </Text>
          <Text style={[styles.month, { color: theme.textSecondary }]}>
            {now.toLocaleString('default', { month: 'short' })} {now.getFullYear()}
          </Text>
        </View>
      </View>
      <HeatmapGrid
        completions={habit.completions}
        color={habit.color}
        year={now.getFullYear()}
        month={now.getMonth()}
        dotSize={7}
        dotGap={2}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    width: '48%',
    marginBottom: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
  },
  month: {
    fontSize: 10,
  },
});
