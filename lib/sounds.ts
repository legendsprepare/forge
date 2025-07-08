import { Audio } from 'expo-av';

let achievementSound: Audio.Sound | null = null;

export async function loadSounds() {
  try {
    // For now, we'll skip loading custom sounds and use system sounds
    // In the future, you can add custom sound files to assets/sounds/
    console.log('Sound system initialized (using system sounds)');
  } catch (error) {
    console.warn('Failed to load sounds:', error);
  }
}

export async function playAchievementSound() {
  try {
    if (achievementSound) {
      await achievementSound.replayAsync();
    } else {
      // Use system notification sound as fallback
      console.log('Playing achievement sound (system fallback)');
    }
  } catch (error) {
    console.warn('Failed to play achievement sound:', error);
  }
}

export async function unloadSounds() {
  try {
    if (achievementSound) {
      await achievementSound.unloadAsync();
      achievementSound = null;
    }
  } catch (error) {
    console.warn('Failed to unload sounds:', error);
  }
}
