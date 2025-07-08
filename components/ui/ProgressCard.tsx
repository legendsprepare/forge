import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, ProgressBar } from "react-native-paper";
import { CustomCard } from "./CustomCard";
import { spacing, typography } from "../../lib/theme";

interface ProgressCardProps {
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  progress: number;
  icon?: string;
  onPress?: () => void;
}

export function ProgressCard({
  title,
  currentValue,
  targetValue,
  unit,
  progress,
  onPress,
}: ProgressCardProps) {
  return (
    <CustomCard onPress={onPress} style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        {title}
      </Text>

      <View style={styles.metrics}>
        <Text style={styles.currentValue}>{currentValue}</Text>
        <Text style={styles.unit}>{unit}</Text>
        <Text style={styles.targetValue}>/ {targetValue}</Text>
      </View>

      <View style={styles.progressContainer}>
        <ProgressBar
          progress={progress}
          color="#6B46C1"
          style={styles.progressBar}
        />
        <Text style={styles.percentage}>{Math.round(progress * 100)}%</Text>
      </View>
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  metrics: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: spacing.md,
  },
  currentValue: {
    ...typography.metrics,
    color: "#6B46C1",
  },
  unit: {
    ...typography.body2,
    marginHorizontal: spacing.xs,
  },
  targetValue: {
    ...typography.body2,
    opacity: 0.7,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(107, 70, 193, 0.2)",
  },
  percentage: {
    ...typography.caption,
    marginLeft: spacing.sm,
    color: "#6B46C1",
  },
});
