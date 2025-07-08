import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { User } from "lucide-react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <User size={64} color="#6B46C1" />
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Manage your account</Text>
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
