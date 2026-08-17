import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  Alert,
  PanResponder,
  Modal,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState, useEffect, useReducer, useRef } from "react";

import {
  ActiveWorkoutStackParamList,
  ActiveWorkout,
  ActiveExercise,
  ExerciseLibraryRow,
} from "../types";
import { getWorkoutById, completeWorkout } from "../db/database";
import {
  toActiveWorkout,
  activeWorkoutReducer,
  flattenActiveSetsByOrder,
} from "../utils/activeWorkout";

type Props = NativeStackScreenProps<ActiveWorkoutStackParamList, "ActiveWorkout">;

function toInputText(value: number | null | undefined): string {
  return value === null || value === undefined ? "" : String(value);
}

export default function ActiveWorkoutScreen({ route, navigation }: Props) {
  const [activeWorkout, setActiveWorkout] = useState<ActiveWorkout | null>(
    null,
  );
  const [notFound, setNotFound] = useState(false);
  const { workoutId } = route.params;

  useEffect(() => {
    async function load() {
      const workout = await getWorkoutById(workoutId);
      if (workout) {
        setActiveWorkout(toActiveWorkout(workout));
      } else {
        setNotFound(true);
      }
    }
    load();
  }, []);

  if (notFound) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.fallbackText}>This workout could not be found.</Text>
        <Pressable
          style={styles.fallbackButton}
          onPress={() => navigation.getParent()?.goBack()}
        >
          <Text style={styles.fallbackButtonText}>Exit</Text>
        </Pressable>
      </View>
    );
  }

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

  const flatSets = flattenActiveSetsByOrder(workout.exercises);
  const current = flatSets[workout.currentOrderIndex];
  const exercise = current?.exercise;
  const set = current?.set;

  const [repsText, setRepsText] = useState(() => toInputText(set?.actualReps));
  const [weightText, setWeightText] = useState(() =>
    toInputText(set?.actualWeight),
  );

  const [actionsVisible, setActionsVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const pendingPickerRef = useRef(false);
  const selectionMadeRef = useRef(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", (e) => {
      if (e.data.closing) return;
      if (!pendingPickerRef.current) return;
      pendingPickerRef.current = false;
      if (!selectionMadeRef.current) setActionsVisible(true);
    });
    return unsubscribe;
  }, [navigation]);

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

  useEffect(() => {
    setAttemptedSubmit(false);
    setRepsText(toInputText(set?.actualReps));
    setWeightText(toInputText(set?.actualWeight));
  }, [set?.id ?? set?.tempId]);

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
    if (!set.done && (set.actualReps === null || set.actualWeight === null)) {
      setAttemptedSubmit(true);
      Alert.alert("Enter both weight and reps before finishing this set.");
      return;
    }
    dispatch({ type: "COMPLETE_SET" });
  }

  const canDeleteExercise = workout.exercises.length > 1;

  const nextEntry = flatSets[workout.currentOrderIndex + 1];
  const nextExerciseName =
    nextEntry && nextEntry.exercise !== exercise ? nextEntry.exercise.name : null;

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

  function openExercisePicker(onSelect: (item: ExerciseLibraryRow) => void) {
    pendingPickerRef.current = true;
    selectionMadeRef.current = false;
    setActionsVisible(false);
    navigation.navigate("SelectExerciseForActiveWorkout", {
      onSelect: (item) => {
        selectionMadeRef.current = true;
        onSelect(item);
      },
    });
  }

  function handleReplaceExercise() {
    openExercisePicker((item) =>
      dispatch({ type: "REPLACE_ALL_EXERCISE", exercise: item }),
    );
  }

  function handleDeleteExercise() {
    Alert.alert(
      "Delete Exercise?",
      "This exercise and its sets will be removed from this workout.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            dispatch({ type: "DELETE_EXERCISE" });
            setActionsVisible(false);
          },
        },
      ],
    );
  }

  function handleReplaceExerciseAtSet() {
    openExercisePicker((item) =>
      dispatch({ type: "REPLACE_EXERCISE_AT_SET", exercise: item }),
    );
  }

  function handleDeleteSet() {
    dispatch({ type: "DELETE_SET" });
    setActionsVisible(false);
  }

  function handleAddSet() {
    dispatch({ type: "ADD_SET" });
    setActionsVisible(false);
  }

  function handleAddExercise() {
    openExercisePicker((item) =>
      dispatch({ type: "ADD_EXERCISE", exercise: item }),
    );
  }

  function handleOpenNoteEditor() {
    setNoteDraft(set.note ?? "");
    setActionsVisible(false);
    setNoteModalVisible(true);
  }

  function handleSaveNote() {
    const trimmed = noteDraft.trim();
    dispatch({ type: "UPDATE_SET_NOTE", note: trimmed === "" ? null : trimmed });
    setNoteModalVisible(false);
  }

  function handleCancelNote() {
    setNoteModalVisible(false);
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
          Set {workout.currentOrderIndex + 1} of {flatSets.length}
        </Text>
        <Text style={styles.exerciseName}>{exercise.name}</Text>

        <View style={styles.setPills}>
          {exercise.sets.map((s) => (
            <View
              key={s.id ?? s.tempId}
              style={[
                styles.pill,
                s.orderIndex === workout.currentOrderIndex && styles.pillCurrent,
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
              value={repsText}
              onChangeText={(text) => {
                setRepsText(text);
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
              value={weightText}
              onChangeText={(text) => {
                setWeightText(text);
                const parsed = parseFloat(text);
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
          <Pressable
            style={styles.secondaryButton}
            onPress={() => setActionsVisible(true)}
          >
            <Text style={styles.secondaryButtonText}>Actions</Text>
          </Pressable>
          <Pressable
            style={[styles.doneButton, set.done && styles.doneButtonUndo]}
            onPress={handleDone}
          >
            <Text style={styles.doneButtonText}>
              {set.done ? "Undo" : "Done"}
            </Text>
          </Pressable>
        </View>

        {nextExerciseName !== null && (
          <Text style={styles.nextExerciseText}>
            Next: {nextExerciseName}
          </Text>
        )}
      </ScrollView>

      <Modal
        visible={actionsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setActionsVisible(false)}
      >
        <Pressable
          style={styles.sheetBackdrop}
          onPress={() => setActionsVisible(false)}
        >
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderText}>
                <Text style={styles.sheetTitle}>{exercise.name}</Text>
                <Text style={styles.sheetSubtitle}>
                  Set {set.setNumber} of {exercise.sets.length}
                </Text>
              </View>
              <Pressable
                onPress={() => setActionsVisible(false)}
                hitSlop={8}
              >
                <Text style={styles.sheetClose}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.sheetSectionLabel}>This exercise</Text>
            <Pressable style={styles.sheetRow} onPress={handleReplaceExercise}>
              <Text style={styles.sheetRowText}>Replace whole exercise</Text>
            </Pressable>
            <Pressable
              style={styles.sheetRow}
              onPress={handleDeleteExercise}
              disabled={!canDeleteExercise}
            >
              <Text
                style={[
                  styles.sheetRowTextDestructive,
                  !canDeleteExercise && styles.sheetRowTextDisabled,
                ]}
              >
                Delete exercise
              </Text>
            </Pressable>

            <Text style={styles.sheetSectionLabel}>This set</Text>
            <Pressable style={styles.sheetRow} onPress={handleOpenNoteEditor}>
              <Text style={styles.sheetRowText}>
                {set.note ? "Edit note" : "Write note"}
              </Text>
            </Pressable>
            <Pressable
              style={styles.sheetRow}
              onPress={handleReplaceExerciseAtSet}
            >
              <Text style={styles.sheetRowText}>
                Replace exercise for this set
              </Text>
            </Pressable>
            <Pressable style={styles.sheetRow} onPress={handleDeleteSet}>
              <Text style={styles.sheetRowTextDestructive}>
                Delete this set
              </Text>
            </Pressable>

            <Pressable style={styles.sheetRow} onPress={handleAddExercise}>
              <Text style={styles.sheetRowText}>Add exercise</Text>
            </Pressable>

            <Pressable
              style={[styles.sheetRow, styles.sheetRowLast]}
              onPress={handleAddSet}
            >
              <Text style={styles.sheetRowText}>Add set</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={noteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelNote}
      >
        <Pressable style={styles.noteBackdrop} onPress={handleCancelNote}>
          <Pressable style={styles.noteCard} onPress={() => {}}>
            <Text style={styles.noteTitle}>Note for this set</Text>
            <TextInput
              style={styles.noteInput}
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder="e.g. machine was taken, subbed dumbbells"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              autoFocus
            />
            <View style={styles.noteActions}>
              <Pressable
                style={styles.noteCancelButton}
                onPress={handleCancelNote}
              >
                <Text style={styles.noteCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.noteSaveButton} onPress={handleSaveNote}>
                <Text style={styles.noteSaveText}>Save</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function ExerciseProgressBar({ exercises }: { exercises: ActiveExercise[] }) {
  const flatSets = flattenActiveSetsByOrder(exercises);
  return (
    <View style={styles.progressBarRow}>
      {flatSets.map(({ set }) => (
        <View key={set.id ?? set.tempId} style={styles.progressSegmentTrack}>
          <View
            style={[
              styles.progressSegmentFill,
              { width: set.done ? "100%" : "0%" },
            ]}
          />
        </View>
      ))}
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
  doneButtonUndo: {
    backgroundColor: "#8E8E93",
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
  sheetBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sheetHeaderText: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sheetSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  sheetClose: {
    fontSize: 20,
    color: "#555",
    paddingLeft: 12,
  },
  sheetSectionLabel: {
    fontSize: 13,
    color: "#999",
    marginTop: 12,
    marginBottom: 4,
  },
  sheetRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sheetRowLast: {
    borderBottomWidth: 0,
    marginTop: 4,
  },
  sheetRowText: {
    fontSize: 16,
    color: "#222",
  },
  sheetRowTextDestructive: {
    fontSize: 16,
    color: "#FF3B30",
  },
  sheetRowTextDisabled: {
    color: "#ccc",
  },
  noteBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  noteCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 12,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: "top",
    backgroundColor: "#f9f9f9",
  },
  noteActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  noteCancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  noteCancelText: {
    color: "#555",
    fontSize: 15,
  },
  noteSaveButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  noteSaveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
