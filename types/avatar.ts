export type AvatarLevel = "spark" | "bolt" | "storm" | "thunder-god";
export type AvatarColor = "purple" | "orange" | "blue" | "gold";
export type AvatarPattern = "basic" | "zigzag" | "circular" | "radial";

export interface AvatarState {
  level: AvatarLevel;
  color: AvatarColor;
  pattern: AvatarPattern;
  intensity: number; // 0-1
  isAnimating: boolean;
  currentAnimation?: AvatarAnimation;
}

export type AvatarAnimation =
  | "idle"
  | "power-up"
  | "level-up"
  | "achievement"
  | "workout"
  | "social";

export interface AvatarConfig {
  size: number;
  strokeWidth: number;
  glowIntensity: number;
  animationSpeed: number;
}

export interface LevelThreshold {
  level: AvatarLevel;
  minPoints: number;
  color: AvatarColor;
  pattern: AvatarPattern;
}
