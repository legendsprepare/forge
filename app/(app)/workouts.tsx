import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function WorkoutsScreen() {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="dumbbell" size={64} color="#6B46C1" />
      <Text style={styles.title}>Workouts</Text>
      <Text style={styles.subtitle}>Track your training sessions</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
  },
});
