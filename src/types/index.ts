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
  status: "planned" | "completed";
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
  SelectExerciseForBuild: {
    onSelect: (item: ExerciseLibraryRow) => void;
    sourceWorkoutId: number;
  };
  ExerciseDetailForBuild: {
    exerciseId: number;
    onSelect: (item: ExerciseLibraryRow) => void;
    sourceWorkoutId: number;
  };
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

export interface ActiveWorkoutSet {
  id: number;
  setNumber: number;
  plannedReps: number;
  actualReps: number | null;
  plannedWeight: number;
  actualWeight: number | null;
  done: boolean;
}

export interface ActiveExercise {
  id: number;
  name: string;
  sets: ActiveWorkoutSet[];
  currentSetIndex: number;
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

export interface ActiveWorkout {
  id: number;
  name: string;
  date: string;
  durationMinutes: number;
  currentExerciseIndex: number;
  exercises: ActiveExercise[];
  status: "planned" | "completed";
}

export type StartStackParamList = {
  SelectPlannedWorkout: undefined;
};

export type ActiveWorkoutStackParamList = {
  ActiveWorkout: { workoutId: number };
  FinishWorkout: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ActiveWorkoutFlow: { workoutId: number };
};
