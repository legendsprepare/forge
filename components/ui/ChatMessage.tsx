import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { EnrichedChatMessage } from "../../types/social";
import { StyledText } from "../StyledText";
import { LightningAvatar } from "../avatar";
import { theme } from "../../lib/theme";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useSocialStore } from "../../stores/socialStore";

interface ChatMessageProps {
  message: EnrichedChatMessage;
  isLastInGroup?: boolean;
  showAvatar?: boolean;
}

const MessageContent: React.FC<{ message: EnrichedChatMessage }> = ({
  message,
}) => {
  const navigation = useNavigation();

  switch (message.type) {
    case "achievement":
      return (
        <Pressable
          style={[styles.contentContainer, styles.achievementContainer]}
          onPress={() => {
            // Open achievement modal
          }}
        >
          <MaterialCommunityIcons
            name="trophy"
            size={24}
            color={theme.colors.gold}
          />
          <View style={styles.achievementText}>
            <StyledText style={styles.achievementTitle}>
              Achievement Unlocked!
            </StyledText>
            <StyledText style={styles.text}>{message.content}</StyledText>
          </View>
        </Pressable>
      );

    case "workout":
      return (
        <Pressable
          style={[styles.contentContainer, styles.workoutContainer]}
          onPress={() => {
            const workoutData = JSON.parse(message.content);
            navigation.navigate("exercise-detail", { id: workoutData.id });
          }}
        >
          <MaterialCommunityIcons
            name="weight-lifter"
            size={24}
            color={theme.colors.primary}
          />
          <View style={styles.workoutText}>
            <StyledText style={styles.workoutTitle}>
              Workout Completed
            </StyledText>
            <StyledText style={styles.text}>
              {JSON.parse(message.content).name}
            </StyledText>
          </View>
        </Pressable>
      );

    case "challenge":
      return (
        <Pressable
          style={[styles.contentContainer, styles.challengeContainer]}
          onPress={() => {
            const challengeData = JSON.parse(message.content);
            navigation.navigate("challenges", {
              screen: "challenge-detail",
              params: { id: challengeData.id },
            });
          }}
        >
          <MaterialCommunityIcons
            name="flag"
            size={24}
            color={theme.colors.purple}
          />
          <View style={styles.challengeText}>
            <StyledText style={styles.challengeTitle}>
              Challenge Update
            </StyledText>
            <StyledText style={styles.text}>
              {JSON.parse(message.content).message}
            </StyledText>
          </View>
        </Pressable>
      );

    case "system":
      return (
        <View style={styles.systemContainer}>
          <StyledText style={styles.systemText}>{message.content}</StyledText>
        </View>
      );

    default:
      return (
        <View style={styles.contentContainer}>
          <StyledText style={styles.text}>{message.content}</StyledText>
        </View>
      );
  }
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastInGroup = false,
  showAvatar = true,
}) => {
  const userProfile = useSocialStore((state) => state.userProfile);
  const isOwnMessage = message.user_id === userProfile?.id;
  const scale = React.useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  React.useEffect(() => {
    scale.value = withSpring(1, {
      damping: 12,
      stiffness: 100,
    });
  }, []);

  return (
    <Animated.View
      entering={isOwnMessage ? SlideInRight : FadeIn}
      style={[
        styles.container,
        isOwnMessage ? styles.ownMessage : styles.otherMessage,
        !isLastInGroup && styles.messageSpacing,
        animatedStyle,
      ]}
    >
      {showAvatar && !isOwnMessage && (
        <LightningAvatar
          size={32}
          imageUrl={message.user.avatar_url}
          style={styles.avatar}
        />
      )}

      <View style={styles.messageContent}>
        {showAvatar && !isOwnMessage && (
          <StyledText style={styles.username}>
            {message.user.display_name}
          </StyledText>
        )}

        <MessageContent message={message} />

        <View style={styles.footer}>
          <StyledText style={styles.timestamp}>
            {format(new Date(message.created_at), "h:mm a")}
          </StyledText>

          {message.reaction_count > 0 && (
            <View style={styles.reactionContainer}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={16}
                color={theme.colors.primary}
              />
              <StyledText style={styles.reactionCount}>
                {message.reaction_count}
              </StyledText>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 4,
  },
  ownMessage: {
    justifyContent: "flex-end",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  messageSpacing: {
    marginBottom: 2,
  },
  avatar: {
    marginRight: 8,
    alignSelf: "flex-end",
  },
  messageContent: {
    maxWidth: "75%",
  },
  username: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  contentContainer: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
    gap: 8,
  },
  timestamp: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  reactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  achievementContainer: {
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.gold,
  },
  achievementText: {
    marginLeft: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.gold,
    marginBottom: 2,
  },
  workoutContainer: {
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  workoutText: {
    marginLeft: 8,
  },
  workoutTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.primary,
    marginBottom: 2,
  },
  challengeContainer: {
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.purple,
  },
  challengeText: {
    marginLeft: 8,
  },
  challengeTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.purple,
    marginBottom: 2,
  },
  systemContainer: {
    alignItems: "center",
    padding: 8,
  },
  systemText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
});
