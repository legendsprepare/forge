import React from 'react';
import { Text as PaperText } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

type TextVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall';

interface TextProps {
  variant?: TextVariant;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({ variant = 'bodyMedium', style, children }) => {
  return (
    <PaperText variant={variant} style={style}>
      {children}
    </PaperText>
  );
};
