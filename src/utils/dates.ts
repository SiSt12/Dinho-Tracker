import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  parseISO,
} from 'date-fns';
import { HabitStats } from '../types';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getMonthDays(year: number, month: number): string[] {
  const start = startOfMonth(new Date(year, month));
  const end = endOfMonth(new Date(year, month));
  return eachDayOfInterval({ start, end }).map((d) => formatDate(d));
}

export function getYearDays(year: number): string[] {
  const start = startOfYear(new Date(year, 0));
  const end = endOfYear(new Date(year, 0));
  return eachDayOfInterval({ start, end }).map((d) => formatDate(d));
}

export function getLast5Days(): string[] {
  const today = new Date();
  return Array.from({ length: 5 }, (_, i) => formatDate(subDays(today, 4 - i)));
}

export function getDayNumber(dateStr: string): number {
  return parseISO(dateStr).getDate();
}

export function calculateStats(
  completions: Record<string, boolean>,
  createdAt: string
): HabitStats {
  const completedDates = Object.keys(completions).filter((d) => completions[d]);
  const totalCompleted = completedDates.length;

  // Calculate weekly completion rate (full week Sun-Sat)
  const today = new Date();
  const todayDay = today.getDay(); // 0=Sun
  const weeklyDays: boolean[] = Array(7).fill(false);
  let weeklyCompleted = 0;
  for (let i = 0; i < 7; i++) {
    const d = formatDate(subDays(today, todayDay - i));
    if (completions[d]) {
      weeklyCompleted++;
      weeklyDays[i] = true;
    }
  }
  const completionRate = Math.min(100, Math.round((weeklyCompleted / 7) * 100));

  // Calculate streaks
  let currentStreak = 0;
  let bestStreak = 0;
  let tempStreak = 0;

  const sortedDates = completedDates
    .map((d) => parseISO(d))
    .sort((a, b) => a.getTime() - b.getTime());

  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const diff = Math.round(
        (sortedDates[i].getTime() - sortedDates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
      );
      tempStreak = diff === 1 ? tempStreak + 1 : 1;
    }
    bestStreak = Math.max(bestStreak, tempStreak);
  }

  // Current streak: count back from today
  const todayStr = formatDate(today);
  let checkDate = today;
  while (completions[formatDate(checkDate)]) {
    currentStreak++;
    checkDate = subDays(checkDate, 1);
  }

  // Completions by month
  const completionsByMonth: Record<string, number> = {};
  completedDates.forEach((d) => {
    const monthKey = d.substring(0, 7); // YYYY-MM
    completionsByMonth[monthKey] = (completionsByMonth[monthKey] ?? 0) + 1;
  });

  return { totalCompleted, completionRate, weeklyDays, currentStreak, bestStreak, completionsByMonth };
}
