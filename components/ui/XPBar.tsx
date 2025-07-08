import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface XPBarProps {
  currentXP: number;
  level: number;
  requiredXP: number;
  showAnimation?: boolean;
}

export const XPBar = ({
  currentXP,
  level,
  requiredXP,
  showAnimation = false,
}: XPBarProps) => {
  const theme = useTheme();
  const progress = Math.min(currentXP / requiredXP, 1);

  const progressStyle = useAnimatedStyle(() => {
    const width = `${progress * 100}%`;

    if (showAnimation) {
      return {
        width: withSequence(
          withSpring(width, { damping: 15 }),
          withTiming(width, { duration: 300 })
        ),
      };
    }

    return { width };
  });

  const levelStyle = useAnimatedStyle(() => {
    if (showAnimation) {
      return {
        transform: [
          {
            scale: withSequence(
              withSpring(1.2, { damping: 10 }),
              withTiming(1, { duration: 300 })
            ),
          },
        ],
      };
    }
    return {};
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.levelContainer}>
          <Animated.View style={levelStyle}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={24}
              color={theme.colors.primary}
            />
          </Animated.View>
          <Text variant="titleLarge" style={{ color: theme.colors.primary }}>
            Level {level}
          </Text>
        </View>
        <Text variant="bodyMedium">
          {currentXP} / {requiredXP} XP
        </Text>
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
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
  },
});
