import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, TextInput } from "react-native";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WorkoutListScreen from "./src/screens/WorkoutListScreen";
import WorkoutDetailScreen from "./src/screens/WorkoutDetailScreen";
import { RootStackParamList } from "./src/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WorkoutList">
        <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
        <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function AppTitle() {
  return (
    <View>
      <Text>Exercise Logger</Text>
    </View>
  );
}

function SubTitle() {
  return (
    <View>
      <Text>AI Powered</Text>
    </View>
  );
}

function Header() {
  return (
    <View>
      <AppTitle />
      <SubTitle />
    </View>
  );
}

interface Exercise {
  id: number;
  name: string;
  reps: number;
  weight: number;
}

function DisplayExercise({ id, name, reps, weight }: Exercise) {
  return (
    <View>
      <Text>
        {name}({id}): {weight}lbs for {reps} reps
      </Text>
    </View>
  );
}

function ExerciseList() {
  const exercises: Exercise[] = [
    { id: 1, name: "Bench Press", reps: 3, weight: 135 },
    { id: 2, name: "Squat", reps: 5, weight: 225 },
    { id: 3, name: "Deadlift", reps: 8, weight: 315 },
  ];

  return (
    <View>
      {exercises.map((ex) => (
        <DisplayExercise key={ex.id} {...ex} />
      ))}
    </View>
  );
}

function RepCounter() {
  const [reps, setReps] = useState(0);

  return (
    <View>
      <Text>Reps Completed: {reps}</Text>
      <Pressable onPress={() => setReps(reps + 1)}>
        <Text>Add a Rep</Text>
      </Pressable>
      <Pressable onPress={() => setReps(reps - 1)}>
        <Text>Sibtract a Rep</Text>
      </Pressable>
      <Pressable onPress={() => setReps(0)}>
        <Text>Reset Reps</Text>
      </Pressable>
    </View>
  );
}

function AddExercise() {
  const [exercises, setExercises] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim() === "") return;
    setExercises([...exercises, input.trim()]);
    setInput("");
  };

  return (
    <View>
      <TextInput value={input} onChangeText={setInput} placeholder="Exercise" />
      <Pressable onPress={handleAdd}>
        <Text>Add an Exercise</Text>
      </Pressable>

      {exercises.length === 0 ? (
        <Text>No Exercises Logged</Text>
      ) : (
        <View>
          {exercises.map((ex, i) => (
            <Text key={i}>{ex}</Text>
          ))}
        </View>
      )}
      {exercises.length >= 3 && (
        <Pressable onPress={() => setExercises([])}>
          <Text>Reset Exercises</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
