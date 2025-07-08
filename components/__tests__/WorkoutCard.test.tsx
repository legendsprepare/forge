import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { WorkoutCard } from '../ui/WorkoutCard';
import { performanceMonitor } from '../../utils/performance';

jest.mock('../../utils/performance', () => ({
  performanceMonitor: {
    trackInteraction: jest.fn(),
    trackRender: jest.fn(),
  },
}));

const mockWorkout = {
  id: '1',
  title: 'Full Body Workout',
  duration: 45,
  exercises: [
    { id: '1', name: 'Push-ups', sets: 3, reps: 12 },
    { id: '2', name: 'Squats', sets: 4, reps: 15 },
  ],
  difficulty: 'intermediate',
  calories: 300,
};

describe('WorkoutCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders workout details correctly', () => {
    const { getByText, getByTestId } = render(
      <WorkoutCard workout={mockWorkout} onPress={() => {}} />
    );

    expect(getByText('Full Body Workout')).toBeTruthy();
    expect(getByText('45 min')).toBeTruthy();
    expect(getByText('300 cal')).toBeTruthy();
    expect(getByTestId('difficulty-badge')).toHaveTextContent('intermediate');
  });

  it('handles press interaction with performance tracking', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <WorkoutCard workout={mockWorkout} onPress={mockOnPress} />
    );

    act(() => {
      fireEvent.press(getByTestId('workout-card'));
    });

    expect(mockOnPress).toHaveBeenCalledWith(mockWorkout);
    expect(performanceMonitor.trackInteraction).toHaveBeenCalledWith(
      'WorkoutCard',
      'press',
      expect.any(Number)
    );
  });

  it('displays exercise count correctly', () => {
    const { getByText } = render(
      <WorkoutCard workout={mockWorkout} onPress={() => {}} />
    );

    expect(getByText('2 exercises')).toBeTruthy();
  });

  it('applies correct styling based on difficulty', () => {
    const { getByTestId } = render(
      <WorkoutCard workout={mockWorkout} onPress={() => {}} />
    );

    const difficultyBadge = getByTestId('difficulty-badge');
    expect(difficultyBadge).toHaveStyle({
      backgroundColor: expect.any(String), // Add your theme color here
    });
  });

  it('shows loading state when isLoading prop is true', () => {
    const { getByTestId } = render(
      <WorkoutCard workout={mockWorkout} onPress={() => {}} isLoading={true} />
    );

    expect(getByTestId('workout-card-skeleton')).toBeTruthy();
  });

  it('handles long workout titles correctly', () => {
    const longTitleWorkout = {
      ...mockWorkout,
      title: 'This is a very long workout title that should be truncated',
    };

    const { getByTestId } = render(
      <WorkoutCard workout={longTitleWorkout} onPress={() => {}} />
    );

    const titleElement = getByTestId('workout-title');
    expect(titleElement.props.numberOfLines).toBe(2);
  });

  it('tracks render performance', () => {
    render(<WorkoutCard workout={mockWorkout} onPress={() => {}} />);

    expect(performanceMonitor.trackRender).toHaveBeenCalledWith(
      'WorkoutCard',
      expect.any(Number)
    );
  });
}); 