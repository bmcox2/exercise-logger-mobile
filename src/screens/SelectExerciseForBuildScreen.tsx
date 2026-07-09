import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { BuildStackParamList, ExerciseLibraryRow } from "../types";
import { searchExerciseLibraryByName } from "../db/database";

type Props = NativeStackScreenProps<BuildStackParamList, "SelectExerciseForBuild">;

export default function SelectExerciseForBuildScreen({ navigation, route }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [exercises, setExercises] = useState<ExerciseLibraryRow[]>([]);

  useEffect(() => {
    async function load() {
      const data = await searchExerciseLibraryByName(searchInput);
      setExercises(data);
    }
    load();
  }, [searchInput]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        value={searchInput}
        onChangeText={setSearchInput}
        placeholder="Search exercises..."
        placeholderTextColor="#999"
        clearButtonMode="while-editing"
      />
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.category}</Text>
            </View>
            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  navigation.navigate("ExerciseDetailForBuild", {
                    exerciseId: item.id,
                    onSelect: route.params.onSelect,
                    sourceWorkoutId: route.params.sourceWorkoutId,
                  })
                }
              >
                <Text style={styles.actionText}>View Details</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  route.params.onSelect(item);
                  navigation.goBack();
                }}
              >
                <Text style={styles.actionText}>Select</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No exercises found.</Text>
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
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
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
  subtitle: {
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
