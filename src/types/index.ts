export interface WorkoutSet {
  id: number;
  setNumber: number;
  reps: number;
  weight: number;
}

export interface Exercise {
  id: number;
  name: string;
  sets: WorkoutSet[];
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
