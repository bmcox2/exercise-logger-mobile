import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";

import { BuildStackParamList, Workout } from "../types";
import { getWorkouts } from "../db/database";

type Props = NativeStackScreenProps<BuildStackParamList, "SelectSourceWorkout">;

export default function SelectSourceWorkoutScreen({ navigation }: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const data = await getWorkouts("completed");
        setWorkouts(data);
      }
      load();
    }, []),
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  navigation.navigate("SourceWorkoutDetail", {
                    workoutId: item.id,
                  })
                }
              >
                <Text style={styles.actionText}>View Details</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  navigation.navigate("BuildWorkout", {
                    sourceWorkoutId: item.id,
                  })
                }
              >
                <Text style={styles.actionText}>Select</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No workouts yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionText: {
    fontSize: 14,
    color: "#007AFF",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#555",
  },
});
