import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import WorkoutListScreen from "./src/screens/WorkoutListScreen";
import WorkoutDetailScreen from "./src/screens/WorkoutDetailScreen";
import ExerciseLibraryScreen from "./src/screens/ExerciseLibraryScreen";
import ExerciseDetailScreen from "./src/screens/ExerciseDetailScreen";
import BuildStartScreen from "./src/screens/BuildStartScreen";
import SelectSourceWorkoutScreen from "./src/screens/SelectSourceWorkoutScreen";
import BuildWorkoutScreen from "./src/screens/BuildWorkoutScreen";
import SourceWorkoutDetailScreen from "./src/screens/SourceWorkoutDetailScreen";
import { WorkoutsStackParamList, LibraryStackParamList, BuildStackParamList } from "./src/types";
import { initDatabase } from "./src/db/database";

const Tab = createBottomTabNavigator();
const WorkoutsStack = createNativeStackNavigator<WorkoutsStackParamList>();
const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();
const BuildStack = createNativeStackNavigator<BuildStackParamList>();

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function init() {
      await initDatabase();
      setDbReady(true);
    }
    init();
  }, []);

  if (!dbReady) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="WorkoutsTab">
          {() => (
            <WorkoutsStack.Navigator>
              <WorkoutsStack.Screen
                name="WorkoutList"
                component={WorkoutListScreen}
              />
              <WorkoutsStack.Screen
                name="WorkoutDetail"
                component={WorkoutDetailScreen}
              />
            </WorkoutsStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="LibraryTab">
          {() => (
            <LibraryStack.Navigator>
              <LibraryStack.Screen
                name="ExerciseLibrary"
                component={ExerciseLibraryScreen}
              />
              <LibraryStack.Screen
                name="ExerciseDetail"
                component={ExerciseDetailScreen}
              />
            </LibraryStack.Navigator>
          )}
        </Tab.Screen>
        <Tab.Screen name="BuildTab">
          {() => (
            <BuildStack.Navigator>
              <BuildStack.Screen
                name="BuildStart"
                component={BuildStartScreen}
              />
              <BuildStack.Screen
                name="SelectSourceWorkout"
                component={SelectSourceWorkoutScreen}
              />
              <BuildStack.Screen
                name="SourceWorkoutDetail"
                component={SourceWorkoutDetailScreen}
              />
              <BuildStack.Screen
                name="BuildWorkout"
                component={BuildWorkoutScreen}
              />
            </BuildStack.Navigator>
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
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
