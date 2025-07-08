import { AvatarLevel, AvatarColor, AvatarPattern, LevelThreshold } from '../types/avatar';

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  {
    level: 'spark',
    minPoints: 0,
    color: 'purple',
    pattern: 'basic',
  },
  {
    level: 'bolt',
    minPoints: 1000,
    color: 'orange',
    pattern: 'zigzag',
  },
  {
    level: 'storm',
    minPoints: 5000,
    color: 'blue',
    pattern: 'circular',
  },
  {
    level: 'thunder-god',
    minPoints: 10000,
    color: 'gold',
    pattern: 'radial',
  },
];

export const AVATAR_COLORS: Record<AvatarColor, string> = {
  purple: '#6B46C1',
  orange: '#F59E0B',
  blue: '#3B82F6',
  gold: '#F59E0B',
};

export const GLOW_COLORS: Record<AvatarColor, string> = {
  purple: 'rgba(107, 70, 193, 0.5)',
  orange: 'rgba(245, 158, 11, 0.5)',
  blue: 'rgba(59, 130, 246, 0.5)',
  gold: 'rgba(245, 158, 11, 0.5)',
};

export const ANIMATION_CONFIG = {
  idle: {
    duration: 2000,
    easing: 'easeInOut',
  },
  'power-up': {
    duration: 1000,
    easing: 'easeInOut',
  },
  'level-up': {
    duration: 3000,
    easing: 'easeInOut',
  },
  achievement: {
    duration: 1500,
    easing: 'easeInOut',
  },
  workout: {
    duration: 800,
    easing: 'easeInOut',
  },
  social: {
    duration: 500,
    easing: 'easeInOut',
  },
};

export function getLevelFromPoints(points: number): LevelThreshold {
  return (
    LEVEL_THRESHOLDS.find(
      (threshold, index) =>
        points >= threshold.minPoints &&
        (index === LEVEL_THRESHOLDS.length - 1 || points < LEVEL_THRESHOLDS[index + 1].minPoints)
    ) || LEVEL_THRESHOLDS[0]
  );
}

export function getNextLevel(currentLevel: AvatarLevel): LevelThreshold | null {
  const currentIndex = LEVEL_THRESHOLDS.findIndex(threshold => threshold.level === currentLevel);
  return currentIndex < LEVEL_THRESHOLDS.length - 1 ? LEVEL_THRESHOLDS[currentIndex + 1] : null;
}

export function calculateIntensity(streak: number): number {
  return Math.min(streak / 10, 1);
}

type AvatarMood = 'happy' | 'sad' | 'neutral' | 'excited';

let currentMood: AvatarMood = 'neutral';
let moodChangeCallback: ((mood: AvatarMood) => void) | null = null;

export function setAvatarMoodChangeCallback(callback: (mood: AvatarMood) => void) {
  moodChangeCallback = callback;
}

export function updateAvatarMood(mood: AvatarMood) {
  currentMood = mood;
  if (moodChangeCallback) {
    moodChangeCallback(mood);
  }
}

export function getCurrentAvatarMood(): AvatarMood {
  return currentMood;
}
