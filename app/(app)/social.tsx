import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Users } from "lucide-react-native";

export default function SocialScreen() {
  return (
    <View style={styles.container}>
      <Users size={64} color="#FF6B35" />
      <Text style={styles.title}>Social</Text>
      <Text style={styles.subtitle}>Connect with friends</Text>
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
