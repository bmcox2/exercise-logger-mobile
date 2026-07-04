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

export type BuildStackParamList = {
  BuildStart: undefined;
  SelectSourceWorkout: undefined;
  SourceWorkoutDetail: { workoutId: number };
  BuildWorkout: { sourceWorkoutId: number };
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

interface Identifiable {
  id?: number;
  tempId?: string;
}

export interface DraftWorkoutSet extends Identifiable {
  setNumber: number;
  reps: number;
  weight: number;
}

export interface DraftExercise extends Identifiable {
  name: string;
  sets: DraftWorkoutSet[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

export interface DraftWorkout extends Identifiable {
  name: string;
  date: string;
  durationMinutes: number;
  exercises: DraftExercise[];
}

export type DraftAction =
  | { type: "UPDATE_WORKOUT_NAME"; name: string }
  | { type: "UPDATE_WORKOUT_DATE"; date: string }
  | { type: "ADD_EXERCISE"; exercise: DraftExercise }
  | { type: "REMOVE_EXERCISE"; exerciseTempId: string }
  | { type: "ADD_SET"; exerciseTempId: string }
  | { type: "REMOVE_SET"; exerciseTempId: string }
  | {
      type: "UPDATE_SET_FIELD";
      setTempId: string;
      field: "reps" | "weight";
      value: number;
    };
