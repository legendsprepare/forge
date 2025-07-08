import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { TextInput, HelperText, useTheme } from "react-native-paper";
import { spacing } from "../../lib/theme";

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  style?: ViewStyle;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  right?: React.ReactNode;
  left?: React.ReactNode;
}

export function InputField({
  label,
  value,
  onChangeText,
  error,
  style,
  secureTextEntry = false,
  autoCapitalize = "none",
  keyboardType = "default",
  multiline = false,
  numberOfLines = 1,
  maxLength,
  placeholder,
  disabled = false,
  right,
  left,
}: InputFieldProps) {
  const theme = useTheme();

  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        right={right}
        left={left}
        mode="outlined"
        style={[styles.input, style]}
        error={!!error}
        outlineColor={theme.colors.primary}
        activeOutlineColor={theme.colors.primary}
        textColor={theme.colors.onSurface}
      />
      {error && (
        <HelperText type="error" style={styles.error}>
          {error}
        </HelperText>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: spacing.xs,
    backgroundColor: "transparent",
  },
  error: {
    marginBottom: spacing.sm,
  },
});
