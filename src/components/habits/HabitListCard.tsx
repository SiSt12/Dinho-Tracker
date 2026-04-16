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

export function HabitListCard({ habit, onPress, onCheckToday }: Props) {
  const { theme } = useTheme();
  const now = new Date();
  const colors = HABIT_COLORS[habit.color] ?? HABIT_COLORS.purple;

  return (
    <Pressable
      style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: colors.light }]}>
          <MaterialCommunityIcons
            name={(habit.icon as any) || 'pulse'}
            size={22}
            color={colors.base}
          />
        </View>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {habit.name}
        </Text>
        <Pressable
          style={[styles.checkbox, { backgroundColor: colors.light, borderColor: colors.base }]}
          onPress={onCheckToday}
        >
          <MaterialCommunityIcons name="check" size={18} color={colors.base} />
        </Pressable>
      </View>
      <HeatmapGrid
        completions={habit.completions}
        color={habit.color}
        year={now.getFullYear()}
        month={now.getMonth()}
        dotSize={9}
        dotGap={3}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
