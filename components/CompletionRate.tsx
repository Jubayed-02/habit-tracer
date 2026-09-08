import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useTheme } from "react-native-paper";

interface CompletionRateProps {
  dailyCompleted: number;
  dailyTotal: number;
  weeklyCompleted: number;
  weeklyTotal: number;
  monthlyCompleted: number;
  monthlyTotal: number;
}

export default function CompletionRate({
  dailyCompleted,
  dailyTotal,
  weeklyCompleted,
  weeklyTotal,
  monthlyCompleted,
  monthlyTotal,
}: CompletionRateProps) {
  const theme = useTheme();

  const calculatePercentage = (completed: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };

  const ProgressBar = ({
    completed,
    total,
    label,
  }: {
    completed: number;
    total: number;
    label: string;
  }) => {
    const percentage = calculatePercentage(completed, total);
    
    // Animation value
    const fillAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fillAnimation, {
        toValue: percentage / 100,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, [percentage]);

    return (
      <View style={styles.progressItem}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressLabel, { color: theme.colors.onSurface }]}>
            {label}
          </Text>
          <Text style={[styles.progressPercent, { color: theme.colors.primary }]}>
            {percentage}%
          </Text>
        </View>
        <View style={[styles.progressTrack, { backgroundColor: "#E0E0E0" }]}>
          <Animated.View
            style={{
              height: "100%",
              backgroundColor: theme.colors.primary,
              borderRadius: 4,
              flex: fillAnimation,
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ProgressBar
        completed={dailyCompleted}
        total={dailyTotal}
        label="Daily"
      />
      <ProgressBar
        completed={weeklyCompleted}
        total={weeklyTotal}
        label="Weekly"
      />
      <ProgressBar
        completed={monthlyCompleted}
        total={monthlyTotal}
        label="Monthly"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "bold",
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
  },
});