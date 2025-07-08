import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { AvatarState, AvatarConfig } from "../../types/avatar";
import { AVATAR_COLORS, GLOW_COLORS, ANIMATION_CONFIG } from "../../lib/avatar";

interface LightningAvatarProps {
  state: AvatarState;
  config: AvatarConfig;
  onAnimationComplete?: () => void;
}

export function LightningAvatar({
  state,
  config,
  onAnimationComplete,
}: LightningAvatarProps) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0.5);
  const intensity = useSharedValue(state.intensity);

  // Idle animation
  useEffect(() => {
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, {
          duration: ANIMATION_CONFIG.idle.duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0.5, {
          duration: ANIMATION_CONFIG.idle.duration / 2,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);

  // Handle state changes
  useEffect(() => {
    if (state.isAnimating && state.currentAnimation) {
      switch (state.currentAnimation) {
        case "power-up":
          scale.value = withSequence(withSpring(1.2), withSpring(1));
          break;
        case "level-up":
          scale.value = withSequence(withSpring(1.5), withSpring(1));
          rotation.value = withSequence(
            withTiming(360, {
              duration: ANIMATION_CONFIG["level-up"].duration,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(0)
          );
          break;
        case "achievement":
          scale.value = withSequence(withSpring(1.2), withSpring(1));
          glowOpacity.value = withSequence(withTiming(1), withTiming(0.5));
          break;
        case "workout":
          intensity.value = withSpring(Math.min(state.intensity + 0.2, 1));
          break;
        case "social":
          scale.value = withSequence(withSpring(1.1), withSpring(1));
          break;
      }
    }
  }, [state.isAnimating, state.currentAnimation]);

  const avatarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View
      style={[styles.container, { width: config.size, height: config.size }]}
    >
      {/* Glow Effect */}
      <Animated.View
        style={[
          styles.glow,
          {
            backgroundColor: GLOW_COLORS[state.color],
            width: config.size * 1.5,
            height: config.size * 1.5,
          },
          glowStyle,
        ]}
      />

      {/* Lightning Avatar */}
      <Animated.View style={[styles.avatar, avatarStyle]}>
        <LottieView
          source={require(`../../assets/animations/${state.level}-${state.pattern}.json`)}
          autoPlay
          loop={!state.currentAnimation || state.currentAnimation === "idle"}
          style={styles.lottie}
          speed={intensity.value}
          colorFilters={[
            {
              keypath: "lightning",
              color: AVATAR_COLORS[state.color],
            },
          ]}
          onAnimationFinish={onAnimationComplete}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.5,
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
});
