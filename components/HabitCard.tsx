import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Pressable, Animated } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { Habit } from "../context/HabitsContext";

interface HabitCardProps {
  habit: Habit;
  onComplete: (id: string) => void;
  onUndo: (id: string) => void;
  onLongPress: (habit: Habit) => void;
  index?: number;
}

const DAY_LETTERS = ["F", "S", "S", "M", "T", "W", "T"];

export default function HabitCard({
  habit,
  onComplete,
  onUndo,
  onLongPress,
  index = 0,
}: HabitCardProps) {
  const theme = useTheme();
  const [showUndo, setShowUndo] = React.useState(false);
  
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  useEffect(() => {
    if (showUndo) {
      const timer = setTimeout(() => {
        setShowUndo(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showUndo]);

  const handleComplete = () => {
    if (!habit.completed) {
      onComplete(habit.id);
      setShowUndo(true);
    }
  };

  const handleUndo = () => {
    onUndo(habit.id);
    setShowUndo(false);
  };

  const getLast7Days = () => {
    const days: Date[] = [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    let fridayOffset;
    if (dayOfWeek >= 5) {
      fridayOffset = dayOfWeek - 5;
    } else {
      fridayOffset = dayOfWeek + 2;
    }
    
    const friday = new Date(today);
    friday.setDate(today.getDate() - fridayOffset);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(friday);
      day.setDate(friday.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const last7Days = getLast7Days();
  const completionHistory = habit.completionHistory || [];

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
    >
      <Pressable onLongPress={() => onLongPress(habit)} delayLongPress={500}>
        <Card style={styles.card}>
          <Card.Content>
            {/* Name + Category */}
            <View style={styles.header}>
              <Text variant="titleMedium" style={styles.name}>
                {habit.name}
              </Text>
              <Text
                style={[
                  styles.categoryText,
                  { color: theme.colors.primary },
                ]}
              >
                {habit.category}
              </Text>
            </View>

            {/* Time + Weekly circles */}
            <View style={styles.timeRow}>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                ⏰ {habit.time}
              </Text>

              {/* Weekly circles */}
              <View style={styles.weeklyContainer}>
                {last7Days.map((day, index) => {
                  const dateString = day.toDateString();
                  const today = new Date();
                  const todayString = today.toDateString();
                  const isToday = dateString === todayString;
                  const isFuture = day > today;
                  const isCompleted = completionHistory.includes(dateString);
                  
                  let circleStyle: any = { backgroundColor: theme.colors.primary };
                  let textStyle: any = { color: "white" };
                  
                  if (isCompleted) {
                    circleStyle = { backgroundColor: "#4CAF50" };
                    textStyle = { color: "white" };
                  } else if (isToday) {
                    circleStyle = { borderWidth: 1.5, borderColor: theme.colors.primary, backgroundColor: "transparent" };
                    textStyle = { color: theme.colors.primary };
                  } else if (isFuture) {
                    circleStyle = { backgroundColor: theme.colors.primary };
                    textStyle = { color: "white" };
                  } else {
                    circleStyle = { backgroundColor: "#E0E0E0" };
                    textStyle = { color: "#999" };
                  }
                  
                  return (
                    <View key={index} style={styles.dayColumn}>
                      <View style={[styles.dayCircle, circleStyle]}>
                        <Text style={[styles.dayLetter, textStyle]}>
                          {DAY_LETTERS[index]}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Note */}
            {habit.note ? (
              <Text
                variant="bodySmall"
                style={[styles.note, { color: theme.colors.onSurfaceVariant }]}
              >
                📝 {habit.note}
              </Text>
            ) : null}

            {/* Last updated */}
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              Last: {habit.lastUpdated || "Not completed yet"}
            </Text>

            {/* Streak + Complete button */}
            <View style={styles.actions}>
              <View
                style={[
                  styles.streakBadge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text style={styles.streakNumber}>{habit.streak}</Text>
                <Text style={styles.streakLabel}>day streak</Text>
              </View>

              {showUndo && habit.completed ? (
                <Button
                  mode="text"
                  onPress={handleUndo}
                  style={styles.undoButton}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  Undo
                </Button>
              ) : (
                <Button
                  mode={habit.completed ? "outlined" : "contained"}
                  onPress={handleComplete}
                  disabled={false}
                  style={styles.button}
                  icon={habit.completed ? "check" : ""}
                >
                  {habit.completed ? "Done" : "Complete"}
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  weeklyContainer: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  dayColumn: {
    alignItems: "center",
  },
  dayCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  dayLetter: {
    fontSize: 8,
    fontWeight: "bold",
  },
  note: {
    marginTop: 4,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  streakBadge: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  streakLabel: {
    fontSize: 10,
    color: "white",
    opacity: 0.9,
  },
  button: {
    borderRadius: 8,
  },
  undoButton: {
    borderRadius: 8,
  },
});