import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // For now, just redirect to app
    // Later you can add auth logic here
    setTimeout(() => {
      router.replace("/(app)");
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitQuest</Text>
      <Text style={styles.subtitle}>⚡ Gamified Fitness ⚡</Text>
      <ActivityIndicator size="large" color="#6B46C1" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#6B46C1",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});
