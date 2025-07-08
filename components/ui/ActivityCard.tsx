import React, { useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { EnrichedActivity } from "../../types/social";
import { StyledText } from "../StyledText";
import { LightningAvatar } from "../avatar";
import { formatDistanceToNow } from "date-fns";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { theme } from "../../lib/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ActivityCardProps {
  activity: EnrichedActivity;
  isNew?: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "workout_completed":
      return "weight-lifter";
    case "achievement_unlocked":
      return "trophy";
    case "challenge_joined":
      return "account-group";
    case "challenge_completed":
      return "flag-checkered";
    case "level_up":
      return "star";
    case "streak_milestone":
      return "fire";
    default:
      return "bell";
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "workout_completed":
      return theme.colors.primary;
    case "achievement_unlocked":
      return theme.colors.gold;
    case "challenge_joined":
    case "challenge_completed":
      return theme.colors.purple;
    case "level_up":
      return theme.colors.success;
    case "streak_milestone":
      return theme.colors.danger;
    default:
      return theme.colors.text;
  }
};

const getActivityMessage = (activity: EnrichedActivity) => {
  const { activity_type, user, content } = activity;
  const name = user.display_name;

  switch (activity_type) {
    case "workout_completed":
      return `${name} completed ${content.workout_name}`;
    case "achievement_unlocked":
      return `${name} unlocked ${content.achievement_name}`;
    case "challenge_joined":
      return `${name} joined ${content.challenge_name}`;
    case "challenge_completed":
      return `${name} completed ${content.challenge_name}`;
    case "level_up":
      return `${name} reached level ${content.new_level}`;
    case "streak_milestone":
      return `${name} reached a ${content.days} day streak!`;
    default:
      return content.message || "Unknown activity";
  }
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isNew = false,
}) => {
  const navigation = useNavigation();
  const scale = useSharedValue(isNew ? 0.8 : 1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (isNew) {
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 100,
      });
    }
  }, [isNew]);

  const handlePress = () => {
    const { activity_type, workout_id, challenge_id, achievement_id } =
      activity;

    switch (activity_type) {
      case "workout_completed":
        if (workout_id) {
          navigation.navigate("exercise-detail", { id: workout_id });
        }
        break;
      case "challenge_joined":
      case "challenge_completed":
        if (challenge_id) {
          navigation.navigate("challenges", {
            screen: "challenge-detail",
            params: { id: challenge_id },
          });
        }
        break;
      case "achievement_unlocked":
        if (achievement_id) {
          // Open achievement modal
        }
        break;
      default:
        // Navigate to user profile
        navigation.navigate("profile", { userId: activity.user_id });
    }
  };

  return (
    <Animated.View
      entering={FadeInDown}
      style={[styles.container, animatedStyle]}
    >
      <Pressable style={styles.content} onPress={handlePress}>
        <View style={styles.header}>
          <LightningAvatar
            size={40}
            imageUrl={activity.user.avatar_url}
            mood="happy"
          />
          <View style={styles.headerText}>
            <StyledText style={styles.message}>
              {getActivityMessage(activity)}
            </StyledText>
            <StyledText style={styles.timestamp}>
              {formatDistanceToNow(new Date(activity.created_at), {
                addSuffix: true,
              })}
            </StyledText>
          </View>
          <MaterialCommunityIcons
            name={getActivityIcon(activity.activity_type)}
            size={24}
            color={getActivityColor(activity.activity_type)}
          />
        </View>

        {activity.content.image_url && (
          <View style={styles.imageContainer}>
            <Animated.Image
              source={{ uri: activity.content.image_url }}
              style={styles.image}
              entering={FadeInDown.delay(200)}
            />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
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
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    marginHorizontal: 12,
  },
  message: {
    fontSize: 14,
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  imageContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
});
