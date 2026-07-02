import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { LibraryStackParamList, ExerciseLibraryRow } from "../types";
import { getExerciseById } from "../db/database";

type Props = NativeStackScreenProps<LibraryStackParamList, "ExerciseDetail">;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ExerciseDetailScreen({ route }: Props) {
  const [exercise, setExercise] = useState<ExerciseLibraryRow | null>();
  const { exerciseId } = route.params;

  useEffect(() => {
    async function load() {
      const data = await getExerciseById(exerciseId);
      setExercise(data);
    }
    load();
  }, []);

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Exercise not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.name}</Text>
        {exercise.category && (
          <Text style={styles.meta}>{capitalize(exercise.category)}</Text>
        )}
        {exercise.equipment && (
          <Text style={styles.meta}>Equipment: {capitalize(exercise.equipment)}</Text>
        )}
      </View>

      {exercise.description ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.bodyText}>{exercise.description}</Text>
        </View>
      ) : null}

      {exercise.primaryMuscles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Primary Muscles</Text>
          <Text style={styles.bodyText}>
            {exercise.primaryMuscles.map(capitalize).join(", ")}
          </Text>
        </View>
      )}

      {exercise.secondaryMuscles.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Secondary Muscles</Text>
          <Text style={styles.bodyText}>
            {exercise.secondaryMuscles.map(capitalize).join(", ")}
          </Text>
        </View>
      )}
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
  section: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#555",
  },
});
