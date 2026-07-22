import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  PanResponder,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState, useEffect, useReducer, useRef } from "react";

import {
  ActiveWorkoutStackParamList,
  ActiveWorkout,
  ActiveExercise,
} from "../types";
import { getWorkoutById, completeWorkout } from "../db/database";
import {
  toActiveWorkout,
  activeWorkoutReducer,
  findNonEmptyExercise,
} from "../utils/activeWorkout";

type Props = NativeStackScreenProps<ActiveWorkoutStackParamList, "ActiveWorkout">;

export default function ActiveWorkoutScreen({ route, navigation }: Props) {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(
    null,
  );
  const { workoutId } = route.params;

  useEffect(() => {
    async function load() {
      const workout = await getWorkoutById(workoutId);
      if (workout) setActiveWorkout(toActiveWorkout(workout));
    }
    load();
  }, []);

  if (!activeWorkout) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ActiveWorkoutEditor
      initialWorkout={activeWorkout}
      navigation={navigation}
    />
  );
}

function ActiveWorkoutEditor({
  initialWorkout,
  navigation,
}: {
  initialWorkout: ActiveWorkout;
  navigation: Props["navigation"];
}) {
  const [workout, dispatch] = useReducer(activeWorkoutReducer, initialWorkout);
  const [startedAt] = useState(() => Date.now());
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 20 &&
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2,
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dx) < 50) return;
        dispatch({
          type: "NAVIGATE_SET",
          direction: gestureState.dx < 0 ? "next" : "prev",
        });
      },
    }),
  ).current;

  const exercise = workout.exercises[workout.currentExerciseIndex];
  const set = exercise ? exercise.sets[exercise.currentSetIndex] : undefined;

  useEffect(() => {
    setAttemptedSubmit(false);
  }, [set?.id]);

  useEffect(() => {
    if (workout.status !== "completed") return;

    async function finish() {
      try {
        const durationMinutes = Math.round((Date.now() - startedAt) / 60000);
        await completeWorkout(workout, durationMinutes);
        navigation.navigate("FinishWorkout");
      } catch (error) {
        setSaveError(true);
      }
    }
    finish();
  }, [workout.status]);

  if (workout.status === "completed") {
    if (saveError) {
      return (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackText}>
            Something went wrong saving this workout.
          </Text>
          <Pressable
            style={styles.fallbackButton}
            onPress={() => navigation.getParent()?.goBack()}
          >
            <Text style={styles.fallbackButtonText}>Exit</Text>
          </Pressable>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text>Saving...</Text>
      </View>
    );
  }

  if (!exercise || !set) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>This workout has no sets to log.</Text>
        <Pressable
          style={styles.fallbackButton}
          onPress={() => navigation.getParent()?.goBack()}
        >
          <Text style={styles.fallbackButtonText}>Exit</Text>
        </Pressable>
      </View>
    );
  }

  function handleDone() {
    if (!set) return;
    if (set.actualReps === null || set.actualWeight === null) {
      setAttemptedSubmit(true);
      Alert.alert("Enter both weight and reps before finishing this set.");
      return;
    }
    dispatch({ type: "COMPLETE_SET" });
  }

  const isLastSetOfExercise = exercise.currentSetIndex === exercise.sets.length - 1;
  const nextExerciseIndex = isLastSetOfExercise
    ? findNonEmptyExercise(workout.exercises, workout.currentExerciseIndex + 1, 1)
    : null;
  const nextExerciseName =
    nextExerciseIndex !== null ? workout.exercises[nextExerciseIndex].name : null;

  function handleExitPress() {
    Alert.alert("Exit Workout?", "Your progress will not be saved.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Exit",
        style: "destructive",
        onPress: () => navigation.getParent()?.goBack(),
      },
    ]);
  }

  return (
    <View style={styles.flexFill} {...panResponder.panHandlers}>
      <ScrollView style={styles.container}>
        <View style={styles.headerRow}>
          <Pressable onPress={handleExitPress} hitSlop={8}>
            <Text style={styles.exitText}>Exit</Text>
          </Pressable>
          <ExerciseProgressBar exercises={workout.exercises} />
        </View>

        <Text style={styles.progress}>
          Exercise {workout.currentExerciseIndex + 1} of{" "}
          {workout.exercises.length}
        </Text>
        <Text style={styles.exerciseName}>{exercise.name}</Text>

        <View style={styles.setPills}>
          {exercise.sets.map((s, index) => (
            <View
              key={s.id}
              style={[
                styles.pill,
                index === exercise.currentSetIndex && styles.pillCurrent,
                s.done && styles.pillDone,
              ]}
            >
              <Text style={styles.pillText}>{s.setNumber}</Text>
            </View>
          ))}
        </View>

        <View style={styles.imageStub} />

        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Reps</Text>
            <TextInput
              style={[
                styles.input,
                attemptedSubmit &&
                  set.actualReps === null &&
                  styles.inputError,
              ]}
              keyboardType="numeric"
              placeholder={String(set.plannedReps)}
              placeholderTextColor="#999"
              value={set.actualReps === null ? "" : String(set.actualReps)}
              onChangeText={(text) => {
                const parsed = parseInt(text, 10);
                dispatch({
                  type: "UPDATE_ACTUAL",
                  field: "actualReps",
                  value: Number.isNaN(parsed) ? null : parsed,
                });
              }}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Weight</Text>
            <TextInput
              style={[
                styles.input,
                attemptedSubmit &&
                  set.actualWeight === null &&
                  styles.inputError,
              ]}
              keyboardType="numeric"
              placeholder={String(set.plannedWeight)}
              placeholderTextColor="#999"
              value={set.actualWeight === null ? "" : String(set.actualWeight)}
              onChangeText={(text) => {
                const parsed = parseInt(text, 10);
                dispatch({
                  type: "UPDATE_ACTUAL",
                  field: "actualWeight",
                  value: Number.isNaN(parsed) ? null : parsed,
                });
              }}
            />
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Info</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Actions</Text>
          </Pressable>
          <Pressable style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </Pressable>
        </View>

        {nextExerciseName !== null && (
          <Text style={styles.nextExerciseText}>
            Next: {nextExerciseName}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

function ExerciseProgressBar({ exercises }: { exercises: ActiveExercise[] }) {
  return (
    <View style={styles.progressBarRow}>
      {exercises.map((ex) => {
        const doneCount = ex.sets.filter((s) => s.done).length;
        const fraction = ex.sets.length === 0 ? 0 : doneCount / ex.sets.length;
        return (
          <View key={ex.id} style={styles.progressSegmentTrack}>
            <View
              style={[
                styles.progressSegmentFill,
                { width: `${fraction * 100}%` },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 16,
  },
  fallbackText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  fallbackButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  fallbackButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  exitText: {
    fontSize: 15,
    color: "#555",
  },
  progressBarRow: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  progressSegmentTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#eee",
    overflow: "hidden",
  },
  progressSegmentFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  progress: {
    fontSize: 14,
    color: "#555",
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  setPills: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  pill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  pillCurrent: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  pillDone: {
    backgroundColor: "#007AFF",
  },
  pillText: {
    fontSize: 13,
  },
  imageStub: {
    height: 150,
    borderRadius: 12,
    backgroundColor: "#eee",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 24,
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: "#eee",
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 2,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#555",
    fontSize: 15,
  },
  doneButton: {
    flex: 2,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  nextExerciseText: {
    marginTop: 16,
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});
