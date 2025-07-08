import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text, IconButton, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import useWorkoutStore from "../../stores/workoutStore";

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const RestTimer = () => {
  const theme = useTheme();
  const { restTimer, pauseRestTimer, stopRestTimer, updateRestTimer } =
    useWorkoutStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (restTimer.isActive && restTimer.timeRemaining > 0) {
      interval = setInterval(() => {
        updateRestTimer(restTimer.timeRemaining - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [restTimer.isActive, restTimer.timeRemaining]);

  const progressStyle = useAnimatedStyle(() => {
    const progress = restTimer.timeRemaining / restTimer.duration;

    return {
      width: withTiming(`${progress * 100}%`, {
        duration: 1000,
        easing: Easing.linear,
      }),
    };
  });

  if (!restTimer.isActive) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="headlineMedium">
          {formatTime(restTimer.timeRemaining)}
        </Text>
        <View style={styles.controls}>
          <IconButton
            icon={restTimer.isActive ? "pause" : "play"}
            onPress={pauseRestTimer}
          />
          <IconButton icon="stop" onPress={stopRestTimer} />
        </View>
      </View>
      <View
        style={[
          styles.progressBar,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <Animated.View
          style={[
            styles.progress,
            { backgroundColor: theme.colors.primary },
            progressStyle,
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: 16,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
  },
});
