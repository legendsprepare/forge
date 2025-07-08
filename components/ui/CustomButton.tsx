import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Button, FAB, useTheme } from "react-native-paper";
import * as Haptics from "expo-haptics";
import { spacing, borderRadius } from "../../lib/theme";

interface CustomButtonProps {
  onPress: () => void;
  label: string;
  mode?: "text" | "outlined" | "contained" | "fab";
  style?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  color?: string;
  compact?: boolean;
}

export function CustomButton({
  onPress,
  label,
  mode = "contained",
  style,
  loading = false,
  disabled = false,
  icon,
  color,
  compact = false,
}: CustomButtonProps) {
  const theme = useTheme();

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(
        mode === "contained"
          ? Haptics.ImpactFeedbackStyle.Medium
          : Haptics.ImpactFeedbackStyle.Light
      );
      onPress();
    }
  };

  if (mode === "fab") {
    return (
      <FAB
        icon={icon || "plus"}
        label={label}
        onPress={handlePress}
        style={[styles.fab, style]}
        loading={loading}
        disabled={disabled}
        color={color || theme.colors.primary}
      />
    );
  }

  return (
    <Button
      mode={mode}
      onPress={handlePress}
      style={[styles.button, compact && styles.compact, style]}
      loading={loading}
      disabled={disabled}
      icon={icon}
      buttonColor={
        mode === "contained" ? color || theme.colors.primary : undefined
      }
      textColor={
        mode !== "contained" ? color || theme.colors.primary : undefined
      }
    >
      {label}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
  },
  compact: {
    paddingVertical: 0,
    paddingHorizontal: spacing.sm,
  },
  fab: {
    position: "absolute",
    margin: spacing.md,
    right: 0,
    bottom: 0,
  },
});
