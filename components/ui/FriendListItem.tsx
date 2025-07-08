import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { UserProfile } from "../../types/social";
import { StyledText } from "../StyledText";
import { LightningAvatar } from "../avatar";
import { theme } from "../../lib/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  useSharedValue,
  FadeIn,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useSocialStore } from "../../stores/socialStore";

interface FriendListItemProps {
  friend: UserProfile;
  status?: "friend" | "pending" | "suggestion";
  onAccept?: () => void;
  onDecline?: () => void;
  onRemove?: () => void;
  showMutualInfo?: boolean;
  mutualFriends?: number;
  mutualAchievements?: number;
}

export const FriendListItem: React.FC<FriendListItemProps> = ({
  friend,
  status = "friend",
  onAccept,
  onDecline,
  onRemove,
  showMutualInfo = false,
  mutualFriends = 0,
  mutualAchievements = 0,
}) => {
  const navigation = useNavigation();
  const scale = useSharedValue(1);
  const unfriend = useSocialStore((state) => state.unfriend);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    navigation.navigate("profile", { userId: friend.id });
  };

  const handleUnfriend = async () => {
    try {
      await unfriend(friend.id);
      onRemove?.();
    } catch (error) {
      console.error("Failed to unfriend:", error);
    }
  };

  const renderActionButtons = () => {
    switch (status) {
      case "pending":
        return (
          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.actionButton, styles.acceptButton]}
              onPress={onAccept}
            >
              <MaterialCommunityIcons
                name="check"
                size={20}
                color={theme.colors.white}
              />
            </Pressable>
            <Pressable
              style={[styles.actionButton, styles.declineButton]}
              onPress={onDecline}
            >
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={theme.colors.white}
              />
            </Pressable>
          </View>
        );

      case "suggestion":
        return (
          <Pressable
            style={[styles.actionButton, styles.addButton]}
            onPress={onAccept}
          >
            <MaterialCommunityIcons
              name="account-plus"
              size={20}
              color={theme.colors.white}
            />
          </Pressable>
        );

      case "friend":
        return (
          <Pressable
            style={[styles.actionButton, styles.messageButton]}
            onPress={() => {
              navigation.navigate("chat", {
                screen: "direct",
                params: { userId: friend.id },
              });
            }}
          >
            <MaterialCommunityIcons
              name="message-outline"
              size={20}
              color={theme.colors.white}
            />
          </Pressable>
        );
    }
  };

  return (
    <Animated.View entering={FadeIn} style={[styles.container, animatedStyle]}>
      <Pressable style={styles.content} onPress={handlePress}>
        <View style={styles.leftContent}>
          <LightningAvatar
            size={48}
            imageUrl={friend.avatar_url}
            isOnline={friend.is_online}
          />
          <View style={styles.info}>
            <StyledText style={styles.name}>{friend.display_name}</StyledText>
            {showMutualInfo &&
              (mutualFriends > 0 || mutualAchievements > 0) && (
                <View style={styles.mutualInfo}>
                  {mutualFriends > 0 && (
                    <View style={styles.mutualItem}>
                      <MaterialCommunityIcons
                        name="account-multiple"
                        size={14}
                        color={theme.colors.textSecondary}
                      />
                      <StyledText style={styles.mutualText}>
                        {mutualFriends} mutual
                      </StyledText>
                    </View>
                  )}
                  {mutualAchievements > 0 && (
                    <View style={styles.mutualItem}>
                      <MaterialCommunityIcons
                        name="trophy"
                        size={14}
                        color={theme.colors.textSecondary}
                      />
                      <StyledText style={styles.mutualText}>
                        {mutualAchievements} shared
                      </StyledText>
                    </View>
                  )}
                </View>
              )}
            {status === "friend" && (
              <StyledText style={styles.lastActive}>
                Last active: {new Date(friend.last_active).toLocaleDateString()}
              </StyledText>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          {renderActionButtons()}
          {status === "friend" && (
            <Pressable
              style={styles.moreButton}
              onPress={() => {
                // Show action sheet with more options (unfriend, block, etc.)
                handleUnfriend();
              }}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={theme.colors.textSecondary}
              />
            </Pressable>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  mutualInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 12,
  },
  mutualItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mutualText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  lastActive: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: theme.colors.success,
  },
  declineButton: {
    backgroundColor: theme.colors.danger,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
  },
  messageButton: {
    backgroundColor: theme.colors.primary,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
});
