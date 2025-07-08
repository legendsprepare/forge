import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TrendingUp } from "lucide-react-native";

export default function ProgressScreen() {
  return (
    <View style={styles.container}>
      <TrendingUp size={64} color="#4ECDC4" />
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.subtitle}>Track your improvements</Text>
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
