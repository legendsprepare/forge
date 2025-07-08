import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { StrengthProgression } from '../../types/progress';
import { Text } from '../ui/Text';
import { useTheme } from '../../hooks/useTheme';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ProgressChartProps {
  data: StrengthProgression[];
  timeRange?: '1W' | '1M' | '3M' | '1Y' | 'ALL';
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, timeRange = '1M' }) => {
  const theme = useTheme();
  const { width } = Dimensions.get('window');

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Progress Chart</Text>
        <Text style={styles.subtitle}>No data available</Text>
      </View>
    );
  }

  // Transform data for react-native-chart-kit
  const chartData = {
    labels: data.map((item, index) => {
      // Show every 3rd label to avoid crowding
      if (index % 3 === 0) {
        const date = new Date(item.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }
      return '';
    }),
    datasets: [
      {
        data: data.map(item => item.estimatedOneRM),
        color: (opacity = 1) => `rgba(107, 70, 193, ${opacity})`, // theme.colors.primary
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.background,
    backgroundGradientFrom: theme.colors.card,
    backgroundGradientTo: theme.colors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(107, 70, 193, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  const exerciseName = data[0]?.exercise || 'Exercise';
  const latestOneRM = data[data.length - 1]?.estimatedOneRM || 0;

  return (
    <Animated.View entering={FadeIn} style={styles.container}>
      <Text style={styles.title}>{exerciseName} Progression</Text>
      <Text style={styles.subtitle}>Estimated 1RM: {latestOneRM}kg</Text>

      <LineChart
        data={chartData}
        width={width - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withHorizontalLabels={true}
        withVerticalLabels={true}
        withDots={true}
        withShadow={false}
        withInnerLines={false}
        withOuterLines={false}
      />
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
    marginBottom: 4,
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
});
