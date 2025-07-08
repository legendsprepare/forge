import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WorkoutStreak } from '../../types/progress';
import { Text } from '../ui/Text';
import { useTheme } from '../../hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';

interface StreakCalendarProps {
  data: WorkoutStreak[];
  currentStreak: number;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ data, currentStreak }) => {
  const theme = useTheme();
  const { width } = Dimensions.get('window');

  const getIntensityColor = (intensity: number) => {
    const opacity = 0.2 + intensity * 0.8;
    return `rgba(107, 70, 193, ${opacity})`;
  };

  // Create a grid of the last 7 weeks (49 days)
  const generateCalendarGrid = () => {
    const grid = [];
    const today = new Date();
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Create 7 weeks
    for (let week = 6; week >= 0; week--) {
      const weekData = [];
      for (let day = 6; day >= 0; day--) {
        const date = new Date(today);
        date.setDate(today.getDate() - (week * 7 + day));

        const dateString = date.toISOString().split('T')[0];
        const workoutData = data.find(d => d.date.startsWith(dateString));

        weekData.push({
          date: date.getDate(),
          hasWorkout: !!workoutData,
          intensity: workoutData?.workoutCount || 0,
        });
      }
      grid.push(weekData);
    }
    return { grid, weekDays };
  };

  const { grid, weekDays } = generateCalendarGrid();

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workout Streak</Text>
        <View style={styles.streakBadge}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <Text style={styles.streakCount}>{currentStreak} 🔥</Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.calendar}>
        {/* Week day headers */}
        <View style={styles.weekHeader}>
          {weekDays.map((day, index) => (
            <Text key={index} style={styles.dayHeader}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        {grid.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map((day, dayIndex) => (
              <View
                key={dayIndex}
                style={[
                  styles.day,
                  {
                    backgroundColor: day.hasWorkout
                      ? getIntensityColor(Math.min(day.intensity / 3, 1))
                      : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: day.hasWorkout ? 'white' : theme.colors.textSecondary },
                  ]}
                >
                  {day.date}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Workout Intensity</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: theme.colors.border }]} />
            <Text style={styles.legendText}>No workout</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getIntensityColor(0.3) }]} />
            <Text style={styles.legendText}>Light</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getIntensityColor(0.7) }]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getIntensityColor(1) }]} />
            <Text style={styles.legendText}>Intense</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  streakBadge: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  gradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  streakCount: {
    color: 'white',
    fontWeight: 'bold',
  },
  calendar: {
    marginVertical: 16,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  week: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  day: {
    flex: 1,
    aspectRatio: 1,
    margin: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  legend: {
    marginTop: 16,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 2,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 4,
  },
  legendText: {
    fontSize: 10,
    opacity: 0.8,
  },
});
