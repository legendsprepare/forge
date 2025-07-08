import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { STREAK_THRESHOLDS } from "../../types/gamification";

interface StreakFlameProps {
  count: number;
  multiplier: number;
  shieldCount: number;
  onPress?: () => void;
}

export const StreakFlame = ({
  count,
  multiplier,
  shieldCount,
  onPress,
}: StreakFlameProps) => {
  const theme = useTheme();

  const getFlameColor = () => {
    if (count >= STREAK_THRESHOLDS.FLAME_4) return "#FF00FF"; // Rainbow
    if (count >= STREAK_THRESHOLDS.FLAME_3) return "#9C27B0"; // Purple
    if (count >= STREAK_THRESHOLDS.FLAME_2) return "#2196F3"; // Blue
    if (count >= STREAK_THRESHOLDS.FLAME_1) return "#FF9800"; // Orange
    return theme.colors.primary;
  };

  const flameStyle = useAnimatedStyle(() => {
    if (count === 0) return {};

    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withTiming(1.1, {
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
              }),
              withTiming(1, {
                duration: 1000,
                easing: Easing.inOut(Easing.ease),
              })
            ),
            -1,
            true
          ),
        },
      ],
    };
  });

  const multiplierStyle = useAnimatedStyle(() => {
    if (multiplier === 1) return {};

    return {
      transform: [
        {
          scale: withSpring(1, { damping: 10 }),
        },
      ],
      opacity: withTiming(1, { duration: 300 }),
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.flameContainer, flameStyle]}>
          <MaterialCommunityIcons
            name="fire"
            size={32}
            color={getFlameColor()}
          />
          <Text variant="titleLarge" style={{ color: getFlameColor() }}>
            {count}
          </Text>
        </Animated.View>

        {multiplier > 1 && (
          <Animated.View style={[styles.multiplier, multiplierStyle]}>
            <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
              {multiplier}x
            </Text>
          </Animated.View>
        )}
      </View>

      {shieldCount > 0 && (
        <View style={styles.shields}>
          {Array.from({ length: shieldCount }).map((_, i) => (
            <MaterialCommunityIcons
              key={i}
              name="shield"
              size={16}
              color={theme.colors.primary}
              style={styles.shield}
            />
          ))}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  multiplier: {
    backgroundColor: "#6B46C120",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shields: {
    flexDirection: "row",
    marginTop: 4,
    gap: 2,
  },
  shield: {
    opacity: 0.8,
  },
});
