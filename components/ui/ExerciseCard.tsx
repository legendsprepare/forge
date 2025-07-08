import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Card, Text, IconButton, useTheme } from "react-native-paper";
import { ExerciseWithSets } from "../../types/workout";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
} from "react-native-reanimated";

interface ExerciseCardProps {
  exercise: ExerciseWithSets;
  onAddSet: () => void;
  onRemove: () => void;
  onRestTimer: () => void;
}

export const ExerciseCard = ({
  exercise,
  onAddSet,
  onRemove,
  onRestTimer,
}: ExerciseCardProps) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInRight}
      exiting={FadeOutLeft}
      layout={Layout.springify()}
    >
      <Card style={styles.card}>
        <Card.Title
          title={exercise.name}
          subtitle={`${exercise.sets.length} sets`}
          right={(props) => (
            <View style={styles.actions}>
              <IconButton {...props} icon="timer" onPress={onRestTimer} />
              <IconButton {...props} icon="close" onPress={onRemove} />
            </View>
          )}
        />
        <Card.Content>
          <View style={styles.setsContainer}>
            {exercise.sets.map((set, index) => (
              <View key={set.id} style={styles.setRow}>
                <Text variant="bodyLarge">Set {index + 1}</Text>
                <View style={styles.setDetails}>
                  {set.weight && (
                    <Text variant="bodyMedium">{set.weight} kg</Text>
                  )}
                  <Text variant="bodyMedium">{set.reps} reps</Text>
                  {set.is_personal_record && (
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color={theme.colors.primary}
                    />
                  )}
                </View>
              </View>
            ))}
          </View>
        </Card.Content>
        <Card.Actions>
          <Pressable
            style={[
              styles.addSetButton,
              { backgroundColor: theme.colors.primary },
            ]}
            onPress={onAddSet}
          >
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.onPrimary }}
            >
              Add Set
            </Text>
          </Pressable>
        </Card.Actions>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  setsContainer: {
    gap: 8,
  },
  setRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  setDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  addSetButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
});
