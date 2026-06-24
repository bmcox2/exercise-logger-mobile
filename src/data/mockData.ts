import { Workout } from "../types";

export const mockWorkouts: Workout[] = [
  {
    id: 0,
    name: "Pull",
    date: "2026-06-10",
    durationMinutes: 53,
    exercises: [
      {
        id: 0,
        name: "Lat Pull-down",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 100 },
          { id: 0, setNumber: 2, reps: 8, weight: 115 },
          { id: 0, setNumber: 3, reps: 8, weight: 115 },
          { id: 0, setNumber: 4, reps: 7, weight: 115 },
        ],
        primaryMuscles: ["lats"],
        secondaryMuscles: ["biceps", "rear delts"],
      },
      {
        id: 0,
        name: "Seated Cable Row",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 115 },
          { id: 0, setNumber: 2, reps: 8, weight: 130 },
          { id: 0, setNumber: 3, reps: 7, weight: 130 },
        ],
        primaryMuscles: ["lats", "rhomboids"],
        secondaryMuscles: ["biceps", "rear delts"],
      },
      {
        id: 0,
        name: "Face Pull",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 60 },
          { id: 0, setNumber: 2, reps: 12, weight: 50 },
          { id: 0, setNumber: 3, reps: 12, weight: 50 },
        ],
        primaryMuscles: ["rear delts"],
        secondaryMuscles: ["traps", "external rotators"],
      },
      {
        id: 0,
        name: "Chest Supported Dumbbell Row",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 25 },
          { id: 0, setNumber: 2, reps: 12, weight: 35 },
          { id: 0, setNumber: 3, reps: 10, weight: 45 },
        ],
        primaryMuscles: ["lats", "rhomboids"],
        secondaryMuscles: ["biceps", "rear delts"],
      },
      {
        id: 0,
        name: "Barbell Biceps Curl",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 50 },
          { id: 0, setNumber: 2, reps: 8, weight: 60 },
          { id: 0, setNumber: 3, reps: 8, weight: 60 },
        ],
        primaryMuscles: ["biceps"],
        secondaryMuscles: ["brachialis", "forearms"],
      },
      {
        id: 0,
        name: "Dumbbell Hammer Curl",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 20 },
          { id: 0, setNumber: 2, reps: 7, weight: 25 },
          { id: 0, setNumber: 3, reps: 7, weight: 25 },
        ],
        primaryMuscles: ["brachialis"],
        secondaryMuscles: ["biceps", "forearms"],
      },
    ],
  },
  {
    id: 0,
    name: "Push",
    date: "2026-06-08",
    durationMinutes: 60,
    exercises: [
      {
        id: 0,
        name: "Dumbbell Bench Press",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 45 },
          { id: 0, setNumber: 2, reps: 8, weight: 50 },
          { id: 0, setNumber: 3, reps: 8, weight: 55 },
          { id: 0, setNumber: 4, reps: 11, weight: 55 },
        ],
        primaryMuscles: ["chest"],
        secondaryMuscles: ["triceps", "front delts"],
      },
      {
        id: 0,
        name: "Shoulder Press",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 58 },
          { id: 0, setNumber: 2, reps: 8, weight: 78 },
          { id: 0, setNumber: 3, reps: 10, weight: 98 },
        ],
        primaryMuscles: ["front delts"],
        secondaryMuscles: ["triceps", "upper chest"],
      },
      {
        id: 0,
        name: "Incline Dumbbell Bench Press",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 40 },
          { id: 0, setNumber: 2, reps: 8, weight: 45 },
          { id: 0, setNumber: 3, reps: 8, weight: 45 },
        ],
        primaryMuscles: ["upper chest"],
        secondaryMuscles: ["front delts", "triceps"],
      },
      {
        id: 0,
        name: "Seated Lateral Raise",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 28 },
          { id: 0, setNumber: 2, reps: 12, weight: 48 },
          { id: 0, setNumber: 3, reps: 15, weight: 78 },
        ],
        primaryMuscles: ["lateral delts"],
        secondaryMuscles: ["traps"],
      },
      {
        id: 0,
        name: "Dumbbell Fly",
        sets: [{ id: 0, setNumber: 1, reps: 10, weight: 25 }],
        primaryMuscles: ["chest"],
        secondaryMuscles: ["front delts"],
      },
      {
        id: 0,
        name: "Cable Crossover",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 125 },
          { id: 0, setNumber: 2, reps: 10, weight: 125 },
        ],
        primaryMuscles: ["chest"],
        secondaryMuscles: ["front delts"],
      },
      {
        id: 0,
        name: "Triceps Press-down",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 40 },
          { id: 0, setNumber: 2, reps: 10, weight: 50 },
          { id: 0, setNumber: 3, reps: 8, weight: 50 },
        ],
        primaryMuscles: ["triceps"],
        secondaryMuscles: [],
      },
      {
        id: 0,
        name: "Overhead Dumbbell Triceps Extension",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 30 },
          { id: 0, setNumber: 2, reps: 10, weight: 30 },
          { id: 0, setNumber: 3, reps: 10, weight: 30 },
        ],
        primaryMuscles: ["triceps"],
        secondaryMuscles: [],
      },
    ],
  },
];
