import { Habit } from "../context/HabitsContext";

export function calculateStreaks(habits: Habit[]) {
  const longestStreak =
    habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  const activeStreaks = habits.filter((h) => h.streak > 0).length;

  const totalStreaks = habits.reduce((sum, h) => sum + h.streak, 0);

  return { longestStreak, activeStreaks, totalStreaks };
}
