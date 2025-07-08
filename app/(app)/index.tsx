import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { 
  Zap, 
  Flame, 
  Dumbbell, 
  TrendingUp, 
  Users, 
  ChevronRight,
  Trophy 
} from "lucide-react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarSection}>
          <View style={styles.lightningAvatar}>
            <Zap size={40} color="#FFD700" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.levelText}>⚡ Level 1 Spark</Text>
          </View>
        </View>

        <View style={styles.streakBadge}>
          <Flame size={24} color="#FF6B35" />
          <Text style={styles.streakText}>0 🔥</Text>
        </View>
      </View>

      {/* XP Bar */}
      <View style={styles.xpBar}>
        <Text style={styles.xpText}>0 / 100 XP</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: "0%" }]} />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <Pressable
          style={styles.actionCard}
          onPress={() => router.push("/(app)/workouts")}
        >
          <Dumbbell size={48} color="#6B46C1" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Start Workout</Text>
            <Text style={styles.cardSubtitle}>Begin your training session</Text>
          </View>
          <ChevronRight size={24} color="#666" />
        </Pressable>

        <Pressable
          style={styles.actionCard}
          onPress={() => router.push("/(app)/progress")}
        >
          <TrendingUp size={48} color="#4ECDC4" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>View Progress</Text>
            <Text style={styles.cardSubtitle}>Track your improvements</Text>
          </View>
          <ChevronRight size={24} color="#666" />
        </Pressable>

        <Pressable
          style={styles.actionCard}
          onPress={() => router.push("/(app)/social")}
        >
          <Users size={48} color="#FF6B35" />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Social Hub</Text>
            <Text style={styles.cardSubtitle}>Connect with friends</Text>
          </View>
          <ChevronRight size={24} color="#666" />
        </Pressable>
      </View>

      {/* Today's Challenge */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Challenge</Text>
        <View style={styles.challengeCard}>
          <Trophy size={32} color="#FFD700" />
          <View style={styles.challengeContent}>
            <Text style={styles.challengeTitle}>
              Complete Your First Workout
            </Text>
            <Text style={styles.challengeReward}>
              Reward: 50 XP + Achievement
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  lightningAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6B46C1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  levelText: {
    fontSize: 14,
    color: "#6B46C1",
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakText: {
    color: "#FF6B35",
    fontWeight: "bold",
    marginLeft: 4,
  },
  xpBar: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  xpText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6B46C1",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 2,
  },
  challengeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  challengeContent: {
    flex: 1,
    marginLeft: 16,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  challengeReward: {
    fontSize: 14,
    color: "#FFD700",
    marginTop: 2,
  },
});
