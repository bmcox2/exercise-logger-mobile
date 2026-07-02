import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { WorkoutsStackParamList, Workout } from "../types";
import { getWorkouts } from "../db/database";

type Props = NativeStackScreenProps<WorkoutsStackParamList, "WorkoutList">;

export default function WorkoutListScreen({ navigation }: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getWorkouts();
      setWorkouts(data);
    }
    load();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() =>
              navigation.navigate("WorkoutDetail", { workoutId: item.id })
            }
          >
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.timeText}>{item.durationMinutes} min</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No workouts yet.</Text>
        }
      ></FlatList>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  nameText: {
    fontSize: 18,
  },
  dateText: {
    fontSize: 14,
    color: "#555",
  },
  timeText: {
    fontSize: 12,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
