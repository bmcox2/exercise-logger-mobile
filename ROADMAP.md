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

| Version | Focus                                                                 | Status                   |
| ------- | --------------------------------------------------------------------- | ------------------------ |
| V1      | Terminal logger, core data models                                     | Complete                 |
| V2      | Exercise database, edit/delete, single workout view, stats            | Complete                 |
| V3      | Learn frontend fundamentals; rebuild core app as a basic mobile app   | Complete                 |
| V4      | Sets/exercise library, build & live-edit workouts, edit/delete, notes | Planned                  |
| V5      | AI feedback layer (Anthropic API)                                     | Planned                  |
| V6      | Garmin Venu 4 data integration                                        | Planned (needs research) |

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

## V3 — In Depth ✅ Complete

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

#### Phase 3 — Build the workout list screen ✅ Complete

The first real screen. Displays all workouts at a glance.

- Rendered the list of workouts (name, date, durationMinutes) using
  `FlatList`
- Each row tappable via `Pressable`, navigates to WorkoutDetailScreen passing
  `workoutId`
- Styled using React Native's built-in `StyleSheet`
- Empty state handled via `ListEmptyComponent`

Done when: I can scroll a styled list of my workouts on my phone and tap one
to navigate to the detail screen. ✅ Confirmed.

#### Phase 4 — Build the workout detail screen ✅ Complete

Tapping a workout opens its full detail.

- `workoutId` received via `route.params`, workout located and rendered
- Workout summary (name, date, duration) displayed at top
- Exercises displayed in a flexbox table layout with alternating row colors
- Stats (total volume, volume by muscle group) deliberately deferred —
  decided not worth building against mock data right before the real
  database layer arrived in Phase 5; revisit when stats are tackled in depth

Done when: I can tap a workout and see its full breakdown on a second screen.
✅ Confirmed (stats deferred by deliberate decision, not oversight).

#### Phase 5 — Connect to real data ✅ Complete

Replaced the fake data with persistent real data stored on the device.

- **Decision made:** fully rebuild the data layer in the mobile app using
  on-device storage. The C++ backend plays no role — connecting it would
  require networking/server infrastructure that isn't justified at this
  stage (possible future territory, not now)
- **Storage choice:** SQLite via `expo-sqlite`, chosen over AsyncStorage
  because the data is genuinely relational (workouts contain exercises) and
  future work (stats, filtering by muscle group) benefits from real queries
  rather than loading everything into JS and filtering by hand
- Completed a dedicated custom course (`SQLite-Course.md`) covering SQL
  fundamentals, relationships/foreign keys, and `expo-sqlite` specifically,
  before building
- **Schema implemented (fully normalized):** `workouts`, `exercises`
  (foreign key to `workouts`), `primaryMuscles` / `secondaryMuscles`
  (junction tables, foreign key to `exercises`) — muscle arrays solved via
  proper relational tables rather than JSON-text, a more thorough approach
  than the course's minimum recommendation, chosen deliberately to scale
  cleanly into future muscle-based querying
- `database.ts` built with `initDatabase`, `getWorkouts`, `getWorkoutById`
  (with full nested fetch of exercises + muscles), and `addWorkout`
  (full nested insert: workout → exercises → muscles, using
  `lastInsertRowId` to correctly link each level)
- Seeding implemented: on first launch, if the workouts table is empty, the
  two real mock workouts are inserted via `addWorkout`
- Two real bugs hit and resolved during this phase:
  - Top-level `await` outside an async context when opening the database —
    fixed by moving the connection + table creation inside `initDatabase`
  - Race condition: `WorkoutListScreen` called `getWorkouts()` before
    `initDatabase()` had finished — fixed with a `dbReady` state gate in
    `App.tsx` that delays rendering `NavigationContainer` until
    initialization completes
- `getWorkoutById`'s nested-fetch logic was refactored into smaller helper
  functions (`getMuscles`, `getExercisesForWorkout`) once the single function
  became hard to read — a deliberate split for clarity, not a bug fix

Done when: I can close the app, reopen it, and my workouts are still there.
✅ Confirmed.

#### Phase 6 — Polish and document ✅ Complete

