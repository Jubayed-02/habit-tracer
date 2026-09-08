import React, { createContext, ReactNode, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type HabitCategory = "Health" | "Study" | "Fitness" | "Personal" | "Work";

export interface Habit {
  id: string;
  name: string;
  time: string;
  streak: number;
  completed: boolean;
  lastUpdated: string;
  enableNotifications: boolean;
  notificationId?: string;
  category: HabitCategory;
  note?: string;
  completionHistory: string[];
}

export interface StreakRecord {
  id: string;
  habitName: string;
  streakCount: number;
  dateBroken: string;
}

interface HabitsContextType {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  streakHistory: StreakRecord[];
  setStreakHistory: React.Dispatch<React.SetStateAction<StreakRecord[]>>;
  isLoading: boolean;
}

export const HabitsContext = createContext<HabitsContextType>({
  habits: [],
  setHabits: () => {},
  streakHistory: [],
  setStreakHistory: () => {},
  isLoading: true,
});

interface HabitsProviderProps {
  children: ReactNode;
}

export function HabitsProvider({ children }: HabitsProviderProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [streakHistory, setStreakHistory] = useState<StreakRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      saveHabits();
    }
  }, [habits, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      saveStreakHistory();
    }
  }, [streakHistory, isLoading]);

  const loadData = async () => {
    try {
      const savedHabits = await AsyncStorage.getItem("habits");
      const savedStreakHistory = await AsyncStorage.getItem("streakHistory");

      if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        const fixedHabits = parsedHabits.map((habit: Habit) => ({
          ...habit,
          category: habit.category || "Personal",
          note: habit.note || "",
          completionHistory: habit.completionHistory || [],
        }));
        setHabits(fixedHabits);
      }
      if (savedStreakHistory) {
        setStreakHistory(JSON.parse(savedStreakHistory));
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveHabits = async () => {
    try {
      await AsyncStorage.setItem("habits", JSON.stringify(habits));
    } catch (error) {
      console.error("Error saving habits:", error);
    }
  };

  const saveStreakHistory = async () => {
    try {
      await AsyncStorage.setItem("streakHistory", JSON.stringify(streakHistory));
    } catch (error) {
      console.error("Error saving streak history:", error);
    }
  };

  return (
    <HabitsContext.Provider
      value={{ habits, setHabits, streakHistory, setStreakHistory, isLoading }}
    >
      {children}
    </HabitsContext.Provider>
  );
}