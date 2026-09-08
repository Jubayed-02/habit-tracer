import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "react-native-paper";

interface DonutChartProps {
  completed: number;
  total: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export default function DonutChart({
  completed,
  total,
  label,
  size = 120,
  strokeWidth = 15,
}: DonutChartProps) {
  const theme = useTheme();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? completed / total : 0;
  const strokeDashoffset = circumference * (1 - percentage);
  
  const center = size / 2;
  
  return (
    <View style={styles.container}>
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
        
        {/* Progress circle */}
        <G rotation="-90" origin={`${center}, ${center}`}>
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#4CAF50"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      
      {/* Center text */}
      <View style={[styles.centerText, { width: size, height: size }]}>
        <Text style={[styles.percentage, { color: theme.colors.primary }]}>
          {Math.round(percentage * 100)}%
        </Text>
        <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  percentage: {
    fontSize: 24,
    fontWeight: "bold",
  },
  label: {
    fontSize: 11,
    marginTop: 4,
  },
});