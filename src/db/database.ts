import * as SQLite from "expo-sqlite";
import {
  Workout,
  Exercise,
  WorkoutSet,
  ExerciseLibraryItem,
  ExerciseLibraryRow,
  DraftWorkout,
  ActiveWorkout,
} from "../types";

import { mockWorkouts } from "../data/mockData";

import exerciseData from "../../assets/exercises.json";

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync("workouts_v7.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        durationMinutes INTEGER,
        status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        orderIndex INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (workout_id) REFERENCES workouts(id)
    );

    CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id INTEGER NOT NULL,
        setNumber INTEGER NOT NULL,
        orderIndex INTEGER NOT NULL DEFAULT 0,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
        note TEXT,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS primaryMuscles (
        exercise_id INTEGER NOT NULL,
        muscle TEXT NOT NULL,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS secondaryMuscles (
        exercise_id INTEGER NOT NULL,
        muscle TEXT NOT NULL,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id)
    );

    CREATE TABLE IF NOT EXISTS exerciseLibrary (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        equipment TEXT,
        category TEXT
    );

    CREATE TABLE IF NOT EXISTS libraryPrimaryMuscles (
        exercise_library_id INTEGER NOT NULL,
        muscle TEXT NOT NULL,
        FOREIGN KEY (exercise_library_id) REFERENCES exerciseLibrary(id)
    );

    CREATE TABLE IF NOT EXISTS librarySecondaryMuscles (
        exercise_library_id INTEGER NOT NULL,
        muscle TEXT NOT NULL,
        FOREIGN KEY (exercise_library_id) REFERENCES exerciseLibrary(id)
    );
