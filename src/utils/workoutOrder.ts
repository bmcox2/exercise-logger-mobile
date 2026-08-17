import { Exercise, WorkoutSet } from "../types";

export function flattenSetsByOrder(
  exercises: Exercise[],
): { exercise: Exercise; set: WorkoutSet }[] {
  return exercises
    .flatMap((exercise) => exercise.sets.map((set) => ({ exercise, set })))
    .sort((a, b) => a.set.orderIndex - b.set.orderIndex);
}
