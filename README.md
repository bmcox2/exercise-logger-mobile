# Exercise Logger — Mobile (V3)

A personal fitness tracking app, built primarily as a deliberate learning
project. The goal is mastering the craft of software development — understanding
every decision, not just producing working code — while building a tool I
actually use during workouts.

This repo is the **mobile** generation of the project (V3), built with React
Native and Expo, targeting iPhone.

---

## Why this repo exists

The project started as a terminal-based C++ application —
[`exercise-logger`](https://github.com/bmcox2/exercise-logger) — which is
complete and stands on its own as a portfolio piece demonstrating data
modeling, file I/O, and clean architecture in C++.

The long-term vision, though, was always a real app on my phone. Native iOS
development requires a Mac, and development here happens on a Windows laptop.
**React Native with Expo** solves that: it allows building and testing on a
real iPhone via the Expo Go app, with no Mac required.

So rather than force the C++ app toward a platform it was never going to
reach, the application logic is being re-expressed in TypeScript as this new
mobile app is built from the ground up. The two projects together tell a
stronger story than either alone — one shows systems-level thinking in C++,
the other shows frontend, mobile, and database fundamentals in a modern
stack.

---

## Tech stack

- **React Native** + **Expo** (SDK 54)
- **TypeScript**
- **React Navigation** (native stack) for screen navigation
- **expo-sqlite** for on-device persistent storage
- Tested live on iPhone via **Expo Go**

---

## Current state (V3)

The app currently supports:

- Viewing a scrollable list of all logged workouts (name, date, duration)
- Tapping a workout to view its full detail: every exercise, with reps,
  weight, and muscle groups
- All data is stored locally in a **SQLite** database on the device, using a
  fully normalized schema:
  - `workouts` — one row per workout
  - `exercises` — one row per exercise, linked to its workout
  - `primaryMuscles` / `secondaryMuscles` — junction tables linking each
    exercise to the muscle groups it targets
- Data persists between app launches — close the app, reopen it, workouts are
  still there

No editing, AI feedback, or Garmin integration yet — those are deliberately
later phases (see below).

---

## What's next

- **V4:** add/edit/delete workouts and exercises from the UI, workout notes,
  an in-workout logging experience
- **V5:** AI feedback via the Anthropic API — in-workout suggestions and
  post-workout analysis
- **V6:** import activity data from a Garmin watch (pending research into
  Garmin's API access constraints)

A full version-by-version roadmap lives in `ROADMAP.md`.

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
device. Note: the laptop and phone need to be on the same network — a personal
hotspot is the most reliable option if public WiFi blocks
device-to-device traffic.

---

## Related repos

- [`exercise-logger`](https://github.com/bmcox2/exercise-logger) — the
  original C++ terminal version (V1/V2), complete and standalone
- [`portfolio`](https://github.com/bmcox2/portfolio) — broader portfolio
  context
