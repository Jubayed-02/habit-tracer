import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "react-native-paper";
import { Habit } from "../context/HabitsContext";

interface CategoryDonutChartProps {
  habits: Habit[];
  size?: number;
  strokeWidth?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Health: "#4CAF50",
  Study: "#2196F3",
  Fitness: "#FF9800",
  Personal: "#9C27B0",
  Work: "#F44336",
};

export default function CategoryDonutChart({
  habits,
  size = 140,
  strokeWidth = 20,
}: CategoryDonutChartProps) {
  const theme = useTheme();
  
  // Animation values
  const progress = useRef(new Animated.Value(0)).current;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calculate category counts
  const categories = ["Health", "Study", "Fitness", "Personal", "Work"];
  const categoryCounts = categories.map((cat) => ({
    category: cat,
    count: habits.filter((h) => h.category === cat).length,
  }));
  
  const totalHabits = habits.length;
  
  // Animate on mount
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [totalHabits]);

  // Calculate segments with animation
  let currentAngle = 0;
  const segments = categoryCounts
    .filter((cat) => cat.count > 0)
    .map((cat) => {
      const percentage = cat.count / totalHabits;
      const segment = {
        ...cat,
        percentage,
        startAngle: currentAngle,
        endAngle: currentAngle + percentage * 360,
      };
      currentAngle += percentage * 360;
      return segment;
    });

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#E0E0E0"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Animated category segments */}
          {segments.map((segment, index) => {
            const animatedDashLength = progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, segment.percentage * circumference],
            });
            
            return (
              <G
                key={index}
                rotation={segment.startAngle}
                origin={`${center}, ${center}`}
              >
                <AnimatedCircle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={CATEGORY_COLORS[segment.category]}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={Animated.subtract(
                    circumference,
                    animatedDashLength
                  )}
                  strokeLinecap="butt"
                />
              </G>
            );
          })}
        </Svg>
        
        {/* Animated center text */}
        <Animated.View
          style={[
            styles.centerText,
            { width: size, height: size },
            {
              opacity: progress,
              transform: [
                {
                  scale: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.totalNumber, { color: theme.colors.primary }]}>
            {totalHabits}
          </Text>
          <Text style={[styles.totalLabel, { color: theme.colors.onSurfaceVariant }]}>
            Total Habits
          </Text>
        </Animated.View>
      </View>
      
      {/* Legend */}
      <View style={styles.legendContainer}>
        {categoryCounts.map((cat) => (
          <View key={cat.category} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: CATEGORY_COLORS[cat.category] },
              ]}
            />
            <Text style={[styles.legendText, { color: theme.colors.onSurface }]}>
              {cat.category} - {cat.count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// Animated Circle component
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  chartWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  totalNumber: {
    fontSize: 28,
    fontWeight: "bold",
  },
  totalLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  legendContainer: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
  },
});