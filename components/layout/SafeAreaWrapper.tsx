import React from "react";
import { SafeAreaView, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function SafeAreaWrapper({ children, style }: SafeAreaWrapperProps) {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
