import {
  Workout,
  Exercise,
  WorkoutSet,
  ActiveWorkout,
  ActiveExercise,
  ActiveWorkoutSet,
  ExerciseLibraryRow,
} from "../types";

export type ActiveWorkoutAction =
  | {
      type: "UPDATE_ACTUAL";
      field: "actualReps" | "actualWeight";
      value: number | null;
    }
  | { type: "COMPLETE_SET" }
  | { type: "NAVIGATE_SET"; direction: "next" | "prev" }
  | { type: "ADD_SET" }
  | { type: "DELETE_SET" }
  | { type: "DELETE_EXERCISE" }
  | { type: "REPLACE_ALL_EXERCISE"; exercise: ExerciseLibraryRow }
  | { type: "REPLACE_EXERCISE_AT_SET"; exercise: ExerciseLibraryRow };

function toActiveWorkoutSet(set: WorkoutSet): ActiveWorkoutSet {
  return {
    id: set.id,
    setNumber: set.setNumber,
    orderIndex: set.orderIndex,
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
    primaryMuscles: [...exercise.primaryMuscles],
    secondaryMuscles: [...exercise.secondaryMuscles],
  };
}

function newTempId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function buildActiveWorkoutSet(
  setNumber: number,
  orderIndex: number,
  plannedReps: number,
  plannedWeight: number,
): ActiveWorkoutSet {
  return {
    tempId: newTempId(),
    setNumber,
    orderIndex,
    plannedReps,
    actualReps: plannedReps,
    plannedWeight,
    actualWeight: plannedWeight,
    done: false,
  };
}

function renumberSets(
  sets: ActiveWorkoutSet[],
  startAt = 1,
): ActiveWorkoutSet[] {
  return sets.map((set, index) => ({ ...set, setNumber: startAt + index }));
}

function buildActiveExerciseFromLibrary(
  item: ExerciseLibraryRow,
  sets: ActiveWorkoutSet[],
): ActiveExercise {
  return {
    tempId: newTempId(),
    name: item.name,
    sets,
    primaryMuscles: [...item.primaryMuscles],
    secondaryMuscles: [...item.secondaryMuscles],
  };
}

// Re-derives dense, contiguous orderIndex values (0..n-1) for every set in
// the workout from their current relative sort order. Insertions give the
// new set a temporary fractional orderIndex that sorts into the right
// spot; removals just need the removed set gone before calling this - in
// both cases this one pass produces clean integers with no shift math.
function renumberOrder(exercises: ActiveExercise[]): ActiveExercise[] {
  const flatSets = exercises.flatMap((ex) => ex.sets);
  const sorted = [...flatSets].sort((a, b) => a.orderIndex - b.orderIndex);
  const newOrderByRef = new Map<ActiveWorkoutSet, number>();
  sorted.forEach((set, i) => newOrderByRef.set(set, i));
  return exercises.map((ex) => ({
    ...ex,
    sets: ex.sets.map((set) => {
      const rank = newOrderByRef.get(set);
      if (rank === undefined) {
        throw new Error("renumberOrder: set missing from flatten");
      }
      return { ...set, orderIndex: rank };
    }),
  }));
}

function findSetLocation(
  exercises: ActiveExercise[],
  orderIndex: number,
): { exerciseIndex: number; setIndexInExercise: number } | null {
  for (
    let exerciseIndex = 0;
    exerciseIndex < exercises.length;
    exerciseIndex++
  ) {
    const setIndexInExercise = exercises[exerciseIndex].sets.findIndex(
      (s) => s.orderIndex === orderIndex,
    );
    if (setIndexInExercise !== -1) return { exerciseIndex, setIndexInExercise };
  }
  return null;
}

function totalSetCount(exercises: ActiveExercise[]): number {
  return exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
}

export function flattenActiveSetsByOrder(
  exercises: ActiveExercise[],
): { exercise: ActiveExercise; set: ActiveWorkoutSet }[] {
  return exercises
    .flatMap((exercise) => exercise.sets.map((set) => ({ exercise, set })))
    .sort((a, b) => a.set.orderIndex - b.set.orderIndex);
}

