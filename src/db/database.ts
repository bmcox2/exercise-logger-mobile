import * as SQLite from "expo-sqlite";
import {
  Workout,
  Exercise,
  WorkoutSet,
  ExerciseLibraryItem,
  ExerciseLibraryRow,
} from "../types";

import { mockWorkouts } from "../data/mockData";

import exerciseData from "../../assets/exercises.json";

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync("workouts_v3.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        durationMinutes INTEGER
    );

    CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (workout_id) REFERENCES workouts(id)
    );

    CREATE TABLE IF NOT EXISTS sets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_id INTEGER NOT NULL,
        setNumber INTEGER NOT NULL,
        reps INTEGER NOT NULL,
        weight REAL NOT NULL,
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

export async function getWorkouts(): Promise<Workout[]> {
  return await db.getAllAsync("SELECT * FROM workouts ORDER BY date DESC");
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
    "SELECT * FROM sets WHERE exercise_id = ? ORDER BY setNumber ASC",
    exerciseId,
  );
}

async function getExercisesForWorkout(workoutId: number): Promise<Exercise[]> {
  const exerciseRows = await db.getAllAsync<Exercise>(
    "SELECT * FROM exercises WHERE workout_id = ?",
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

async function addWorkout(workout: Workout): Promise<void> {
  await db.withTransactionAsync(async () => {
    const workoutResult = await db.runAsync(
      "INSERT INTO workouts (name, date, durationMinutes) VALUES (?, ?, ?)",
      workout.name,
      workout.date,
      workout.durationMinutes,
    );
    const workoutId = workoutResult.lastInsertRowId;

    for (const exercise of workout.exercises) {
      const exerciseResult = await db.runAsync(
        "INSERT INTO exercises (workout_id, name) VALUES (?, ?)",
        workoutId,
        exercise.name,
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
          "INSERT INTO sets (exercise_id, setNumber, reps, weight) VALUES (?, ?, ?, ?)",
          exerciseId,
          set.setNumber,
          set.reps,
          set.weight,
        );
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
      await addWorkout(workout);
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
