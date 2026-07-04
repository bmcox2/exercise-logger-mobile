import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BuildStackParamList } from "../types";

type Props = NativeStackScreenProps<BuildStackParamList, "BuildStart">;

export default function BuildStartScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Build a Workout</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("SelectSourceWorkout")}
      >
        <Text style={styles.buttonText}>Build from Existing Workout</Text>
      </Pressable>
      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Build with AI</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  buttonText: {
    fontSize: 18,
  },
});