- Reviewed styling consistency across both screens — found mostly consistent
  by design (e.g. deliberate use of a darker border color for major section
  dividers vs. a lighter one for row dividers); decided to leave exercise
  table text black rather than matching secondary gray, for table readability
- Empty states confirmed handled on both screens
- README.md written: explains the project, the C++ → React Native stack
  shift and why, current capabilities, what's next, and local setup
  instructions
- **Decision made on visual design more broadly:** keep `StyleSheet` and the
  current simple look through the remaining functionality-focused versions.
  A full AI-assisted visual redesign is planned for later, once more of the
  app's functionality exists — doing one overhaul once beats redoing styling
  after every version

Done when: the app is presentable, documented, and a clear portfolio piece.
✅ Confirmed.

### V3 complete when

- ✅ The app runs on my iPhone via Expo Go
- ✅ I can view a list of my workouts
- ✅ I can tap a workout and see its full detail (stats deferred, logged
  below)
- ✅ Workouts persist between sessions
- ✅ The README reflects the new direction

### Styling Approach

**V3 uses React Native's built-in `StyleSheet`** for all styling. NativeWind
(Tailwind CSS for React Native) was attempted but proved too difficult to
configure reliably with Expo SDK 54 and Expo Go. It was deprioritized to avoid
blocking progress on functionality.

**Decision (Phase 6):** rather than revisit a styling library now, the plain
`StyleSheet` approach continues through the functionality-focused versions
(V4 onward). A full AI-assisted visual redesign is the planned path for an
eventual polish pass, once the app's feature set is closer to complete —
deferred deliberately, not abandoned.

---

## V4 — In Depth

### Goal

Make the app something I actually use at the gym. By the end of V4, I can
build a workout ahead of time using a real exercise library, follow it during
a workout with the ability to adjust reps/weight/exercises/sets live as I go,
and edit or delete past workouts afterward. This is the version where the app
stops being a viewer and becomes a tool.

### Why this scope, and what changed during planning

The original V4 scope (add/edit/delete, notes, in-workout experience) is
still the right destination, but two things became clear during planning that
reshape it:

1. **The data model needs to change first.** The current `Exercise` type
   holds one reps/weight pair. Real workouts have multiple sets per exercise
   (e.g. Bench Press: 135x10, 145x8, 155x6), matching how Garmin and Volt both
   model it. Retrofitting this after building screens on the old shape would
   mean redoing UI work, so the schema change comes first, as its own phase.
2. **An exercise library is a prerequisite, not a nice-to-have.** Building a
   workout means picking exercises. Without a library, every workout build
   means typing exercise names from scratch — error-prone and disconnected
   from the muscle-group data the app already cares about. This mirrors the
   `ExerciseDatabase` / `ExerciseInfo` work already done in the C++ version,
   re-expressed here.

**Real usage pattern motivating this version:** workouts are currently
planned in a conversation with Claude (using past workout history), followed
on a Garmin watch during the session — with live deviation as the workout
actually happens — then reported back afterward. V4's in-workout screen is
modeled on this real pattern (plan first, adjust live) rather than a build-as
-you-go model, and is directly inspired by the tap-to-edit interaction in the
Volt app: see a planned exercise, weight, and reps; tap any value to overwrite
it with what actually happened.

Notes are deferred in spirit to V5 (alongside AI integration) but a
lightweight free-text field is cheap enough to include at the end of V4 if
time allows.

**Timeline context:** roughly six weeks of dedicated time are available
before returning to school, after which time for the project will shrink
considerably. The full original roadmap (V4 → V5 → V6) remains the goal, at
roughly two weeks per version, matching the pace V1 → V3 was actually built
at. A deliberate checkpoint is planned after V4: if V4 takes
meaningfully longer than two weeks, V5/V6 scope should be reassessed before
committing further time, particularly V6, which depends on still-unresearched
Garmin API constraints.

### V4 broken into phases

#### Phase 0 — Evolve the schema: sets

Before any new screens, change the data model to support multiple sets per
exercise.

- Design and create a `sets` table: `id`, `exercise_id` (foreign key →
  `exercises`), `reps`, `weight`, and a `setNumber`/order column so sets
  display in the right sequence
- Update the `Exercise` TypeScript type: remove top-level `reps`/`weight`,
  add `sets: Set[]`
