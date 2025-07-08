import React from "react";
import { StyleSheet } from "react-native";
import { TextInput, HelperText } from "react-native-paper";

interface AuthInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
}

export function AuthInput({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  autoCapitalize = "none",
  keyboardType = "default",
}: AuthInputProps) {
  return (
    <>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        mode="outlined"
        style={styles.input}
        error={!!error}
        outlineColor="#6B46C1"
        activeOutlineColor="#6B46C1"
      />
      {error && <HelperText type="error">{error}</HelperText>}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 8,
    backgroundColor: "transparent",
  },
});
