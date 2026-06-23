import { View, Text, ScrollView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState, useEffect } from "react";

import { RootStackParamList, Workout } from "../types";
import { getWorkoutById } from "../db/database";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutDetail">;

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
        <Text style={[styles.cell, styles.cellName, styles.headerText]}>
          Exercise
        </Text>
        <Text style={[styles.cell, styles.cellStat, styles.headerText]}>
          Reps
        </Text>
        <Text style={[styles.cell, styles.cellStat, styles.headerText]}>
          Weight
        </Text>
      </View>

      {workout.exercises.map((exercise, index) => (
        <View
          key={exercise.id}
          style={[styles.row, index % 2 === 1 && styles.rowAlt]}
        >
          <Text style={[styles.cell, styles.cellNum]}>{index + 1}</Text>
          <Text style={[styles.cell, styles.cellName]}>{exercise.name}</Text>
          <Text style={[styles.cell, styles.cellStat]}>{exercise.reps}</Text>
          <Text style={[styles.cell, styles.cellStat]}>
            {exercise.weight} lbs
          </Text>
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
  cellName: {
    flex: 5,
  },
  cellStat: {
    flex: 2,
    textAlign: "right",
  },
});