- Update `database.ts`: `addWorkout` now inserts one row per set per
  exercise instead of one reps/weight pair; `getWorkoutById`'s exercise
  assembly fetches and attaches sets the same way it currently attaches
  muscles
- Wipe the existing SQLite database (delete/reinstall, same approach as V3
  Phase 5) and reseed
- Rewrite `mockData.ts` with realistic multi-set exercises so the seed data
  actually demonstrates the new shape
- Update `WorkoutDetailScreen`'s table to render one row per set, not one row
  per exercise (exercise name shown once, sets listed beneath or grouped)

Done when: a workout with an exercise that has 3 distinct sets displays
correctly on the detail screen, and that shape persists correctly through an
app restart.

#### Phase 1 — Build the exercise library

Before building a workout, there needs to be something to choose from.

- Design an `exercise_library` table — distinct from the `exercises` table
  (which represents an exercise _as logged inside a specific workout_). The
  library is the catalog: name, default primary/secondary muscle groups. This
  mirrors the C++ `ExerciseInfo` / `ExerciseDatabase` split between exercise
  _definitions_ and exercise _instances in a workout_
- Seed the library — likely reusing the same free-exercise-db dataset (or a
  trimmed version of it) used in the C++ version, or starting with just the
  exercises that already appear in the real seeded workouts and expanding
  later (open question, decide when starting this phase)
- Build a simple library browse/search screen: list exercises, search by
  name (mirrors the C++ search feature — case-insensitive partial matching)
- Selecting an exercise from this screen should be usable as a building
  block by Phase 2's workout builder, not just a standalone browse feature

Done when: I can open a screen, search for an exercise by name, and see it in
a results list with its associated muscle groups.

#### Phase 2 — Build a workout ahead of time

The "plan before the gym" half of the new flow.

- New screen: build a workout — set name/date, then add exercises pulled
  from the library (Phase 1)
- For each exercise added, specify planned sets (reps + weight per set), with
  the ability to add/remove individual sets while building
- Save the assembled workout to the database using a save function that
  doesn't care how the data was assembled — a human filling out this form
  today, or an AI handing over a pre-filled structure later (V5), should both
  be able to call the same save path
- This reuses/extends `addWorkout`, now adapted for the new sets-based shape
  from Phase 0

Done when: I can build a full workout from exercises in the library, save it,
and see it appear correctly in the workout list and detail screens.

#### Phase 3 — Live in-workout editing

The Volt-inspired experience: follow the plan, adjust as reality happens.

- New screen, separate from the builder (deliberate decision — these are two
  distinct screens, not one shared one): an "active workout" view that opens
  a saved planned workout
- Each set's reps/weight is tap-to-edit inline — tapping a value lets you
  overwrite it with what actually happened, without leaving the screen
- Ability to swap an exercise entirely (replace with a different library
  exercise; whether this keeps or clears its planned sets is an open
  question, decide when building this)
- Ability to add or remove sets live, same mechanism as the builder screen,
  ideally reusing the same underlying components
- Changes save back to the same workout record — when the workout is marked
  done, what's stored reflects what was actually done, not just the original
  plan

Done when: I can open a planned workout, change a weight/rep value on a
specific set mid-workout, swap an exercise, add an extra set, and have all of
it persist correctly when I back out and reopen the workout later.

#### Phase 4 — Edit and delete past workouts

Rounds out CRUD on already-completed workouts (distinct from live in-workout
editing in Phase 3, which happens during an active session).

- From the detail screen, ability to enter an edit mode for a past workout
- Delete a workout entirely (with a confirmation step — no silent data loss)
- Delete should cascade correctly: removing a workout removes its exercises
  and their sets, not just the top-level row

Done when: I can correct a mistake in a past workout or remove one entirely,
and the database stays consistent (no orphaned exercise/set rows left
behind).

#### Phase 5 — Notes (lightweight, time-permitting)

Deferred in spirit to V5, but cheap enough to slot in here if Phases 0–4 go
well.

- A single free-text notes field per workout (not per exercise/set — keep it
  simple)
- Editable from the same edit flow as Phase 4
- No structure, no AI involvement yet — just a place to jot something down
  ("felt strong today," "shoulder was tight on press")

