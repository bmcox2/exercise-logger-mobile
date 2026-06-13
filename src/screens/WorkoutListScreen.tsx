import { View, Text } from "react-native";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = NativeStackScreenProps<RootStackParamList, "WorkoutList">;

export default function WorkoutListScreen({ navigation }: Props) {
  return (
    <View className="flex-1 bg-blue-500 items-center justify-center">
      <Text className="text-white text-2xl font-bold">Workout List</Text>
    </View>
  );
}
