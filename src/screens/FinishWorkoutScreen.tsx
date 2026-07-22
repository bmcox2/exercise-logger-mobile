import { View, Text, Pressable, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { ActiveWorkoutStackParamList } from "../types";

type Props = NativeStackScreenProps<
  ActiveWorkoutStackParamList,
  "FinishWorkout"
>;

export default function FinishWorkoutScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => navigation.getParent()?.goBack()}
          hitSlop={8}
        >
          <Text style={styles.exitText}>Exit</Text>
        </Pressable>
      </View>

      <View style={styles.body}>
        <Text style={styles.text}>Workout complete</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    padding: 16,
  },
  exitText: {
    fontSize: 15,
    color: "#555",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
