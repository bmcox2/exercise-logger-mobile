import {
  Workout,
  DraftWorkout,
  DraftExercise,
  DraftWorkoutSet,
  DraftAction,
  ExerciseLibraryRow,
} from "../types";

function newTempId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function todayDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function createDraftExerciseFromLibraryItem(
  item: ExerciseLibraryRow,
): DraftExercise {
  return {
    tempId: newTempId(),
    name: item.name,
    primaryMuscles: [...item.primaryMuscles],
    secondaryMuscles: [...item.secondaryMuscles],
    sets: [{ tempId: newTempId(), setNumber: 1, reps: 0, weight: 0 }],
  };
}

export function cloneWorkoutAsDraft(workout: Workout): DraftWorkout {
  return {
    tempId: newTempId(),
    name: workout.name,
    date: todayDateString(),
    durationMinutes: 0,
    exercises: workout.exercises.map(
      (exercise): DraftExercise => ({
        tempId: newTempId(),
        name: exercise.name,
        primaryMuscles: [...exercise.primaryMuscles],
        secondaryMuscles: [...exercise.secondaryMuscles],
        sets: exercise.sets.map(
          (set): DraftWorkoutSet => ({
            tempId: newTempId(),
            setNumber: set.setNumber,
            reps: set.reps,
            weight: set.weight,
          }),
        ),
      }),
    ),
  };
}

export function draftReducer(draft: DraftWorkout, action: DraftAction): DraftWorkout {
  switch (action.type) {
    case "UPDATE_WORKOUT_NAME":
      return { ...draft, name: action.name };
    case "UPDATE_WORKOUT_DATE":
      return { ...draft, date: action.date };
    case "ADD_EXERCISE":
      return { ...draft, exercises: [...draft.exercises, action.exercise] };
    case "REMOVE_EXERCISE":
      return {
        ...draft,
        exercises: draft.exercises.filter(
          (exercise) => exercise.tempId !== action.exerciseTempId,
        ),
      };
    case "UPDATE_SET_FIELD":
      return {
        ...draft,
        exercises: draft.exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets.map((set) =>
            set.tempId === action.setTempId
              ? { ...set, [action.field]: action.value }
              : set,
          ),
        })),
      };
    case "ADD_SET":
      return {
        ...draft,
        exercises: draft.exercises.map((exercise) => {
          if (exercise.tempId !== action.exerciseTempId) return exercise;
          const lastSet = exercise.sets[exercise.sets.length - 1];
          const newSet = {
            tempId: newTempId(),
            setNumber: lastSet ? lastSet.setNumber + 1 : 1,
            reps: lastSet ? lastSet.reps : 0,
            weight: lastSet ? lastSet.weight : 0,
          };

          return { ...exercise, sets: [...exercise.sets, newSet] };
        }),
      };
    case "REMOVE_SET":
      return {
        ...draft,
        exercises: draft.exercises.map((exercise) => {
          if (exercise.tempId !== action.exerciseTempId) return exercise;
          return { ...exercise, sets: exercise.sets.slice(0, -1) };
        }),
      };
    default:
      return draft;
  }
}
