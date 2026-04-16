import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/ThemeContext';
import { HABIT_COLORS } from '../../constants/habits';

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

interface Props {
  label: string;
  rate: number;
  weeklyDays: boolean[];
  color: string;
}

export function WeeklyRateCard({ label, rate, weeklyDays, color }: Props) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const colors = HABIT_COLORS[color] ?? HABIT_COLORS.purple;
  const today = new Date().getDay(); // 0=Sun

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <Text style={[styles.value, { color: theme.text }]}>{rate}%</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
      <View style={styles.weekRow}>
        {DAY_KEYS.map((key, i) => {
          const isFuture = i > today;
          const isCompleted = weeklyDays[i];
          return (
            <View key={i} style={styles.dayCol}>
              <Text style={[styles.dayLabel, { color: theme.textTertiary }]}>{t(`days.${key}`)}</Text>
              <View
                style={[
                  styles.dayDot,
                  {
                    backgroundColor: isFuture
                      ? theme.surfaceVariant
                      : isCompleted
                      ? colors.base
                      : theme.surfaceVariant,
                    borderColor: isFuture
                      ? 'transparent'
                      : isCompleted
                      ? colors.base
                      : theme.border,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  value: {
    fontSize: 28,
    fontWeight: '900',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
    marginBottom: 12,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '700',
  },
  dayDot: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
  },
});
