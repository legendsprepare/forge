import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Portal, Modal, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSequence,
  withSpring,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { Achievement } from "../../types/gamification";

interface AchievementModalProps {
  visible: boolean;
  achievement: Achievement;
  onDismiss: () => void;
}

export const AchievementModal = ({
  visible,
  achievement,
  onDismiss,
}: AchievementModalProps) => {
  const theme = useTheme();

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSequence(
          withSpring(1.2, { damping: 10 }),
          withDelay(
            500,
            withTiming(1, {
              duration: 300,
              easing: Easing.inOut(Easing.ease),
            })
          )
        ),
      },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: withDelay(
      300,
      withTiming(1, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      })
    ),
    transform: [
      {
        translateY: withDelay(
          300,
          withSpring(0, {
            damping: 15,
            stiffness: 100,
          })
        ),
      },
    ],
  }));

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case "legendary":
        return "#FFD700"; // Gold
      case "epic":
        return "#9C27B0"; // Purple
      case "rare":
        return "#2196F3"; // Blue
      default:
        return "#78909C"; // Gray
    }
  };

  useEffect(() => {
    if (visible) {
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [visible, onDismiss]);

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.content}>
          <LottieView
            source={require("../../assets/animations/achievement.json")}
            autoPlay
            loop={false}
            style={styles.confetti}
          />

          <Animated.View style={[styles.iconContainer, iconStyle]}>
            <MaterialCommunityIcons
              name={achievement.icon_name}
              size={64}
              color={getRarityColor()}
            />
          </Animated.View>

          <Animated.View style={[styles.textContainer, textStyle]}>
            <Text
              variant="headlineSmall"
              style={[styles.title, { color: getRarityColor() }]}
            >
              Achievement Unlocked!
            </Text>
            <Text variant="titleLarge" style={styles.name}>
              {achievement.name}
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {achievement.description}
            </Text>
            <View style={styles.reward}>
              <MaterialCommunityIcons
                name="star"
                size={24}
                color={theme.colors.primary}
              />
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.primary }}
              >
                +{achievement.xp_reward} XP
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  confetti: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#6B46C120",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
  title: {
    marginBottom: 8,
  },
  name: {
    textAlign: "center",
    marginBottom: 4,
  },
  description: {
    textAlign: "center",
    marginBottom: 16,
    opacity: 0.8,
  },
  reward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6B46C120",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
