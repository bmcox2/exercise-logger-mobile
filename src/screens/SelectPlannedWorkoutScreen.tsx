import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { useState, useCallback } from "react";
import { CompositeScreenProps, useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { StartStackParamList, RootStackParamList, Workout } from "../types";
import { getWorkouts } from "../db/database";

type Props = CompositeScreenProps<
  NativeStackScreenProps<StartStackParamList, "SelectPlannedWorkout">,
  NativeStackScreenProps<RootStackParamList>
>;

export default function SelectPlannedWorkoutScreen({ navigation }: Props) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function load() {
        const data = await getWorkouts("planned");
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
          <Pressable
            style={styles.row}
            onPress={() =>
              navigation.navigate("ActiveWorkoutFlow", { workoutId: item.id })
            }
          >
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No planned workouts yet.</Text>
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
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#555",
  },
});
