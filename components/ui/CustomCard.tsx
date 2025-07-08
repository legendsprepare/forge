import React from 'react';
import { StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Surface } from 'react-native-paper';
import { borderRadius, elevation } from '../../lib/theme';
import * as Haptics from 'expo-haptics';

interface CustomCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'small' | 'medium' | 'large';
  radius?: keyof typeof borderRadius;
}

export function CustomCard({
  children,
  style,
  onPress,
  elevation: cardElevation = 'medium',
  radius = 'lg',
}: CustomCardProps) {
  const handlePress = () => {
    if (onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  return (
    <Pressable onPress={onPress ? handlePress : undefined}>
      <Surface
        style={[
          styles.card,
          cardElevation === 'small'
            ? elevation.level1
            : cardElevation === 'medium'
              ? elevation.level2
              : elevation.level3,
          { borderRadius: borderRadius[radius] },
          style,
        ]}
      >
        {children}
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
});
