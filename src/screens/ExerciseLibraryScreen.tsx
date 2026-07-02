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

import { LibraryStackParamList, ExerciseLibraryRow } from "../types";
import { searchExerciseLibraryByName } from "../db/database";

type Props = NativeStackScreenProps<LibraryStackParamList, "ExerciseLibrary">;

export default function ExerciseLibraryScreen({ navigation }: Props) {
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
          <Pressable
            style={styles.row}
            onPress={() =>
              navigation.navigate("ExerciseDetail", { exerciseId: item.id })
            }
          >
            <Text style={styles.nameText}>{item.name}</Text>
          </Pressable>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  nameText: {
    fontSize: 18,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#555",
  },
});
