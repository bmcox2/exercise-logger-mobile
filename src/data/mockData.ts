import { Workout } from "../types";

export const mockWorkouts: Workout[] = [
  // ── 2026-07-01 · Pull ──────────────────────────────────────────────────────
  {
    id: 9,
    name: "Pull",
    date: "2026-07-01",
    durationMinutes: 59,
    exercises: [
      {
        id: 0,
        name: "Lat Pull-down",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 100 },
          { id: 0, setNumber: 2, reps: 10, weight: 100 },
          { id: 0, setNumber: 3, reps: 8, weight: 115 },
          { id: 0, setNumber: 4, reps: 8, weight: 115 },
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
          { id: 0, setNumber: 3, reps: 8, weight: 130 },
        ],
        primaryMuscles: ["lats", "rhomboids"],
        secondaryMuscles: ["biceps", "rear delts"],
      },
      {
        id: 0,
        name: "Face Pull",
        sets: [
          { id: 0, setNumber: 1, reps: 15, weight: 60 },
          { id: 0, setNumber: 2, reps: 12, weight: 60 },
          { id: 0, setNumber: 3, reps: 12, weight: 70 },
        ],
        primaryMuscles: ["rear delts"],
        secondaryMuscles: ["traps", "external rotators"],
      },
      {
        id: 0,
        name: "Chest Supported Row",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 70 },
          { id: 0, setNumber: 2, reps: 8, weight: 90 },
          { id: 0, setNumber: 3, reps: 8, weight: 90 },
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
        name: "Incline Dumbbell Biceps Curl",
        sets: [
          { id: 0, setNumber: 1, reps: 5, weight: 20 },
          { id: 0, setNumber: 2, reps: 7, weight: 20 },
          { id: 0, setNumber: 3, reps: 8, weight: 15 },
        ],
        primaryMuscles: ["biceps"],
        secondaryMuscles: ["brachialis"],
      },
      {
        id: 0,
        name: "Cable Biceps Curl",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 70 },
          { id: 0, setNumber: 2, reps: 6, weight: 80 },
        ],
        primaryMuscles: ["biceps"],
        secondaryMuscles: ["brachialis", "forearms"],
      },
    ],
  },

  // ── 2026-06-30 · Push ──────────────────────────────────────────────────────
  {
    id: 8,
    name: "Push",
    date: "2026-06-30",
    durationMinutes: 65,
    exercises: [
      {
        id: 0,
        name: "Dumbbell Bench Press",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 50 },
          { id: 0, setNumber: 2, reps: 8, weight: 55 },
          { id: 0, setNumber: 3, reps: 8, weight: 60 },
          { id: 0, setNumber: 4, reps: 7, weight: 60 },
        ],
        primaryMuscles: ["chest"],
        secondaryMuscles: ["triceps", "front delts"],
      },
      {
        id: 0,
        name: "Shoulder Press",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 78 },
          { id: 0, setNumber: 2, reps: 8, weight: 98 },
          { id: 0, setNumber: 3, reps: 6, weight: 118 },
        ],
        primaryMuscles: ["front delts"],
        secondaryMuscles: ["triceps", "upper chest"],
      },
      {
        id: 0,
        name: "Incline Dumbbell Bench Press",
        sets: [
          { id: 0, setNumber: 1, reps: 8, weight: 45 },
          { id: 0, setNumber: 2, reps: 8, weight: 45 },
          { id: 0, setNumber: 3, reps: 7, weight: 45 },
        ],
        primaryMuscles: ["upper chest"],
        secondaryMuscles: ["front delts", "triceps"],
      },
      {
        id: 0,
        name: "Pec Deck",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 105 },
          { id: 0, setNumber: 2, reps: 10, weight: 125 },
          { id: 0, setNumber: 3, reps: 7, weight: 125 },
        ],
        primaryMuscles: ["chest"],
        secondaryMuscles: ["front delts"],
      },
      {
        id: 0,
        name: "Seated Lateral Raise",
        sets: [
          { id: 0, setNumber: 1, reps: 15, weight: 78 },
          { id: 0, setNumber: 2, reps: 15, weight: 98 },
          { id: 0, setNumber: 3, reps: 12, weight: 118 },
        ],
        primaryMuscles: ["lateral delts"],
        secondaryMuscles: ["traps"],
      },
      {
        id: 0,
        name: "Triceps Press-down",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 40 },
          { id: 0, setNumber: 2, reps: 7, weight: 50 },
          { id: 0, setNumber: 3, reps: 10, weight: 40 },
        ],
        primaryMuscles: ["triceps"],
        secondaryMuscles: [],
      },
      {
        id: 0,
        name: "Overhead Dumbbell Triceps Extension",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 30 },
          { id: 0, setNumber: 2, reps: 8, weight: 30 },
          { id: 0, setNumber: 3, reps: 7, weight: 35 },
        ],
        primaryMuscles: ["triceps"],
        secondaryMuscles: [],
      },
    ],
  },

  // ── 2026-06-23 · Legs ─────────────────────────────────────────────────────
  {
    id: 7,
    name: "Legs",
    date: "2026-06-23",
    durationMinutes: 56,
    exercises: [
      {
        id: 0,
        name: "Hack Squat",
        sets: [
          { id: 0, setNumber: 1, reps: 8, weight: 165 },
          { id: 0, setNumber: 2, reps: 8, weight: 215 },
          { id: 0, setNumber: 3, reps: 8, weight: 215 },
        ],
        primaryMuscles: ["quads"],
        secondaryMuscles: ["glutes", "hamstrings"],
      },
      {
        id: 0,
        name: "Romanian Deadlift",
        sets: [
          { id: 0, setNumber: 1, reps: 8, weight: 50 },
          { id: 0, setNumber: 2, reps: 8, weight: 50 },
          { id: 0, setNumber: 3, reps: 8, weight: 55 },
        ],
        primaryMuscles: ["hamstrings", "glutes"],
        secondaryMuscles: ["lower back", "calves"],
      },
      {
        id: 0,
        name: "Dumbbell Reverse Lunge",
        sets: [
          { id: 0, setNumber: 1, reps: 8, weight: 20 },
          { id: 0, setNumber: 2, reps: 8, weight: 20 },
          { id: 0, setNumber: 3, reps: 8, weight: 20 },
        ],
        primaryMuscles: ["quads", "glutes"],
        secondaryMuscles: ["hamstrings", "calves"],
      },
      {
        id: 0,
        name: "Leg Curl",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 140 },
          { id: 0, setNumber: 2, reps: 10, weight: 180 },
          { id: 0, setNumber: 3, reps: 10, weight: 200 },
        ],
        primaryMuscles: ["hamstrings"],
        secondaryMuscles: ["calves"],
      },
      {
        id: 0,
        name: "Leg Extension",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 125 },
          { id: 0, setNumber: 2, reps: 10, weight: 145 },
          { id: 0, setNumber: 3, reps: 10, weight: 145 },
        ],
        primaryMuscles: ["quads"],
        secondaryMuscles: [],
      },
      {
        id: 0,
        name: "Standing Calf Raise",
        sets: [
          { id: 0, setNumber: 1, reps: 15, weight: 90 },
          { id: 0, setNumber: 2, reps: 15, weight: 110 },
          { id: 0, setNumber: 3, reps: 15, weight: 110 },
        ],
        primaryMuscles: ["calves"],
        secondaryMuscles: [],
      },
    ],
  },

  // ── 2026-06-16 · Pull ──────────────────────────────────────────────────────
  {
    id: 6,
    name: "Pull",
    date: "2026-06-16",
    durationMinutes: 55,
    exercises: [
      {
        id: 0,
        name: "Lat Pull-down",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 100 },
          { id: 0, setNumber: 2, reps: 8, weight: 115 },
          { id: 0, setNumber: 3, reps: 8, weight: 115 },
          { id: 0, setNumber: 4, reps: 8, weight: 115 },
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
          { id: 0, setNumber: 3, reps: 8, weight: 130 },
        ],
        primaryMuscles: ["lats", "rhomboids"],
        secondaryMuscles: ["biceps", "rear delts"],
      },
      {
        id: 0,
        name: "Face Pull",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 60 },
          { id: 0, setNumber: 2, reps: 12, weight: 60 },
          { id: 0, setNumber: 3, reps: 12, weight: 60 },
        ],
        primaryMuscles: ["rear delts"],
        secondaryMuscles: ["traps", "external rotators"],
      },
      {
        id: 0,
        name: "Chest Supported Row",
        sets: [
          { id: 0, setNumber: 1, reps: 8, weight: 90 },
          { id: 0, setNumber: 2, reps: 8, weight: 90 },
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
        name: "Incline Dumbbell Biceps Curl",
        sets: [
          { id: 0, setNumber: 1, reps: 6, weight: 20 },
          { id: 0, setNumber: 2, reps: 8, weight: 20 },
          { id: 0, setNumber: 3, reps: 6, weight: 20 },
        ],
        primaryMuscles: ["biceps"],
        secondaryMuscles: ["brachialis"],
      },
      {
        id: 0,
        name: "Cable Biceps Curl",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 70 },
          { id: 0, setNumber: 2, reps: 8, weight: 80 },
        ],
        primaryMuscles: ["biceps"],
        secondaryMuscles: ["brachialis", "forearms"],
      },
    ],
  },

  // ── 2026-06-15 · Push ──────────────────────────────────────────────────────
  {
    id: 5,
    name: "Push",
    date: "2026-06-15",
    durationMinutes: 58,
    exercises: [
      {
        id: 0,
        name: "Dumbbell Bench Press",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 50 },
          { id: 0, setNumber: 2, reps: 10, weight: 50 },
          { id: 0, setNumber: 3, reps: 8, weight: 60 },
          { id: 0, setNumber: 4, reps: 6, weight: 60 },
        ],
        primaryMuscles: ["chest"],
        secondaryMuscles: ["triceps", "front delts"],
      },
      {
        id: 0,
        name: "Shoulder Press",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 78 },
          { id: 0, setNumber: 2, reps: 8, weight: 98 },
          { id: 0, setNumber: 3, reps: 8, weight: 118 },
        ],
        primaryMuscles: ["front delts"],
        secondaryMuscles: ["triceps", "upper chest"],
      },
      {
        id: 0,
        name: "Incline Dumbbell Bench Press",
        sets: [
          { id: 0, setNumber: 1, reps: 8, weight: 45 },
          { id: 0, setNumber: 2, reps: 8, weight: 45 },
          { id: 0, setNumber: 3, reps: 6, weight: 50 },
        ],
        primaryMuscles: ["upper chest"],
        secondaryMuscles: ["front delts", "triceps"],
      },
      {
        id: 0,
        name: "Pec Deck",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 125 },
          { id: 0, setNumber: 2, reps: 10, weight: 125 },
          { id: 0, setNumber: 3, reps: 8, weight: 125 },
        ],
        primaryMuscles: ["chest"],
        secondaryMuscles: ["front delts"],
      },
      {
        id: 0,
        name: "Seated Lateral Raise",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 78 },
          { id: 0, setNumber: 2, reps: 12, weight: 98 },
          { id: 0, setNumber: 3, reps: 12, weight: 118 },
        ],
        primaryMuscles: ["lateral delts"],
        secondaryMuscles: ["traps"],
      },
      {
        id: 0,
        name: "Triceps Press-down",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 40 },
          { id: 0, setNumber: 2, reps: 10, weight: 50 },
          { id: 0, setNumber: 3, reps: 7, weight: 50 },
        ],
        primaryMuscles: ["triceps"],
        secondaryMuscles: [],
      },
      {
        id: 0,
        name: "Overhead Dumbbell Triceps Extension",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 30 },
          { id: 0, setNumber: 2, reps: 8, weight: 35 },
          { id: 0, setNumber: 3, reps: 8, weight: 35 },
        ],
        primaryMuscles: ["triceps"],
        secondaryMuscles: [],
      },
    ],
  },

  // ── 2026-06-12 · Legs ─────────────────────────────────────────────────────
  {
    id: 4,
    name: "Legs",
    date: "2026-06-12",
    durationMinutes: 54,
    exercises: [
      {
        id: 0,
        name: "Hack Squat",
        sets: [
          { id: 0, setNumber: 1, reps: 8, weight: 165 },
          { id: 0, setNumber: 2, reps: 8, weight: 215 },
          { id: 0, setNumber: 3, reps: 8, weight: 215 },
        ],
        primaryMuscles: ["quads"],
        secondaryMuscles: ["glutes", "hamstrings"],
      },
      {
        id: 0,
        name: "Romanian Deadlift",
        sets: [
          { id: 0, setNumber: 1, reps: 8, weight: 50 },
          { id: 0, setNumber: 2, reps: 8, weight: 55 },
          { id: 0, setNumber: 3, reps: 10, weight: 55 },
        ],
        primaryMuscles: ["hamstrings", "glutes"],
        secondaryMuscles: ["lower back", "calves"],
      },
      {
        id: 0,
        name: "Dumbbell Reverse Lunge",
        sets: [
          { id: 0, setNumber: 1, reps: 8, weight: 20 },
          { id: 0, setNumber: 2, reps: 8, weight: 20 },
          { id: 0, setNumber: 3, reps: 8, weight: 20 },
        ],
        primaryMuscles: ["quads", "glutes"],
        secondaryMuscles: ["hamstrings", "calves"],
      },
      {
        id: 0,
        name: "Leg Curl",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 120 },
          { id: 0, setNumber: 2, reps: 10, weight: 160 },
          { id: 0, setNumber: 3, reps: 10, weight: 180 },
        ],
        primaryMuscles: ["hamstrings"],
        secondaryMuscles: ["calves"],
      },
      {
        id: 0,
        name: "Leg Extension",
        sets: [
          { id: 0, setNumber: 1, reps: 10, weight: 125 },
          { id: 0, setNumber: 2, reps: 10, weight: 125 },
          { id: 0, setNumber: 3, reps: 10, weight: 145 },
        ],
        primaryMuscles: ["quads"],
        secondaryMuscles: [],
      },
      {
        id: 0,
        name: "Standing Calf Raise",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 90 },
          { id: 0, setNumber: 2, reps: 15, weight: 90 },
          { id: 0, setNumber: 3, reps: 15, weight: 90 },
        ],
        primaryMuscles: ["calves"],
        secondaryMuscles: [],
      },
    ],
  },

  // ── 2026-06-10 · Pull ──────────────────────────────────────────────────────
  {
    id: 3,
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
        name: "Chest Supported Row",
        sets: [
          { id: 0, setNumber: 1, reps: 12, weight: 50 },
          { id: 0, setNumber: 2, reps: 12, weight: 70 },
          { id: 0, setNumber: 3, reps: 10, weight: 90 },
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

  // ── 2026-06-08 · Push ──────────────────────────────────────────────────────
  {
    id: 2,
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
        name: "Pec Deck",
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
