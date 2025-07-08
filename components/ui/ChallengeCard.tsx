import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { EnrichedTeamChallenge } from "../../types/social";
import { StyledText } from "../StyledText";
import { theme } from "../../lib/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSocialStore } from "../../stores/socialStore";
import { useNavigation } from "@react-navigation/native";

interface ChallengeCardProps {
  challenge: EnrichedTeamChallenge;
  onJoin?: () => void;
}

const getChallengeIcon = (type: string) => {
  switch (type) {
    case "total_workouts":
      return "weight-lifter";
    case "total_volume":
      return "chart-line";
    case "specific_exercise":
      return "dumbbell";
    case "streak_days":
      return "fire";
    case "xp_earned":
      return "star";
    default:
      return "trophy";
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 100) return theme.colors.success;
  if (progress >= 75) return theme.colors.warning;
  if (progress >= 50) return theme.colors.info;
  return theme.colors.primary;
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onJoin,
}) => {
  const navigation = useNavigation();
  const joinTeamChallenge = useSocialStore((state) => state.joinTeamChallenge);

  const progressWidth = useSharedValue(0);
  const scale = useSharedValue(1);

  const currentProgress = challenge.participants.reduce(
    (total, p) => total + p.current_progress,
    0
  );
  const progressPercentage = Math.min(
    (currentProgress / challenge.target_value) * 100,
    100
  );

  React.useEffect(() => {
    progressWidth.value = withDelay(
      300,
      withSpring(progressPercentage, {
        damping: 15,
        stiffness: 100,
      })
    );
  }, [progressPercentage]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleJoin = async () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    try {
      await joinTeamChallenge(challenge.id);
      onJoin?.();
    } catch (error) {
      console.error("Failed to join challenge:", error);
    }
  };

  const handlePress = () => {
    navigation.navigate("challenges", {
      screen: "challenge-detail",
      params: { id: challenge.id },
    });
  };

  const isJoined = challenge.participants.some(
    (p) => p.user_id === useSocialStore.getState().userProfile?.id
  );

  const daysLeft = Math.ceil(
    (new Date(challenge.end_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Pressable style={styles.content} onPress={handlePress}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons
              name={getChallengeIcon(challenge.challenge_type)}
              size={24}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <StyledText style={styles.title}>{challenge.name}</StyledText>
          </View>
          <StyledText style={styles.xpReward}>
            +{challenge.reward_xp} XP
          </StyledText>
        </View>

        <StyledText style={styles.description}>
          {challenge.description}
        </StyledText>

        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <Animated.View
              style={[
                styles.progressFill,
                progressStyle,
                { backgroundColor: getProgressColor(progressPercentage) },
              ]}
            />
          </View>
          <StyledText style={styles.progressText}>
            {Math.round(progressPercentage)}% Complete
          </StyledText>
        </View>

        <View style={styles.footer}>
          <View style={styles.statsContainer}>
            <StyledText style={styles.statsText}>
              {challenge.participants.length} Participants
            </StyledText>
            <StyledText style={styles.statsText}>
              {daysLeft} Days Left
            </StyledText>
          </View>

          {!isJoined && challenge.status === "active" && (
            <Pressable style={styles.joinButton} onPress={handleJoin}>
              <StyledText style={styles.joinButtonText}>
                Join Challenge
              </StyledText>
            </Pressable>
          )}
        </View>

        <View style={styles.dateContainer}>
          <StyledText style={styles.dateText}>
            {format(new Date(challenge.start_date), "MMM d")} -{" "}
            {format(new Date(challenge.end_date), "MMM d, yyyy")}
          </StyledText>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.text,
    flex: 1,
  },
  xpReward: {
    fontSize: 16,
    color: theme.colors.success,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBackground: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  statsText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  dateContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 12,
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
