import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState, useEffect, useReducer } from "react";

import { BuildStackParamList, Workout, DraftWorkout } from "../types";
import { getWorkoutById } from "../db/database";
import { cloneWorkoutAsDraft, draftReducer } from "../utils/draftWorkout";

type Props = NativeStackScreenProps<BuildStackParamList, "BuildWorkout">;

export default function BuildWorkoutScreen({ route }: Props) {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const { sourceWorkoutId } = route.params;

  useEffect(() => {
    async function load() {
      const source = await getWorkoutById(sourceWorkoutId);
      if (source) setWorkout(source);
    }
    load();
  }, []);

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <BuildWorkoutEditor initialDraft={cloneWorkoutAsDraft(workout)} />;
}

function BuildWorkoutEditor({ initialDraft }: { initialDraft: DraftWorkout }) {
  const [draft, dispatch] = useReducer(draftReducer, initialDraft);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.titleInput}
          value={draft.name}
          onChangeText={(text) =>
            dispatch({ type: "UPDATE_WORKOUT_NAME", name: text })
          }
        />
        <TextInput
          style={styles.dateInput}
          value={draft.date}
          onChangeText={(text) =>
            dispatch({ type: "UPDATE_WORKOUT_DATE", date: text })
          }
        />
      </View>

      {draft.exercises.map((exercise) => (
        <View key={exercise.tempId} style={styles.exerciseBlock}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <Pressable
              onPress={() =>
                dispatch({
                  type: "REMOVE_EXERCISE",
                  exerciseTempId: exercise.tempId!,
                })
              }
            >
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.cellNum, styles.headerText]}>
              Set
            </Text>
            <Text style={[styles.cell, styles.cellStat, styles.headerText]}>
              Reps
            </Text>
            <Text style={[styles.cell, styles.cellStat, styles.headerText]}>
              Weight
            </Text>
          </View>

          {exercise.sets.map((set, index) => (
            <View
              key={set.tempId}
              style={[styles.row, index % 2 === 1 && styles.rowAlt]}
            >
              <Text style={[styles.cell, styles.cellNum]}>{set.setNumber}</Text>
              <TextInput
                style={[styles.cell, styles.cellStat, styles.input]}
                keyboardType="numeric"
                value={set.reps.toString()}
                onChangeText={(text) =>
                  dispatch({
                    type: "UPDATE_SET_FIELD",
                    setTempId: set.tempId!,
                    field: "reps",
                    value: parseInt(text, 10) || 0,
                  })
                }
              />
              <TextInput
                style={[styles.cell, styles.cellStat, styles.input]}
                keyboardType="numeric"
                value={set.weight.toString()}
                onChangeText={(text) =>
                  dispatch({
                    type: "UPDATE_SET_FIELD",
                    setTempId: set.tempId!,
                    field: "weight",
                    value: parseInt(text, 10) || 0,
                  })
                }
              />
            </View>
          ))}

          <View style={styles.setActions}>
            <Pressable
              style={styles.setButton}
              onPress={() =>
                dispatch({
                  type: "ADD_SET",
                  exerciseTempId: exercise.tempId!,
                })
              }
            >
              <Text style={styles.setButtonText}>+ Add Set</Text>
            </Pressable>
            <Pressable
              style={styles.setButton}
              onPress={() =>
                dispatch({
                  type: "REMOVE_SET",
                  exerciseTempId: exercise.tempId!,
                })
              }
            >
              <Text style={styles.setButtonText}>- Remove Set</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable style={styles.addExerciseButton}>
        <Text style={styles.addExerciseText}>+ Add Exercise</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    paddingBottom: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 2,
  },
  meta: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  dateInput: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 2,
  },
  exerciseBlock: {
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: "#e8e8e8",
  },
  exerciseName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  removeText: {
    fontSize: 13,
    color: "#cc0000",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rowAlt: {
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 13,
  },
  cell: {
    fontSize: 13,
  },
  cellNum: {
    flex: 1,
  },
  cellStat: {
    flex: 2,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 2,
  },
  setActions: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8,
  },
  setButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
  },
  setButtonText: {
    fontSize: 13,
    color: "#333",
  },
  addExerciseButton: {
    marginTop: 8,
    marginBottom: 40,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
  },
  addExerciseText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
