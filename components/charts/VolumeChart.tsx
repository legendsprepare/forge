import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Text } from '../ui/Text';
import { useTheme } from '../../hooks/useTheme';
import Animated, { FadeIn } from 'react-native-reanimated';

interface VolumeChartProps {
  data: Record<string, number[]>;
  weeks: string[];
}

const MUSCLE_COLORS = [
  '#FF6B6B', // chest
  '#4ECDC4', // back
  '#45B7D1', // legs
  '#96CEB4', // shoulders
  '#FFEEAD', // arms
  '#D4A5A5', // core
  '#9FA8DA', // cardio
];

export const VolumeChart: React.FC<VolumeChartProps> = ({ data, weeks }) => {
  const theme = useTheme();
  const { width } = Dimensions.get('window');

  // Handle empty data
  if (!data || !weeks || weeks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Weekly Training Volume</Text>
        <Text style={styles.subtitle}>No data available</Text>
      </View>
    );
  }

  // Calculate total volume for each week
  const weeklyTotals = weeks.map((_, weekIndex) => {
    return Object.values(data).reduce((sum, volumes) => {
      return sum + (volumes[weekIndex] || 0);
    }, 0);
  });

  const chartData = {
    labels: weeks.map(week => week.slice(0, 6)), // Shorten labels
    datasets: [
      {
        data: weeklyTotals,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.background,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(107, 70, 193, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  };

  const totalVolumeThisWeek = weeklyTotals[weeklyTotals.length - 1] || 0;

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Text style={styles.title}>Weekly Training Volume</Text>

      <BarChart
        data={chartData}
        width={width - 32}
        height={250}
        chartConfig={chartConfig}
        style={styles.chart}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        showValuesOnTopOfBars={true}
        fromZero={true}
      />

      <View style={styles.totalVolume}>
        <Text style={styles.totalVolumeLabel}>Total Volume This Week</Text>
        <Text style={styles.totalVolumeValue}>{totalVolumeThisWeek}kg</Text>
      </View>

      <View style={styles.muscleBreakdown}>
        <Text style={styles.breakdownTitle}>Muscle Group Breakdown</Text>
        {Object.entries(data).map(([muscle, volumes], index) => {
          const latestVolume = volumes[volumes.length - 1] || 0;
          return (
            <View key={muscle} style={styles.muscleRow}>
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: MUSCLE_COLORS[index % MUSCLE_COLORS.length] },
                ]}
              />
              <Text style={styles.muscleName}>
                {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
              </Text>
              <Text style={styles.muscleVolume}>{latestVolume}kg</Text>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  totalVolume: {
    marginTop: 16,
    alignItems: 'center',
  },
  totalVolumeLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  totalVolumeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4ECDC4',
  },
  muscleBreakdown: {
    marginTop: 16,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  muscleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  muscleName: {
    flex: 1,
    fontSize: 14,
  },
  muscleVolume: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
