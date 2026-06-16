# Exercise Logger — Project Roadmap

A living planning document. This is meant to be revised as understanding
changes — that is normal and expected. Real roadmaps are not contracts;
they are best current guesses that get refined as you learn.

---

## Project Vision

A personal fitness tool that I actually use during workouts, built primarily
to learn the craft of software development. The end state is a mobile app on
my iPhone that lets me:

- Log workouts and view them in a clean interface
- Edit workouts and add notes
- Get AI feedback during and after a workout
- Import data from my Garmin Venu 4

The goal is **learning while building something useful** — understanding every
decision, not just producing working code.

---

## A Note on the Tech Stack Shift

V1 and V2 were built in C++ as a terminal application. That work was not
wasted — it taught data modeling, separation of concerns, file I/O, JSON
handling, and clean architecture. Those concepts transfer to any language.

However, the target is now an **iPhone app**, and development is happening on
a Windows machine (XPS 15) with no Mac. That rules out native iOS (Swift/Xcode
require macOS). The chosen path forward is:

- **React Native** (JavaScript/TypeScript) with **Expo**
- Expo allows development and on-device testing from Windows, using the Expo
  Go app on the iPhone — no Mac required for development

This means the application logic gets re-expressed in JavaScript/TypeScript as
the mobile app is built. The C++ project remains a complete, standalone
portfolio piece demonstrating systems-level thinking and architecture. The two
projects together tell a stronger story than either alone.

---

## Version Overview

| Version | Focus                                                               | Status                   |
| ------- | ------------------------------------------------------------------- | ------------------------ |
| V1      | Terminal logger, core data models                                   | Complete                 |
| V2      | Exercise database, edit/delete, single workout view, stats          | Complete                 |
| V3      | Learn frontend fundamentals; rebuild core app as a basic mobile app | In Progress              |
| V4      | Richer interaction: editing, notes, in-workout experience           | Planned                  |
| V5      | AI feedback layer (Anthropic API)                                   | Planned                  |
| V6      | Garmin Venu 4 data integration                                      | Planned (needs research) |

---

## How Developers Approach a Project Like This

A reference for the process, captured so it can be re-read at the start of
each version:

1. **Define requirements** — what should it do, from the user's perspective?
   Write user stories: "As a user, I want to **_ so that _**." Separate
   _what_ from _how_.
2. **Identify constraints and risks** — what could go sideways? Surface
   unknowns early so they can be researched before they become blockers.
3. **Plan architecture** — how do the pieces fit together? What data flows
   where? Will today's decisions make tomorrow's work easier or harder?
4. **Break into milestones** — meaningful, testable checkpoints. Each one
   should be describable as "the app can now do X."
5. **Build, test, reflect** — after each chunk, ask: does it do what I
   planned? What surprised me? What would I design differently now?
6. **Maintain a backlog** — capture future ideas and known design debt in a
   running list so they don't clutter current work or get forgotten.

The single most important habit: **plan before coding.** Before any new
feature, answer — what am I building, how will I know it's done, how does it
fit what exists, what could go wrong, what do I need to learn?

---

## V3 — In Depth

### Goal

Get out of the terminal. By the end of V3, I can open an app on my phone, see
a list of my workouts, tap one, and view it in detail — all from a real
interface, not a command line. No AI and no Garmin yet. This version is about
learning frontend fundamentals and proving the toolchain works.

### Why this scope

V3 is deliberately _not_ the whole vision. Editing, notes, AI, and Garmin are
all later. Trying to learn an entire new ecosystem AND build every feature at
once is how projects stall. V3's job is to make the unfamiliar familiar: get
comfortable building UI, managing app state, and displaying data on a device.

### V3 broken into phases

#### Phase 0 — De-risk the toolchain ✅ Complete

- Node.js installed, Expo CLI configured
- Expo Go installed on iPhone
- Project created with `create-expo-app --template blank-typescript`
- Downgraded to Expo SDK 54 for Expo Go compatibility
- Live reload confirmed working over personal hotspot (hotel/public WiFi
  blocks device-to-device communication — hotspot bypasses this)
- Repo live at github.com/bmcox2/exercise-logger-mobile

#### Phase 1 — Learn the fundamentals ✅ Complete

Completed two custom courses (JavaScript-Course.md, React-Course.md):

- JavaScript: variables, functions, arrays, objects, `.map()`, `.filter()`,
  destructuring, spread, arrow functions, TypeScript interfaces
- React/React Native: components, props, state (`useState`), JSX, list
  rendering with keys, conditional rendering, `TextInput`, `Pressable`,
  `useEffect` overview

Done when: the "You're Ready to Build" example at the end of the React course
reads clearly without looking anything up. ✅ Confirmed.

#### Phase 2 — Mock the data layer ✅ Complete