export function toActiveWorkout(source: Workout): ActiveWorkout {
  const exercises = source.exercises.map(toActiveExercise);
  return {
    id: source.id,
    name: source.name,
    date: source.date,
    durationMinutes: source.durationMinutes,
    currentOrderIndex: 0,
    exercises,
    status: "planned",
  };
}

function updateCurrentSet(
  workout: ActiveWorkout,
  update: (set: ActiveWorkoutSet) => ActiveWorkoutSet,
): ActiveExercise[] {
  return workout.exercises.map((exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) =>
      set.orderIndex === workout.currentOrderIndex ? update(set) : set,
    ),
  }));
}

// Shared tail for DELETE_SET/DELETE_EXERCISE: exercisesAfterRemoval has
// already had the target set/exercise taken out (and any now-empty
// exercise pruned); this just closes the resulting order gaps and clamps
// the cursor back into bounds.
function removeExerciseAndRenumber(
  workout: ActiveWorkout,
  exercisesAfterRemoval: ActiveExercise[],
): ActiveWorkout {
  if (exercisesAfterRemoval.length === 0) {
    return {
      ...workout,
      exercises: exercisesAfterRemoval,
      currentOrderIndex: 0,
    };
  }
  const exercises = renumberOrder(exercisesAfterRemoval);
  const total = totalSetCount(exercises);
  return {
    ...workout,
    exercises,
    currentOrderIndex: Math.min(workout.currentOrderIndex, Math.max(total - 1, 0)),
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
      const location = findSetLocation(
        workout.exercises,
        workout.currentOrderIndex,
      );
      if (!location) return workout;
      const currentSet =
        workout.exercises[location.exerciseIndex].sets[
          location.setIndexInExercise
        ];

      if (currentSet.done) {
        // Toggle back to not-done - the user is correcting a mistake, not
        // advancing, so stay put rather than moving anywhere.
        return {
          ...workout,
          exercises: updateCurrentSet(workout, (set) => ({
            ...set,
            done: false,
          })),
        };
      }

      const exercises = updateCurrentSet(workout, (set) => ({
        ...set,
        done: true,
      }));

      const allSetsDone = exercises.every((ex) => ex.sets.every((s) => s.done));
      if (allSetsDone) {
        return { ...workout, exercises, status: "completed" };
      }

      const nextOrderIndex = workout.currentOrderIndex + 1;
      const total = totalSetCount(exercises);
      return {
        ...workout,
        exercises,
        currentOrderIndex:
          nextOrderIndex < total ? nextOrderIndex : workout.currentOrderIndex,
      };
    }
    case "NAVIGATE_SET": {
      const delta = action.direction === "next" ? 1 : -1;
      const next = workout.currentOrderIndex + delta;
      const total = totalSetCount(workout.exercises);
      if (next < 0 || next >= total) return workout;
      return { ...workout, currentOrderIndex: next };
    }
    case "ADD_SET": {
      const location = findSetLocation(
        workout.exercises,
        workout.currentOrderIndex,
      );
      if (!location) return workout;
      const { exerciseIndex, setIndexInExercise } = location;
      const exercise = workout.exercises[exerciseIndex];
      const currentSet = exercise.sets[setIndexInExercise];

      const newSet = buildActiveWorkoutSet(
        currentSet.setNumber + 1,
        currentSet.orderIndex + 0.5,
        currentSet.plannedReps,
        currentSet.plannedWeight,
      );

      const withNewSet = workout.exercises.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        return {
          ...ex,
          sets: [
            ...ex.sets.slice(0, setIndexInExercise + 1),
            newSet,
            ...renumberSets(
              ex.sets.slice(setIndexInExercise + 1),
              currentSet.setNumber + 2,
            ),
          ],
        };
      });

      const exercises = renumberOrder(withNewSet);
      return {
        ...workout,
        exercises,
        currentOrderIndex: workout.currentOrderIndex + 1,
      };
    }
    case "DELETE_SET": {
      const location = findSetLocation(
        workout.exercises,
        workout.currentOrderIndex,
      );
      if (!location) return workout;
      const { exerciseIndex, setIndexInExercise } = location;
      const exercise = workout.exercises[exerciseIndex];
      const remainingSets = renumberSets(
        exercise.sets.filter((_, i) => i !== setIndexInExercise),
      );

      const afterRemoval = workout.exercises
        .map((ex, i) =>
          i === exerciseIndex ? { ...ex, sets: remainingSets } : ex,
        )
        .filter((ex) => ex.sets.length > 0);

      return removeExerciseAndRenumber(workout, afterRemoval);
    }
    case "DELETE_EXERCISE": {
      const location = findSetLocation(
        workout.exercises,
        workout.currentOrderIndex,
      );
      if (!location) return workout;
      const exerciseToRemove = workout.exercises[location.exerciseIndex];
      const remaining = workout.exercises.filter(
        (ex) => ex !== exerciseToRemove,
      );

      return removeExerciseAndRenumber(workout, remaining);
    }
    case "REPLACE_ALL_EXERCISE": {
      const location = findSetLocation(
        workout.exercises,
        workout.currentOrderIndex,
      );
      if (!location) return workout;
      const exerciseToReplace = workout.exercises[location.exerciseIndex];

      const newSets = exerciseToReplace.sets.map((originalSet, i) =>
        buildActiveWorkoutSet(
          i + 1,
          workout.currentOrderIndex + i * 0.01,
          originalSet.plannedReps,
          originalSet.plannedWeight,
        ),
      );
      const newExercise = buildActiveExerciseFromLibrary(
        action.exercise,
        newSets,
      );

      // Removing exerciseToReplace can free multiple (possibly
      // non-contiguous, if it was already superset-interleaved) order
      // slots while only one comes back, so currentOrderIndex can go
      // stale - find where the new set actually landed by tempId rather
      // than assuming a position.
      const remaining = workout.exercises.filter(
        (ex) => ex !== exerciseToReplace,
      );
      const exercises = renumberOrder([...remaining, newExercise]);
      const finalExercise = exercises.find(
        (ex) => ex.tempId === newExercise.tempId,
      )!;

      return {
        ...workout,
        exercises,
        currentOrderIndex: finalExercise.sets[0].orderIndex,
      };
    }
    case "REPLACE_EXERCISE_AT_SET": {
      const location = findSetLocation(
        workout.exercises,
        workout.currentOrderIndex,
      );
      if (!location) return workout;
      const { exerciseIndex, setIndexInExercise } = location;
      const exercise = workout.exercises[exerciseIndex];
      const movedSet = exercise.sets[setIndexInExercise];

      const remainingSets = renumberSets(
        exercise.sets.filter((_, i) => i !== setIndexInExercise),
      );

      // Fresh set, not a copy of movedSet: done/actuals belonged to the old
      // exercise's performance and shouldn't carry over to a new movement.
      // Reoccupies the exact vacated orderIndex - no other set's relative
      // order changes, so currentOrderIndex (== movedSet.orderIndex) is
      // still correct after renumbering, with no shift needed.
      const replacementSet = buildActiveWorkoutSet(
        1,
        movedSet.orderIndex,
        movedSet.plannedReps,
        movedSet.plannedWeight,
      );
      const replacementExercise = buildActiveExerciseFromLibrary(
        action.exercise,
        [replacementSet],
      );

      const updated = workout.exercises
        .map((ex, i) =>
          i === exerciseIndex ? { ...ex, sets: remainingSets } : ex,
        )
        .filter((ex) => ex.sets.length > 0);

      const exercises = renumberOrder([...updated, replacementExercise]);
      return { ...workout, exercises, currentOrderIndex: movedSet.orderIndex };
    }
    default:
      return workout;
  }
}