Done when: I can add and edit a short note on a workout, and it persists.

#### Phase 6 — Filter the exercise library

Currently search is name-only. The library schema already includes `equipment`
and `category` columns, and `libraryPrimaryMuscles` / `librarySecondaryMuscles`
support muscle-based filtering.

- Add filter controls to the library browse and exercise picker screens
  (equipment, category, primary muscle — most useful for workout building)
- Extend `searchExerciseLibraryByName` or add a new `searchExercises` function
  that accepts optional filter parameters and builds the WHERE clause dynamically
- Consider trimming the 873-exercise dataset to exercises actually relevant
  before adding filters, since the full dataset includes
  stretching, cardio, strongman, and olympic lifting that may not be useful

Done when: I can filter the exercise list by equipment, category, or muscle
group in addition to searching by name.

#### Phase 7 — Polish and document

Same shape as V3's Phase 6.

- Clean up styling consistency across the new screens against the existing
  ones
- Handle empty/edge states introduced by new features (empty exercise
  library search results, a workout with zero exercises, etc.)
- Update README to reflect V4's new capabilities
- Reflection: what was hard, what surprised me, what changed from this plan
  by the time I got here — including an honest pace check against the
  two-week-per-version target before committing further time to V5/V6

### V4 complete when

- A workout can be fully built ahead of time using a real exercise library
- A planned workout can be followed during a gym session, with live editing
  of sets, reps, weight, and exercises
- Past workouts can be edited or deleted
- The schema correctly models multiple sets per exercise
- The app is something I'm actually using at the gym, not just viewing
  seeded data

### Open questions / decide-when-you-get-there

- Exercise swap in Phase 3: does swapping an exercise keep its planned sets
  (just renamed) or clear them and start fresh?
- Exercise library seed source: reuse the free-exercise-db dataset from the
  C++ project, or start narrower with just exercises already in real seeded
  workouts?

---

## Later Versions (lighter detail — to be expanded when closer)

### V5 — AI feedback

- Integrate the Anthropic API from the mobile app
- In-workout feedback: tell the AI something ("my hamstring hurt on that
  exercise") and get suggestions, including proposed workout changes to accept
- Post-workout analysis based on the workout and any notes
- Likely home for full notes support, building on the lightweight version
  from V4 Phase 5 if that was completed
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
- Total volume / volume-by-muscle-group stats on the detail screen itself
  (deferred from V3 Phase 4; revisit once the V4 sets schema is in place,
  since per-set data makes these calculations more accurate)

---

## Design Debt Log

- (Resolved in V2) Stats logic was in `main`; moved into `Workout` as
  `getTotalVolume()` and `getMuscleVolume()`
- (Resolved in V2) Display logic removed from `Workout` / `WorkoutLog`;
  presentation now lives in `main` (acting as a stand-in frontend)
- Open question: where cross-workout stats should live (see Backlog)
- NativeWind setup was attempted for V3 but proved incompatible with Expo Go
  on SDK 54. Using `StyleSheet` for now — decision (V3 Phase 6) to continue
  with `StyleSheet` through the functionality-focused versions and revisit
  visual design as a dedicated AI-assisted pass once more functionality
  exists.
- (Resolved in V3 Phase 5) Muscle arrays: considered storing as JSON text for
  simplicity, but chose the fully normalized junction-table approach
  (`primaryMuscles` / `secondaryMuscles`) instead — decided the relational
  structure was worth the extra setup for future muscle-based querying.
- (New, V4) Once the exercise library (Phase 1) exists, `exercises` means "an
  exercise as logged in a specific workout" while `exercise_library` means
  "an exercise definition." Worth a one-line comment in `database.ts` near
  both table definitions so this doesn't get conflated later.
- (New, V4) Total volume / volume-by-muscle-group stats on the workout detail
  screen remain deferred (see Backlog) — now better motivated once V4's sets
  schema lands, since per-set data is more accurate than per-exercise
  totals.
- (New, V4 Phase 1) Exercise library seed runs 873 individual inserts sequentially on first launch, causing ~30 second delay. One-time cost only — subsequent launches skip the seed entirely. Fix with bulk inserts or seed during account setup if first-launch experience ever matters (e.g. before sharing the app with others).
