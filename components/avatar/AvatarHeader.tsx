import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { LightningAvatar } from './LightningAvatar';
import { AvatarState } from '../../types/avatar';
import { spacing, typography } from '../../lib/theme';
import { getNextLevel } from '../../lib/avatar';

interface AvatarHeaderProps {
  avatarState: AvatarState;
  points: number;
  streak: number;
  onAvatarPress?: () => void;
}

export function AvatarHeader({ avatarState, points, streak, onAvatarPress }: AvatarHeaderProps) {
  const nextLevel = getNextLevel(avatarState.level);

  return (
    <View style={styles.container}>
      <Pressable onPress={onAvatarPress}>
        <LightningAvatar
          state={avatarState}
          config={{
            size: 60,
            strokeWidth: 2,
            glowIntensity: 0.5,
            animationSpeed: 1,
          }}
        />
      </Pressable>

      <View style={styles.info}>
        <View style={styles.levelContainer}>
          <Text variant="titleMedium" style={styles.level}>
            {avatarState.level
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Text>
          {streak > 0 && (
            <View style={styles.streakContainer}>
              <Text variant="labelSmall" style={styles.streakText}>
                {streak} day streak 🔥
              </Text>
            </View>
          )}
        </View>

        {nextLevel && (
          <View style={styles.progressContainer}>
            <View style={styles.progressInfo}>
              <Text variant="labelSmall" style={styles.pointsText}>
                {points} / {nextLevel.minPoints} points
              </Text>
              <Text variant="labelSmall" style={styles.nextLevelText}>
                Next:{' '}
                {nextLevel.level
                  .split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${(points / nextLevel.minPoints) * 100}%`,
                    backgroundColor: avatarState.color,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  level: {
    marginRight: spacing.sm,
  },
  streakContainer: {
    backgroundColor: 'rgba(107, 70, 193, 0.1)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  streakText: {
    color: '#6B46C1',
  },
  progressContainer: {
    marginTop: spacing.xs,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  pointsText: {
    opacity: 0.7,
  },
  nextLevelText: {
    color: '#6B46C1',
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(107, 70, 193, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
