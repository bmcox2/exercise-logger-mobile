import * as SQLite from "expo-sqlite";
import { Workout, Exercise } from "../types";

import { mockWorkouts } from "../data/mockData";

let db: SQLite.SQLiteDatabase;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync("workouts.db");
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
        reps INTEGER,
        weight REAL,
        FOREIGN KEY (workout_id) REFERENCES workouts(id)
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
`);
  await seedDatabase();
}

export async function getWorkouts(): Promise<Workout[]> {
  return await db.getAllAsync("SELECT * FROM workouts ORDER BY date DESC");
}

async function getMuscles(
  table: string,
  exerciseId: number,
): Promise<string[]> {
  const rows = await db.getAllAsync<{ muscle: string }>(
    `SELECT * FROM ${table} WHERE exercise_id = ?`,
    exerciseId,
  );
  return rows.map((row) => row.muscle);
}

async function getExercisesForWorkout(workoutId: number): Promise<Exercise[]> {
  const exerciseRows = await db.getAllAsync<Exercise>(
    "SELECT * FROM exercises WHERE workout_id = ?",
    workoutId,
  );

  const exercises: Exercise[] = [];
  for (const ex of exerciseRows) {
    const primaryMuscles = await getMuscles("primaryMuscles", ex.id);
    const secondaryMuscles = await getMuscles("secondaryMuscles", ex.id);
    exercises.push({ ...ex, primaryMuscles, secondaryMuscles } as Exercise);
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

export async function addWorkout(workout: Workout): Promise<void> {
  const workoutResult = await db.runAsync(
    "INSERT INTO workouts (name, date, durationMinutes) VALUES (?, ?, ?)",
    workout.name,
    workout.date,
    workout.durationMinutes,
  );
  const workoutId = workoutResult.lastInsertRowId;

  for (const exercise of workout.exercises) {
    const exerciseResult = await db.runAsync(
      "INSERT INTO exercises (workout_id, name, reps, weight) VALUES (?, ?, ?, ?)",
      workoutId,
      exercise.name,
      exercise.reps,
      exercise.weight,
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
  }
}

async function seedDatabase() {
  const existing = await db.getAllAsync("SELECT * FROM workouts");
  if (existing.length === 0) {
    for (const workout of mockWorkouts) {
      await addWorkout(workout);
    }
  }
}
