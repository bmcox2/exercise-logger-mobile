# Exercise Logger — Mobile (V4, in progress)

A personal fitness tracking app built primarily as a deliberate learning
project. The goal is mastering the craft of software development —
understanding every decision, not just producing working code — while
building a tool I actually use during my own workouts.

This is the **mobile** generation of the project (V4), built with React
Native and Expo, targeting iPhone.

---

## Why this repo exists

The project started as a terminal-based C++ application —
[`exercise-logger`](https://github.com/bmcox2/exercise-logger) — which is
complete and stands on its own as a portfolio piece demonstrating data
modeling, file I/O, and clean architecture in C++.

The long-term vision, though, was always a real app on my phone. Native iOS
development requires a Mac, and development here happens on a Windows laptop.
**React Native with Expo** solves that: it lets me build and test on a real
iPhone via the Expo Go app, no Mac required.

Rather than force the C++ app toward a platform it was never going to reach,
I re-expressed the application logic in TypeScript and rebuilt the app from
the ground up on this new stack. Together, the two projects tell a stronger
story than either alone — one shows systems-level thinking in C++, the other
shows frontend, mobile, and database fundamentals in a modern stack.

---

## Tech stack

- **React Native** + **Expo** (SDK 54)
- **TypeScript**
- **React Navigation** — bottom tab navigator (Workouts / Library / Build),
  each with its own nested native stack
- **expo-sqlite** for on-device persistent storage
- Tested live on iPhone via **Expo Go**

---

## Current state (V4)

The app has grown from a read-only workout viewer into a real
workout-planning tool:

**Data model**
- Fully normalized SQLite schema: `workouts` → `exercises` → `sets`, so each
  exercise carries multiple distinct sets (e.g. 135×10, 145×8, 155×6) instead
  of a single reps/weight pair
- A separate `exerciseLibrary` table, seeded from an 873-exercise dataset,
  models exercise *definitions* independently from how an exercise is
  *logged* inside a specific workout — each with its own primary/secondary
  muscle-group junction tables
- One save path (`addWorkout`) that every workout producer feeds — manual
  edits, cloning a past workout, or (later) AI — regardless of how the data
  was assembled

**Building a workout**
- A searchable exercise library screen (case-insensitive partial-name
  matching across all 873 exercises)
- A full workout builder/editing surface: start from a past workout as a
  template, adjust sets/reps/weight, add or remove exercises and individual
  sets, then save
- An AI entry point is visibly present in the build flow — the hand-off
  contract (a prompt plus past-workout context in, a workout draft out) is
  designed and stubbed, ready to be wired to a real model in V5

**Viewing workouts**
- A scrollable list of all logged workouts
- A detail view showing every exercise, its sets, reps, weight, and muscle
  groups
- Data persists on-device between app launches

**In progress right now:** the live in-workout flow — following a planned
workout set-by-set at the gym, logging what actually happened against the
plan, with live edits (swap an exercise, add a set) and rest timers.

---

## What's next

- Finish the in-workout logging flow (current phase)
- Edit and delete past workouts
- Lightweight per-workout notes
- Filtering in the exercise library (equipment, category, muscle group)
- **V5:** real AI integration via the Anthropic API — in-workout suggestions
  and post-workout analysis, using the seam already designed in V4
- **V6:** import activity data from a Garmin watch (pending research into
  Garmin's API access)

A full version-by-version roadmap, including design decisions and open
questions, lives in `ROADMAP.md`.

---

## Running it locally

Requires [Node.js](https://nodejs.org/) and the
[Expo Go](https://expo.dev/go) app installed on a physical iOS or Android
device.

```bash
git clone https://github.com/bmcox2/exercise-logger-mobile.git
cd exercise-logger-mobile
npm install
npx expo start
```

Scan the QR code shown in the terminal with the Expo Go app to run it on your
device. Note: the laptop and phone need to be on the same network — a
personal hotspot is the most reliable option if public WiFi blocks
device-to-device traffic.

---

## Related repos

- [`exercise-logger`](https://github.com/bmcox2/exercise-logger) — the
  original C++ terminal version (V1/V2), complete and standalone
- [`portfolio`](https://github.com/bmcox2/portfolio) — broader portfolio
  context
