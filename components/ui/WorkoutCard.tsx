import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { CustomCard } from "./CustomCard";
import { spacing, typography } from "../../lib/theme";

interface WorkoutCardProps {
  title: string;
  duration: number;
  caloriesBurned: number;
  exercises: number;
  onPress?: () => void;
}

export function WorkoutCard({
  title,
  duration,
  caloriesBurned,
  exercises,
  onPress,
}: WorkoutCardProps) {
  return (
    <CustomCard onPress={onPress} style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
        <IconButton
          icon="dots-vertical"
          size={20}
          onPress={() => {}}
          style={styles.menuButton}
        />
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.metricValue}>{duration}</Text>
          <Text style={styles.metricLabel}>minutes</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.metricValue}>{caloriesBurned}</Text>
          <Text style={styles.metricLabel}>calories</Text>
        </View>

        <View style={styles.stat}>
          <Text style={styles.metricValue}>{exercises}</Text>
          <Text style={styles.metricLabel}>exercises</Text>
        </View>
      </View>
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  title: {
    flex: 1,
    marginRight: spacing.sm,
  },
  menuButton: {
    margin: -spacing.xs,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.sm,
  },
  stat: {
    alignItems: "center",
  },
  metricValue: {
    ...typography.metrics,
    color: "#6B46C1",
  },
  metricLabel: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
});
