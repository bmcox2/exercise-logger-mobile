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
import SelectExerciseForBuildScreen from "./src/screens/SelectExerciseForBuildScreen";
import ExerciseDetailForBuildScreen from "./src/screens/ExerciseDetailForBuildScreen";
import SelectPlannedWorkoutScreen from "./src/screens/SelectPlannedWorkoutScreen";
import ActiveWorkoutScreen from "./src/screens/ActiveWorkoutScreen";
import FinishWorkoutScreen from "./src/screens/FinishWorkoutScreen";
import {
  WorkoutsStackParamList,
  LibraryStackParamList,
  BuildStackParamList,
  StartStackParamList,
  ActiveWorkoutStackParamList,
  RootStackParamList,
} from "./src/types";
import { initDatabase } from "./src/db/database";

const Root = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const WorkoutsStack = createNativeStackNavigator<WorkoutsStackParamList>();
const LibraryStack = createNativeStackNavigator<LibraryStackParamList>();
const BuildStack = createNativeStackNavigator<BuildStackParamList>();
const StartStack = createNativeStackNavigator<StartStackParamList>();
const ActiveWorkoutStack = createNativeStackNavigator<ActiveWorkoutStackParamList>();

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
      <Root.Navigator screenOptions={{ headerShown: false }}>
        <Root.Screen name="MainTabs">
          {() => (
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
                    <BuildStack.Screen
                      name="SelectExerciseForBuild"
                      component={SelectExerciseForBuildScreen}
                    />
                    <BuildStack.Screen
                      name="ExerciseDetailForBuild"
                      component={ExerciseDetailForBuildScreen}
                    />
                  </BuildStack.Navigator>
                )}
              </Tab.Screen>
              <Tab.Screen name="StartTab">
                {() => (
                  <StartStack.Navigator>
                    <StartStack.Screen
                      name="SelectPlannedWorkout"
                      component={SelectPlannedWorkoutScreen}
                    />
                  </StartStack.Navigator>
                )}
              </Tab.Screen>
            </Tab.Navigator>
          )}
        </Root.Screen>
        <Root.Screen
          name="ActiveWorkoutFlow"
          options={{ gestureEnabled: false }}
        >
          {({ route }) => (
            <ActiveWorkoutStack.Navigator
              screenOptions={{ gestureEnabled: false }}
            >
              <ActiveWorkoutStack.Screen
                name="ActiveWorkout"
                component={ActiveWorkoutScreen}
                initialParams={{ workoutId: route.params.workoutId }}
              />
              <ActiveWorkoutStack.Screen
                name="FinishWorkout"
                component={FinishWorkoutScreen}
              />
            </ActiveWorkoutStack.Navigator>
          )}
        </Root.Screen>
      </Root.Navigator>
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
