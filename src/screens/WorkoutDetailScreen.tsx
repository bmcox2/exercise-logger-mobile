import { View, Text, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";

import { WorkoutsStackParamList, Workout } from "../types";
import { getWorkoutById } from "../db/database";

type Props = NativeStackScreenProps<WorkoutsStackParamList, "WorkoutDetail">;

export default function WorkoutDetailScreen({ route }: Props) {
  const [workout, setWorkout] = useState<Workout | null>();
  const { workoutId } = route.params;

  useEffect(() => {
    async function load() {
      const data = await getWorkoutById(workoutId);
      setWorkout(data);
    }
    load();
  }, []);

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text>Workout not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{workout.name}</Text>
        <Text style={styles.meta}>{workout.date}</Text>
        <Text style={styles.meta}>{workout.durationMinutes} min</Text>
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

      {workout.exercises.map((exercise) => (
        <View key={exercise.id}>
          <View style={styles.exerciseHeader}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
          </View>
          {exercise.sets.map((set, index) => (
            <View
              key={set.id}
              style={[styles.row, index % 2 === 1 && styles.rowAlt]}
            >
              <Text style={[styles.cell, styles.cellNum]}>{set.setNumber}</Text>
              <Text style={[styles.cell, styles.cellStat]}>{set.reps}</Text>
              <Text style={[styles.cell, styles.cellStat]}>
                {set.weight} lbs
              </Text>
            </View>
          ))}
        </View>
      ))}
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
  meta: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  exerciseHeader: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginTop: 4,
    backgroundColor: "#e8e8e8",
  },
  exerciseName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
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
});
