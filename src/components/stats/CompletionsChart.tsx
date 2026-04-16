import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../contexts/ThemeContext';
import { HABIT_COLORS } from '../../constants/habits';

interface Props {
  data: Record<string, number>; // "YYYY-MM" -> count
  color: string;
  year: number;
}

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CompletionsChart({ data, color, year }: Props) {
  const { theme } = useTheme();
  const colors = HABIT_COLORS[color] ?? HABIT_COLORS.purple;
  const screenWidth = Math.min(Dimensions.get('window').width - 64, 536);

  const chartData = monthLabels.map((_, i) => {
    const key = `${year}-${String(i + 1).padStart(2, '0')}`;
    return data[key] ?? 0;
  });

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Completions / Month</Text>
      </View>
      <LineChart
        data={{
          labels: monthLabels.map((m) => m.substring(0, 3)),
          datasets: [{ data: chartData.length > 0 ? chartData : [0] }],
        }}
        width={screenWidth}
        height={180}
        withDots={false}
        withShadow={false}
        withInnerLines={false}
        withOuterLines={false}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: theme.card,
          backgroundGradientTo: theme.card,
          decimalPlaces: 0,
          color: () => colors.base,
          labelColor: () => theme.textSecondary,
          propsForLabels: { fontSize: 11, fontWeight: '700', fontFamily: 'System' },
          fillShadowGradientFrom: colors.base,
          fillShadowGradientTo: colors.light,
          fillShadowGradientFromOpacity: 0.3,
          fillShadowGradientToOpacity: 0,
        }}
        bezier
        style={{ borderRadius: 12, paddingRight: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});
