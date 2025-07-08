import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Text } from '../ui/Text';
import { useTheme } from '../../hooks/useTheme';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Canvas, Path, LinearGradient, vec } from '@shopify/react-native-skia';

interface ChartDataPoint {
  x: string;
  y: number;
  label?: string;
  color?: string;
}

interface PRChartProps {
  data: ChartDataPoint[];
  title?: string;
}

const LightningEffect = ({ x, y, height }: { x: number; y: number; height: number }) => {
  const path = `M ${x},${y} 
               l 2,-${height * 0.3} 
               l -1.5,${height * 0.2} 
               l 2,-${height * 0.4} 
               l -1.5,${height * 0.3} 
               l 2,-${height * 0.4}`;

  return (
    <Canvas style={{ position: 'absolute', width: 10, height: height }}>
      <Path path={path} style="stroke" strokeWidth={2} color="yellow">
        <LinearGradient
          start={vec(0, 0)}
          end={vec(0, height)}
          colors={['rgba(255, 255, 0, 0.8)', 'rgba(255, 255, 0, 0)']}
        />
      </Path>
    </Canvas>
  );
};

export const PRChart: React.FC<PRChartProps> = ({ data, title = 'Personal Records' }) => {
  const theme = useTheme();
  const { width } = Dimensions.get('window');

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>No personal records yet</Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map(item => item.x.slice(0, 8)), // Shorten labels
    datasets: [
      {
        data: data.map(item => item.y),
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
    barPercentage: 0.6,
  };

  const maxWeight = Math.max(...data.map(d => d.y));
  const chartHeight = 280;

  return (
    <Animated.View entering={FadeInUp} style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={width - 32}
          height={chartHeight}
          chartConfig={chartConfig}
          style={styles.chart}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          showValuesOnTopOfBars={true}
          fromZero={true}
        />

        {/* Lightning effects for special records */}
        {data.map((record, index) =>
          record.color === 'lightning' ? (
            <LightningEffect
              key={index}
              x={((width - 32) / data.length) * (index + 0.5)}
              y={chartHeight - (record.y / maxWeight) * (chartHeight - 60)}
              height={(record.y / maxWeight) * (chartHeight - 60)}
            />
          ) : null
        )}
      </View>

      <View style={styles.recordsList}>
        {data.map((record, index) => (
          <View key={index} style={styles.recordItem}>
            <Text style={styles.exerciseName}>{record.x}</Text>
            <View style={styles.recordValue}>
              <Text style={styles.weight}>{record.y}kg</Text>
              {record.color === 'lightning' && <Text style={styles.prBadge}>PR!</Text>}
            </View>
          </View>
        ))}
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
  chartContainer: {
    position: 'relative',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  recordsList: {
    marginTop: 16,
  },
  recordItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  exerciseName: {
    fontSize: 14,
    flex: 1,
  },
  recordValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weight: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  prBadge: {
    backgroundColor: '#FFD700',
    color: '#000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
