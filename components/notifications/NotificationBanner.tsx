import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Text } from "../ui/Text";
import { useTheme } from "../../hooks/useTheme";
import { AppNotification } from "../../types/notifications";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { Canvas, Path, LinearGradient, vec } from "@shopify/react-native-skia";
import { useRouter } from "expo-router";

interface NotificationBannerProps {
  notification: AppNotification;
  onDismiss: () => void;
  autoDismiss?: boolean;
  dismissDuration?: number;
}

const { width } = Dimensions.get("window");

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  notification,
  onDismiss,
  autoDismiss = true,
  dismissDuration = 5000,
}) => {
  const theme = useTheme();
  const router = useRouter();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    showBanner();
    if (autoDismiss) {
      const timer = setTimeout(() => {
        hideBanner();
      }, dismissDuration);
      return () => clearTimeout(timer);
    }
  }, []);

  const showBanner = () => {
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 100,
    });
    opacity.value = withSpring(1);
  };

  const hideBanner = () => {
    translateY.value = withSpring(-100, {
      damping: 15,
      stiffness: 100,
    });
    opacity.value = withTiming(
      0,
      {
        duration: 300,
      },
      () => {
        runOnJS(onDismiss)();
      }
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handlePress = () => {
    switch (notification.type) {
      case "achievement_unlock":
        router.push("/achievements");
        break;
      case "social_interaction":
        router.push(
          `/social/${notification.data.targetType}/${notification.data.targetId}`
        );
        break;
      case "league_update":
        router.push("/leagues");
        break;
      case "streak_warning":
      case "streak_reminder":
        router.push("/workout");
        break;
    }
    hideBanner();
  };

  const LightningEffect = () => (
    <Canvas style={styles.lightning}>
      <Path
        path="M 10,0 l 3,6 l -2,3 l 3,6 l -2,3 l 3,6"
        style="stroke"
        strokeWidth={2}
      >
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, 24)}
          colors={["rgba(255, 255, 0, 0.8)", "rgba(255, 255, 0, 0)"]}
        />
      </Path>
    </Canvas>
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.banner,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={handlePress}
      >
        <LightningEffect />
        <View style={styles.content}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.body}>{notification.body}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 44,
  },
  banner: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lightning: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    opacity: 0.8,
  },
});