- TypeScript interfaces defined in `src/types/index.ts`:
  - `Exercise` — id, name, reps, weight, primaryMuscles[], secondaryMuscles[]
  - `Workout` — id, name, date, durationMinutes, exercises[]
  - `RootStackParamList` — navigation type for WorkoutList and WorkoutDetail
- Mock data created in `src/data/mockData.ts` with two real workouts:
  - Pull day (Jun 10) — 19 sets across Lat Pull-down, Seated Cable Row,
    Face Pull, Chest Supported Row, Barbell Curl, Hammer Curl
  - Push day (Jun 8) — 22 sets across Dumbbell Bench, Shoulder Press,
    Incline Bench, Lateral Raise, Fly, Cable Crossover, Triceps Press-down,
    Overhead Extension
- Navigation set up in App.tsx using React Navigation native stack
- `WorkoutListScreen.tsx` and `WorkoutDetailScreen.tsx` created in
  `src/screens/`

Done when: typed, in-code list of sample workouts exists. ✅ Confirmed.

#### Phase 3 — Build the workout list screen ← Current phase

The first real screen. Displays all workouts at a glance.

- Render the list of workouts (name, date, durationMinutes) using `FlatList`
- Each row tappable, navigates to WorkoutDetailScreen passing workoutId
- Style using React Native's built-in `StyleSheet` (see styling note below)
- Handle empty state (what shows when there are no workouts?)

Done when: I can scroll a styled list of my workouts on my phone and tap one
to navigate to the detail screen.

#### Phase 4 — Build the workout detail screen

Tapping a workout opens its full detail.

- Navigation already set up — WorkoutDetailScreen registered in App.tsx
- Receive workoutId via route.params, find workout in mock data
- Display workout summary (name, date, duration) at top
- Display exercises grouped or listed with sets, reps, weight, muscle groups
- Display stats: total volume, volume by muscle group

Done when: I can tap a workout and see its full breakdown on a second screen.

#### Phase 5 — Connect to real data

Replace the fake data with persistent real data stored on the device.

- Learn a simple on-device storage option (e.g. AsyncStorage, or a local
  database like SQLite via Expo)
- Save and load workouts so they persist between app launches
- (Stretch / decision point) Decide whether the C++ backend plays any role
  here, or whether the data layer is fully rebuilt in the mobile app. For a
  personal tool, on-device storage is likely simplest. This is worth a
  deliberate decision, documented when made.

Done when: I can close the app, reopen it, and my workouts are still there.

#### Phase 6 — Polish and document

- Clean up styling and layout inconsistencies
- Handle empty states (what shows when there are no workouts?)
- Update the README to describe the mobile app and the stack shift
- Write a short reflection: what was hard, what surprised me, what I'd do
  differently

Done when: the app is presentable, documented, and a clear portfolio piece.

### V3 complete when

- The app runs on my iPhone via Expo Go
- I can view a list of my workouts
- I can tap a workout and see its full detail, including stats
- Workouts persist between sessions
- The README reflects the new direction

### Styling Approach

**V3 uses React Native's built-in `StyleSheet`** for all styling. NativeWind
(Tailwind CSS for React Native) was attempted but proved too difficult to
configure reliably with Expo SDK 54 and Expo Go. It was deprioritized to avoid
blocking progress on functionality.

NativeWind or an alternative styling library will be revisited in Phase 6
(polish). The goal remains a polished-looking app — the approach to get there
is deferred, not abandoned.

---

## Later Versions (lighter detail — to be expanded when closer)

### V4 — Richer interaction

- Add, edit, and delete workouts and exercises from the UI
- Add notes to workouts (before/after)
- Design the in-workout experience: using the app between sets

### V5 — AI feedback

- Integrate the Anthropic API from the mobile app
- In-workout feedback: tell the AI something ("my hamstring hurt on that
  exercise") and get suggestions, including proposed workout changes to accept
- Post-workout analysis based on the workout and any notes
- Approachable once the app exists and network requests are understood

### V6 — Garmin integration

- Import Garmin Venu 4 data into the app
- **Needs research first:** what does Garmin's API actually expose to
  third-party apps, and what are the access constraints? Confirm feasibility
  before committing to specifics.

---

## Backlog / Someday

- Long-term training planning and trends over time
- Nutrition tracking
- Broader health metrics
- Cross-workout statistics (volume per week/month, per muscle group over time)
  — note: this is a natural future home for logic on `WorkoutLog` in the C++
  version, and an equivalent in the mobile app

---

## Design Debt Log

- (Resolved in V2) Stats logic was in `main`; moved into `Workout` as
  `getTotalVolume()` and `getMuscleVolume()`
- (Resolved in V2) Display logic removed from `Workout` / `WorkoutLog`;
  presentation now lives in `main` (acting as a stand-in frontend)
- Open question: where cross-workout stats should live (see Backlog)
- NativeWind setup was attempted for V3 but proved incompatible with Expo Go
  on SDK 54. Using `StyleSheet` for now. Revisit styling library choice in
  Phase 6 before polish pass.
