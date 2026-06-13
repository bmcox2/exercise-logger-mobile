export interface Exercise {
  id: number;
  name: string;
  reps: number;
  weight: number;
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

export interface Workout {
  id: number;
  name: string;
  date: string;
  durationMinutes: number;
  exercises: Exercise[];
}

export type RootStackParamList = {
  WorkoutList: undefined;
  WorkoutDetail: { workoutId: number };
};
