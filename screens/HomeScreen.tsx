import React, { useContext, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AnimatedFAB, useTheme } from "react-native-paper";
import AddHabitModal from "../components/AddHabitModal";
import EditHabitModal from "../components/EditHabitModal";
import EmptyState from "../components/EmptyState";
import HabitCard from "../components/HabitCard";
import { Habit, HabitsContext, HabitCategory } from "../context/HabitsContext";
import {
  requestPermissionsAsync,
  scheduleHabitReminder,
  scheduleLastChanceReminder,
  cancelHabitReminder,
} from "../utils/notifications";

function AutoShrinkFAB({ label, ...props }: any) {
  const [showLabel, setShowLabel] = React.useState(true);

  React.useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout>;
    let showTimer: ReturnType<typeof setTimeout>;

    const startCycle = () => {
      hideTimer = setTimeout(() => {
        setShowLabel(false);
        showTimer = setTimeout(() => {
          setShowLabel(true);
          startCycle();
        }, 30000);
      }, 5000);
    };

    startCycle();

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
  }, []);

  return (
    <AnimatedFAB
      {...props}
      extended={showLabel}
      label={showLabel ? label : ""}
      icon="plus"
      iconMode="static"
    />
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const { habits, setHabits, streakHistory, setStreakHistory } =
    useContext(HabitsContext);
  const [isExtended, setIsExtended] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  React.useEffect(() => {
    requestPermissionsAsync();
  }, []);

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentScrollPosition <= 0);
  };

  const addHabit = async ({
    name,
    time,
    enableNotifications,
    category,
    note,
  }: {
    name: string;
    time: string;
    enableNotifications: boolean;
    category: HabitCategory;
    note: string;
  }) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      time,
      streak: 0,
      completed: false,
      lastUpdated: "",
      enableNotifications,
      category,
      note,
      completionHistory: [],
    };

    if (enableNotifications) {
      const notificationId = await scheduleHabitReminder(name, time, newHabit.id);
      newHabit.notificationId = notificationId;
      await scheduleLastChanceReminder(name, newHabit.id);
    }

    setHabits((prev) => [...prev, newHabit]);
  };

  const completeHabit = (habitId: string) => {
    const today = new Date();
    const todayString = today.toDateString();

    setHabits((prevHabits: Habit[]) => {
      return prevHabits.map((habit: Habit) => {
        if (habit.id === habitId) {
          if (habit.lastUpdated === todayString) {
            return habit;
          }

          let newStreak = 1;

          if (habit.lastUpdated) {
            const lastDate = new Date(habit.lastUpdated);
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastDate.toDateString() === yesterday.toDateString()) {
              newStreak = habit.streak + 1;
            }
          }

          const completionHistory = habit.completionHistory || [];
          if (!completionHistory.includes(todayString)) {
            completionHistory.push(todayString);
          }

          return {
            ...habit,
            completed: true,
            streak: newStreak,
            lastUpdated: todayString,
            completionHistory,
          };
        }
        return habit;
      });
    });
  };

  const undoComplete = (habitId: string) => {
    const today = new Date();
    const todayString = today.toDateString();

    setHabits((prevHabits: Habit[]) => {
      return prevHabits.map((habit: Habit) => {
        if (habit.id === habitId) {
          const lastDate = new Date(habit.lastUpdated);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          let newStreak = habit.streak - 1;
          if (newStreak < 0) newStreak = 0;

          let newLastUpdated = "";
          if (lastDate.toDateString() === yesterday.toDateString()) {
            newLastUpdated = lastDate.toDateString();
          }

          const completionHistory = (habit.completionHistory || []).filter(
            (date) => date !== todayString
          );

          return {
            ...habit,
            completed: false,
            streak: newStreak,
            lastUpdated: newLastUpdated,
            completionHistory,
          };
        }
        return habit;
      });
    });
  };

  const handleLongPress = (habit: Habit) => {
    setSelectedHabit(habit);
    setEditModalVisible(true);
  };

  const handleSaveEdit = (updatedHabit: Habit) => {
    setHabits((prevHabits: Habit[]) => {
      return prevHabits.map((habit: Habit) => {
        if (habit.id === updatedHabit.id) {
          return updatedHabit;
        }
        return habit;
      });
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    const habitToDelete = habits.find((h) => h.id === habitId);

    if (habitToDelete?.notificationId) {
      cancelHabitReminder(habitToDelete.notificationId);
    }

    setHabits((prevHabits: Habit[]) => {
      return prevHabits.filter((habit: Habit) => habit.id !== habitId);
    });
  };

  // Check for missed habits at midnight
  React.useEffect(() => {
    const checkAndReset = () => {
      const todayString = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();

      setHabits((prevHabits: Habit[]) => {
        return prevHabits.map((habit: Habit) => {
          if (habit.lastUpdated !== todayString) {
            return { ...habit, completed: false };
          }
          return habit;
        });
      });

      setHabits((prevHabits: Habit[]) => {
        const brokenHabits = prevHabits.filter((habit: Habit) => {
          return habit.streak > 0 && habit.lastUpdated === yesterdayString;
        });

        if (brokenHabits.length > 0) {
          const newStreakRecords = brokenHabits.map((habit: Habit) => ({
            id: `${habit.id}-${todayString}`,
            habitName: habit.name,
            streakCount: habit.streak,
            dateBroken: todayString,
          }));

          setStreakHistory((prev) => [...prev, ...newStreakRecords]);

          return prevHabits.map((habit: Habit) => {
            if (habit.lastUpdated === yesterdayString) {
              return { ...habit, streak: 0 };
            }
            return habit;
          });
        }

        return prevHabits;
      });
    };

    checkAndReset();
    const interval = setInterval(checkAndReset, 60000);
    return () => clearInterval(interval);
  }, [setHabits, setStreakHistory]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        style={styles.scrollView}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.contentContainer}>
          {habits.length === 0 ? (
            <EmptyState />
          ) : (
            habits.map((habit: Habit, index: number) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onComplete={completeHabit}
                onUndo={undoComplete}
                onLongPress={handleLongPress}
                index={index}
              />
            ))
          )}
        </View>
      </ScrollView>

      <AddHabitModal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        onAdd={addHabit}
      />

      <EditHabitModal
        visible={editModalVisible}
        habit={selectedHabit}
        onDismiss={() => setEditModalVisible(false)}
        onSave={handleSaveEdit}
        onDelete={handleDeleteHabit}
      />

      <AutoShrinkFAB
        label="Add habit    "
        onPress={() => setModalVisible(true)}
        visible={true}
        animateFrom={"right"}
        style={styles.fab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    bottom: 16,
    right: 16,
    position: "absolute",
  },
});