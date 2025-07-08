import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "react-native-paper";
import { spacing } from "../../lib/theme";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  paddingHorizontal?: keyof typeof spacing;
  paddingVertical?: keyof typeof spacing;
}

export function ScreenContainer({
  children,
  style,
  paddingHorizontal = "md",
  paddingVertical = "md",
}: ScreenContainerProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingHorizontal: spacing[paddingHorizontal],
          paddingVertical: spacing[paddingVertical],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
