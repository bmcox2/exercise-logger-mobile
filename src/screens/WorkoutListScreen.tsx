import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { mockWorkouts } from "../data/mockData";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutList">;

export default function WorkoutListScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockWorkouts}
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
    padding: 16,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  nameText: {
    fontSize: 18,
  },
  dateText: {
    fontSize: 14,
  },
  timeText: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
