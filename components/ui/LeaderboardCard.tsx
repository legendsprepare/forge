import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { LeagueMember, LeagueTier } from "../../types/gamification";

interface LeaderboardCardProps {
  tier: LeagueTier;
  members: LeagueMember[];
  userRank: number;
  isPromotionZone: boolean;
  isDemotionZone: boolean;
}

export const LeaderboardCard = ({
  tier,
  members,
  userRank,
  isPromotionZone,
  isDemotionZone,
}: LeaderboardCardProps) => {
  const theme = useTheme();

  const getTierColor = () => {
    switch (tier) {
      case "diamond":
        return "#B9F2FF";
      case "platinum":
        return "#E5E4E2";
      case "gold":
        return "#FFD700";
      case "silver":
        return "#C0C0C0";
      case "bronze":
        return "#CD7F32";
    }
  };

  const getRankIcon = (position: number) => {
    if (position === 1) return "crown";
    if (position <= 3) return "medal";
    return "chevron-right";
  };

  const rankStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withSpring(1, {
          damping: 10,
          stiffness: 100,
        }),
      },
    ],
  }));

  return (
    <Card style={styles.container}>
      <Card.Title
        title={`${tier.charAt(0).toUpperCase() + tier.slice(1)} League`}
        subtitle="Weekly Rankings"
        left={(props) => (
          <MaterialCommunityIcons
            {...props}
            name="trophy"
            size={24}
            color={getTierColor()}
          />
        )}
      />
      <Card.Content>
        <View style={styles.list}>
          {members.map((member, index) => {
            const isUser = member.position === userRank;
            const isPromotion = member.position <= 5;
            const isDemotion = member.position >= 25;

            return (
              <Animated.View
                key={member.id}
                style={[
                  styles.memberRow,
                  isUser && rankStyle,
                  isUser && { backgroundColor: "#6B46C120" },
                ]}
              >
                <View style={styles.rank}>
                  <MaterialCommunityIcons
                    name={getRankIcon(member.position)}
                    size={20}
                    color={
                      member.position <= 3
                        ? getTierColor()
                        : theme.colors.onSurface
                    }
                  />
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    #{member.position}
                  </Text>
                </View>

                <Text
                  variant="bodyLarge"
                  style={[styles.points, { color: theme.colors.onSurface }]}
                >
                  {member.points} pts
                </Text>

                {isPromotion && (
                  <MaterialCommunityIcons
                    name="arrow-up-bold"
                    size={20}
                    color="#4CAF50"
                  />
                )}
                {isDemotion && (
                  <MaterialCommunityIcons
                    name="arrow-down-bold"
                    size={20}
                    color="#F44336"
                  />
                )}
              </Animated.View>
            );
          })}
        </View>

        <View style={styles.footer}>
          {isPromotionZone && (
            <Text variant="labelMedium" style={{ color: "#4CAF50" }}>
              In promotion zone! Keep it up! 🎉
            </Text>
          )}
          {isDemotionZone && (
            <Text variant="labelMedium" style={{ color: "#F44336" }}>
              Warning: Demotion zone! Train harder! 💪
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  list: {
    gap: 8,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  rank: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  points: {
    marginRight: 16,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
});
