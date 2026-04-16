import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { HabitWithCompletions } from '../../types';
import { HABIT_COLORS } from '../../constants/habits';
import { getLast5Days, getDayNumber, formatDate } from '../../utils/dates';
import { useTranslation } from 'react-i18next';

function AnimatedDaySquare({
  isCompleted,
  colors,
  surfaceVariant,
  onPress,
}: {
  isCompleted: boolean;
  colors: { base: string; light: string };
  surfaceVariant: string;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.7, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 200, useNativeDriver: true }),
    ]).start();
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.View
        style={[
          styles.daySquare,
          {
            backgroundColor: isCompleted ? colors.base : surfaceVariant,
            borderColor: isCompleted ? colors.base : 'transparent',
            transform: [{ scale }],
          },
        ]}
      />
    </Pressable>
  );
}

interface Props {
  habit: HabitWithCompletions;
  onPress: () => void;
  onToggleDay: (date: string) => void;
}

export function HabitWeeklyRow({ habit, onPress, onToggleDay }: Props) {
  const { theme } = useTheme();
  const days = getLast5Days();
  const colors = HABIT_COLORS[habit.color] ?? HABIT_COLORS.purple;

  return (
    <View
      style={[styles.row, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
    >
      <Pressable style={styles.leftSection} onPress={onPress}>
        <View style={[styles.iconCircle, { backgroundColor: colors.light }]}>
          <MaterialCommunityIcons
            name={(habit.icon as any) || 'pulse'}
            size={18}
            color={colors.base}
          />
        </View>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {habit.name}
        </Text>
      </Pressable>
      <View style={styles.daysContainer}>
        {days.map((day) => {
          const isCompleted = habit.completions[day];
          return (
            <AnimatedDaySquare
              key={day}
              isCompleted={!!isCompleted}
              colors={colors}
              surfaceVariant={theme.surfaceVariant}
              onPress={() => onToggleDay(day)}
            />
          );
        })}
      </View>
    </View>
  );
}

interface WeeklyHeaderProps {
  label: string;
}

export function WeeklyHeader({ label }: WeeklyHeaderProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const days = getLast5Days();
  const today = formatDate(new Date());
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLabel}>
        <Text style={[styles.headerLabelText, { color: theme.textSecondary }]}>{label}</Text>
      </View>
      <View style={styles.daysContainer}>
        {days.map((day) => {
          const dayIndex = new Date(day + 'T12:00:00').getDay();
          return (
            <View key={day} style={styles.headerDay}>
              <Text style={[styles.dayAbbr, { color: theme.textSecondary }]}>
                {t(`days.${dayKeys[dayIndex]}`)}
              </Text>
              <Text
                style={[
                  styles.dayNum,
                  {
                    color: day === today ? theme.primary : theme.text,
                    fontWeight: day === today ? '700' : '500',
                  },
                ]}
              >
                {getDayNumber(day)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  daysContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  daySquare: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  headerLabel: {
    flex: 1,
  },
  headerLabelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerDay: {
    width: 36,
    alignItems: 'center',
  },
  dayAbbr: {
    fontSize: 11,
    fontWeight: '500',
  },
  dayNum: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
});