`);
  await seedDatabase();
}

export async function getWorkouts(
  filter: "planned" | "completed" | "all",
): Promise<Workout[]> {
  if (filter === "all") {
    return await db.getAllAsync(`SELECT * FROM workouts ORDER BY date DESC `);
  }
  return await db.getAllAsync(
    "SELECT * FROM workouts WHERE status = ? ORDER BY date DESC ",
    filter,
  );
}

async function getMuscles(
  table: string,
  column: string,
  id: number,
): Promise<string[]> {
  const rows = await db.getAllAsync<{ muscle: string }>(
    `SELECT * FROM ${table} WHERE ${column} = ?`,
    id,
  );
  return rows.map((row) => row.muscle);
}

async function getSetsForExercise(exerciseId: number): Promise<WorkoutSet[]> {
  return db.getAllAsync<WorkoutSet>(
    "SELECT * FROM sets WHERE exercise_id = ? ORDER BY orderIndex ASC",
    exerciseId,
  );
}

async function getExercisesForWorkout(workoutId: number): Promise<Exercise[]> {
  const exerciseRows = await db.getAllAsync<Exercise>(
    "SELECT * FROM exercises WHERE workout_id = ? ORDER BY orderIndex ASC, id ASC",
    workoutId,
  );

  const exercises: Exercise[] = [];
  for (const ex of exerciseRows) {
    const primaryMuscles = await getMuscles(
      "primaryMuscles",
      "exercise_id",
      ex.id,
    );
    const secondaryMuscles = await getMuscles(
      "secondaryMuscles",
      "exercise_id",
      ex.id,
    );
    const sets = await getSetsForExercise(ex.id);
    exercises.push({ ...ex, primaryMuscles, secondaryMuscles, sets });
  }
  return exercises;
}

export async function getWorkoutById(id: number): Promise<Workout | null> {
  const workout = await db.getFirstAsync<Workout>(
    "SELECT * FROM workouts WHERE id = ?",
    id,
  );
  if (workout === null) return null;

  const exercises = await getExercisesForWorkout(id);
  return { ...workout, exercises } as Workout;
}

export async function addWorkout(
  workout: DraftWorkout,
  status: "planned" | "completed",
): Promise<number> {
  let newWorkoutId = 0;
  await db.withTransactionAsync(async () => {
    const workoutResult = await db.runAsync(
      "INSERT INTO workouts (name, date, durationMinutes, status) VALUES (?, ?, ?, ?)",
      workout.name,
      workout.date,
      workout.durationMinutes,
      status,
    );
    newWorkoutId = workoutResult.lastInsertRowId;

    let setOrderIndex = 0;
    for (
      let orderIndex = 0;
      orderIndex < workout.exercises.length;
      orderIndex++
    ) {
      const exercise = workout.exercises[orderIndex];
      const exerciseResult = await db.runAsync(
        "INSERT INTO exercises (workout_id, name, orderIndex) VALUES (?, ?, ?)",
        newWorkoutId,
        exercise.name,
        orderIndex,
      );
      const exerciseId = exerciseResult.lastInsertRowId;

      for (const muscle of exercise.primaryMuscles) {
        await db.runAsync(
          "INSERT INTO primaryMuscles (exercise_id, muscle) VALUES (?, ?)",
          exerciseId,
          muscle,
        );
      }
      for (const muscle of exercise.secondaryMuscles) {
        await db.runAsync(
          "INSERT INTO secondaryMuscles (exercise_id, muscle) VALUES (?, ?)",
          exerciseId,
          muscle,
        );
      }
      for (const set of exercise.sets) {
        await db.runAsync(
          "INSERT INTO sets (exercise_id, setNumber, reps, weight, orderIndex, note) VALUES (?, ?, ?, ?, ?, ?)",
          exerciseId,
          set.setNumber,
          set.reps,
          set.weight,
          setOrderIndex,
          null,
        );
        setOrderIndex++;
      }
    }
  });
  return newWorkoutId;
}

export async function completeWorkout(
  workout: ActiveWorkout,
  durationMinutes: number,
): Promise<void> {
  await db.withTransactionAsync(async () => {
    const original = await getWorkoutById(workout.id);
    if (!original) return;
    const originalSetIds: number[] = [];
    for (const exercise of original.exercises) {
      for (const set of exercise.sets) {
        originalSetIds.push(set.id);
      }
    }

    const currentSetIds: number[] = [];
    for (const exercise of workout.exercises) {
      for (const set of exercise.sets) {
        if (set.id === undefined) continue;
        currentSetIds.push(set.id);
      }
    }

    for (const id of originalSetIds) {
      if (!currentSetIds.includes(id)) {
        await db.runAsync("DELETE FROM sets WHERE id = ?", id);
      }
    }

    const originalExerciseIds: number[] = [];
    for (const exercise of original.exercises) {
      originalExerciseIds.push(exercise.id);
    }

    const currentExerciseIds: number[] = [];
    for (const exercise of workout.exercises) {
      if (exercise.id === undefined) continue;
      currentExerciseIds.push(exercise.id);
    }

    for (const id of originalExerciseIds) {
      if (!currentExerciseIds.includes(id)) {
        await db.runAsync("DELETE FROM exercises WHERE id = ?", id);
      }
    }
    await db.runAsync(
      "UPDATE workouts SET durationMinutes = ?, status = ? WHERE id = ?",
      durationMinutes,
      "completed",
      workout.id,
    );

    for (const exercise of workout.exercises) {
      if (exercise.sets.length === 0) {
        throw new Error("completeWorkout: exercise with no sets");
      }
      const exerciseOrderIndex = Math.min(
        ...exercise.sets.map((s) => s.orderIndex),
      );
      let exerciseId = exercise.id;

      if (exerciseId === undefined) {
        const exerciseResult = await db.runAsync(
          "INSERT INTO exercises (workout_id, name, orderIndex) VALUES (?, ?, ?)",
          workout.id,
          exercise.name,
          exerciseOrderIndex,
        );
        exerciseId = exerciseResult.lastInsertRowId;

        for (const muscle of exercise.primaryMuscles) {
          await db.runAsync(
            "INSERT INTO primaryMuscles (exercise_id, muscle) VALUES (?, ?)",
            exerciseId,
            muscle,
          );
        }
        for (const muscle of exercise.secondaryMuscles) {
          await db.runAsync(
            "INSERT INTO secondaryMuscles (exercise_id, muscle) VALUES (?, ?)",
            exerciseId,
            muscle,
          );
        }
      } else {
        await db.runAsync(
          "UPDATE exercises SET orderIndex = ? WHERE id = ?",
          exerciseOrderIndex,
          exerciseId,
        );
      }

      for (const set of exercise.sets) {
        if (set.id !== undefined) {
          await db.runAsync(
            "UPDATE sets SET reps = ?, weight = ?, exercise_id = ?, setNumber = ?, orderIndex = ?, note = ? WHERE id = ?",
            set.actualReps,
            set.actualWeight,
            exerciseId,
            set.setNumber,
            set.orderIndex,
            set.note,
            set.id,
          );
        } else {
          await db.runAsync(
            "INSERT INTO sets (exercise_id, setNumber, reps, weight, orderIndex, note) VALUES (?, ?, ?, ?, ?, ?)",
            exerciseId,
            set.setNumber,
            set.actualReps,
            set.actualWeight,
            set.orderIndex,
            set.note,
          );
        }
      }
    }
  });
}

async function addExerciseData(exercise: ExerciseLibraryItem): Promise<void> {
  const result = await db.runAsync(
    "INSERT INTO exerciseLibrary (name, description, equipment, category) VALUES (?, ?, ?, ?)",
    exercise.name,
    exercise.instructions.join(" "),
    exercise.equipment,
    exercise.category,
  );
  const exerciseId = result.lastInsertRowId;

  for (const muscle of exercise.primaryMuscles) {
    await db.runAsync(
      "INSERT INTO libraryPrimaryMuscles (exercise_library_id, muscle) VALUES (?, ?)",
      exerciseId,
      muscle,
    );
  }
  for (const muscle of exercise.secondaryMuscles) {
    await db.runAsync(
      "INSERT INTO librarySecondaryMuscles (exercise_library_id, muscle) VALUES (?, ?)",
      exerciseId,
      muscle,
    );
  }
}

async function seedDatabase() {
  const existingWorkouts = await db.getAllAsync("SELECT * FROM workouts");
  if (existingWorkouts.length === 0) {
    for (const workout of mockWorkouts) {
      await addWorkout(workout, workout.status);
    }
  }

  const existingExerciseLibrary = await db.getAllAsync(
    "SELECT * FROM exerciseLibrary",
  );
  if (existingExerciseLibrary.length === 0) {
    await db.withTransactionAsync(async () => {
      for (const exercise of exerciseData) {
        await addExerciseData(exercise);
      }
    });
  }
}

export async function searchExerciseLibraryByName(
  input: string,
): Promise<ExerciseLibraryRow[]> {
  const results = await db.getAllAsync<ExerciseLibraryRow>(
    "SELECT * FROM exerciseLibrary WHERE LOWER(name) LIKE LOWER(?)",
    `%${input}%`,
  );
  const ids = results.map((exercise) => exercise.id);
  if (ids.length === 0) return [];

  const placeholders = ids.map(() => "?").join(", ");
  const primaryQuery = `SELECT * FROM libraryPrimaryMuscles WHERE exercise_library_id IN (${placeholders})`;
  const secondaryQuery = `SELECT * FROM librarySecondaryMuscles WHERE exercise_library_id IN (${placeholders})`;
  const primaryMuscles = await db.getAllAsync<{
    exercise_library_id: number;
    muscle: string;
  }>(primaryQuery, ...ids);
  const secondaryMuscles = await db.getAllAsync<{
    exercise_library_id: number;
    muscle: string;
  }>(secondaryQuery, ...ids);

  for (const exercise of results) {
    exercise.primaryMuscles = primaryMuscles
      .filter((muscle) => muscle.exercise_library_id === exercise.id)
      .map((muscle) => muscle.muscle);
    exercise.secondaryMuscles = secondaryMuscles
      .filter((muscle) => muscle.exercise_library_id === exercise.id)
      .map((muscle) => muscle.muscle);
  }

  return results;
}

export async function getExerciseById(
  id: number,
): Promise<ExerciseLibraryRow | null> {
  const exercise = await db.getFirstAsync<ExerciseLibraryRow>(
    "SELECT * FROM ExerciseLibrary WHERE id = ?",
    id,
  );
  if (exercise === null) return null;

  const primaryMuscles = await getMuscles(
    "libraryPrimaryMuscles",
    "exercise_library_id",
    id,
  );
  const secondaryMuscles = await getMuscles(
    "librarySecondaryMuscles",
    "exercise_library_id",
    id,
  );
  return {
    ...exercise,
    primaryMuscles,
    secondaryMuscles,
  } as ExerciseLibraryRow;
}
