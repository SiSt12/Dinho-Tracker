import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { HABIT_COLORS } from '../../constants/habits';

interface Props {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export function StatCard({ label, value, icon, color }: Props) {
  const { theme } = useTheme();
  const colors = HABIT_COLORS[color] ?? HABIT_COLORS.purple;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={[styles.iconBadge, { backgroundColor: colors.light }]}>
        <Text style={[styles.iconText, { color: colors.base }]}>{icon}</Text>
      </View>
      <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
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
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '700',
  },
  value: {
    fontSize: 28,
    fontWeight: '900',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
});
