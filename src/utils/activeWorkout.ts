import {
  Workout,
  Exercise,
  WorkoutSet,
  ActiveWorkout,
  ActiveExercise,
  ActiveWorkoutSet,
} from "../types";

export type ActiveWorkoutAction =
  | {
      type: "UPDATE_ACTUAL";
      field: "actualReps" | "actualWeight";
      value: number | null;
    }
  | { type: "COMPLETE_SET" }
  | { type: "NAVIGATE_SET"; direction: "next" | "prev" };

function toActiveWorkoutSet(set: WorkoutSet): ActiveWorkoutSet {
  return {
    id: set.id,
    setNumber: set.setNumber,
    plannedReps: set.reps,
    actualReps: set.reps,
    plannedWeight: set.weight,
    actualWeight: set.weight,
    done: false,
  };
}

function toActiveExercise(exercise: Exercise): ActiveExercise {
  return {
    id: exercise.id,
    name: exercise.name,
    sets: exercise.sets.map(toActiveWorkoutSet),
    currentSetIndex: 0,
    primaryMuscles: [...exercise.primaryMuscles],
    secondaryMuscles: [...exercise.secondaryMuscles],
  };
}

export function findNonEmptyExercise(
  exercises: ActiveExercise[],
  fromIndex: number,
  step: 1 | -1,
): number | null {
  for (let i = fromIndex; i >= 0 && i < exercises.length; i += step) {
    if (exercises[i].sets.length > 0) return i;
  }
  return null;
}

export function toActiveWorkout(source: Workout): ActiveWorkout {
  const exercises = source.exercises.map(toActiveExercise);
  return {
    id: source.id,
    name: source.name,
    date: source.date,
    durationMinutes: source.durationMinutes,
    currentExerciseIndex: findNonEmptyExercise(exercises, 0, 1) ?? 0,
    exercises,
    status: "planned",
  };
}

function updateCurrentSet(
  workout: ActiveWorkout,
  update: (set: ActiveWorkoutSet) => ActiveWorkoutSet,
): ActiveExercise[] {
  return workout.exercises.map((exercise, exerciseIndex) => {
    if (exerciseIndex !== workout.currentExerciseIndex) return exercise;
    return {
      ...exercise,
      sets: exercise.sets.map((set, setIndex) =>
        setIndex === exercise.currentSetIndex ? update(set) : set,
      ),
    };
  });
}

function moveToAdjacentSet(
  workout: ActiveWorkout,
  direction: "next" | "prev",
): ActiveWorkout {
  const exerciseIndex = workout.currentExerciseIndex;
  const exercise = workout.exercises[exerciseIndex];

  if (direction === "next") {
    if (exercise.currentSetIndex < exercise.sets.length - 1) {
      return {
        ...workout,
        exercises: workout.exercises.map((ex, index) =>
          index === exerciseIndex
            ? { ...ex, currentSetIndex: ex.currentSetIndex + 1 }
            : ex,
        ),
      };
    }
    const nextExerciseIndex = findNonEmptyExercise(
      workout.exercises,
      exerciseIndex + 1,
      1,
    );
    if (nextExerciseIndex === null) return workout;
    return {
      ...workout,
      currentExerciseIndex: nextExerciseIndex,
      exercises: workout.exercises.map((ex, index) =>
        index === nextExerciseIndex ? { ...ex, currentSetIndex: 0 } : ex,
      ),
    };
  }

  if (exercise.currentSetIndex > 0) {
    return {
      ...workout,
      exercises: workout.exercises.map((ex, index) =>
        index === exerciseIndex
          ? { ...ex, currentSetIndex: ex.currentSetIndex - 1 }
          : ex,
      ),
    };
  }
  const prevExerciseIndex = findNonEmptyExercise(
    workout.exercises,
    exerciseIndex - 1,
    -1,
  );
  if (prevExerciseIndex === null) return workout;
  const prevExercise = workout.exercises[prevExerciseIndex];
  return {
    ...workout,
    currentExerciseIndex: prevExerciseIndex,
    exercises: workout.exercises.map((ex, index) =>
      index === prevExerciseIndex
        ? { ...ex, currentSetIndex: prevExercise.sets.length - 1 }
        : ex,
    ),
  };
}

export function activeWorkoutReducer(
  workout: ActiveWorkout,
  action: ActiveWorkoutAction,
): ActiveWorkout {
  switch (action.type) {
    case "UPDATE_ACTUAL":
      return {
        ...workout,
        exercises: updateCurrentSet(workout, (set) => ({
          ...set,
          [action.field]: action.value,
          done: false,
        })),
      };
    case "COMPLETE_SET": {
      const exercises = updateCurrentSet(workout, (set) => ({
        ...set,
        done: true,
      }));

      const allSetsDone = exercises.every((ex) =>
        ex.sets.every((s) => s.done),
      );
      if (allSetsDone) {
        return { ...workout, exercises, status: "completed" };
      }

      const exercise = exercises[workout.currentExerciseIndex];
      const isLastSet = exercise.currentSetIndex === exercise.sets.length - 1;

      if (!isLastSet) {
        return {
          ...workout,
          exercises: exercises.map((ex, index) =>
            index === workout.currentExerciseIndex
              ? { ...ex, currentSetIndex: ex.currentSetIndex + 1 }
              : ex,
          ),
        };
      }

      const nextExerciseIndex = findNonEmptyExercise(
        exercises,
        workout.currentExerciseIndex + 1,
        1,
      );
      if (nextExerciseIndex === null) {
        // Nothing left to advance to positionally, but some set elsewhere is
        // still incomplete (allSetsDone was false) — stay put.
        return { ...workout, exercises };
      }

      return {
        ...workout,
        currentExerciseIndex: nextExerciseIndex,
        exercises: exercises.map((ex, index) =>
          index === nextExerciseIndex ? { ...ex, currentSetIndex: 0 } : ex,
        ),
      };
    }
    case "NAVIGATE_SET":
      return moveToAdjacentSet(workout, action.direction);
    default:
      return workout;
  }
}
