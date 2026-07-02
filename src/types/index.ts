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

export type WorkoutsStackParamList = {
  WorkoutList: undefined;
  WorkoutDetail: { workoutId: number };
};

export type LibraryStackParamList = {
  ExerciseLibrary: undefined;
  ExerciseDetail: { exerciseId: number };
};

export interface ExerciseLibraryItem {
  name: string;
  instructions: string[];
  equipment: string | null;
  category: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

export interface ExerciseLibraryRow {
  id: number;
  name: string;
  description: string;
  equipment: string | null;
  category: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
}
