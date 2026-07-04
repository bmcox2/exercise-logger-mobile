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

Make the app something I actually use at the gym. By the end of V4, I can plan
a workout by starting from one of my past workouts as a template, adjust the
sets/reps/weight, and follow it during a session with the ability to edit live
as I go. AI workout generation — the way I actually want to build workouts
long-term — has a designed, visible place to plug in, but is not implemented
until V5. This is the version where the app stops being a viewer and becomes a
tool.

### Why this scope, and what changed during planning

The original V4 plan treated manual workout building as the foundation and AI
as a later garnish. Thinking it through properly, that's backwards for the app
I actually want. My real intent is: I type something like "build a leg workout
for today, dial back volume because I've got something tomorrow," and AI
assembles a full plan — exercises and sets/reps/weight — using my past workouts
as context, which I then adjust. In that vision **AI is the primary way I build
a workout, and manual building is a rarely-touched fallback.** Spending my best
effort polishing a manual builder first would mean investing in the part I care
least about.

The principle that resolves this is one I've already been using all through V4:
**the `Workout` data structure is the contract.** `addWorkout` doesn't care how
a workout was assembled — a human tapping it together, AI generating it, or
cloning a past workout as a template all produce the same `Workout` object, and
all feed the same place. So the piece worth building is the shared destination
those producers feed: an **editing surface** that takes a `Workout` in a
"being edited" state, lets me adjust it, and saves it. That surface is needed no
matter what, and it survives AI integration untouched.

What this reorders:

1. **The editing surface is the spine of Phase 2**, not the manual builder. It's
   fed first by cloning a past workout (needs no AI, and is genuinely how I'd
   start most sessions).
2. **AI is stubbed visually in V4, built for real in V5.** The reason to stub
   rather than build now isn't that the jump gets smaller by waiting — it
   doesn't. It's about isolating variables: when AI breaks (repeatedly, while
   I'm learning it), I want the editing surface already proven, so every bug is
   by definition in the AI layer. Stubbing also forces me to design the _seam_
   now while it's cheap — where AI plugs in and what it hands off — so V5 is
   "make the stub real," not "figure out where AI even goes."
3. **Manual from-scratch building is demoted** to a later, optional phase — just
   another producer feeding the same surface, never a blocker.

The one rule that makes "now vs. later" not matter for rework: the AI producer
and the editing surface must communicate _only_ through the `Workout` data
structure. Keep that seam clean and AI can slot in whenever.

Note: this roadmap is deliberately malleable. AI drafted it as guidance; the
real design decisions get made when I reach each phase, because I didn't have a
perfect picture when writing it and my ideas may still change.

### V4 broken into phases

#### Phase 0 — Evolve the schema: sets ✅ Complete

- `sets` table (`id`, `exercise_id`, `setNumber`, `reps`, `weight`)
- `Exercise` type updated: removed top-level `reps`/`weight`, added
  `sets: WorkoutSet[]`
- `addWorkout` inserts one row per set, wrapped in `db.withTransactionAsync`
  so a partial workout can never be written on failure
- `WorkoutDetailScreen` renders one row per set; `key` uses `set.id`
- Reseeded via `workouts_v2.db`

Done when: a workout with 3 distinct sets displays correctly and persists
through an app restart. ✅ Confirmed on device.

#### Phase 1 — Build the exercise library ✅ Complete

- `exerciseLibrary` table (`id`, `name`, `description`, `equipment`,
  `category`) plus `libraryPrimaryMuscles` / `librarySecondaryMuscles` junction
  tables, mirroring the workout-side muscle pattern
- Seeded from the free-exercise-db dataset (873 exercises), transformed from
  JSON on first launch inside a single transaction
- Two TypeScript interfaces: `ExerciseLibraryItem` (JSON input shape) and
  `ExerciseLibraryRow` (database output shape) — separated because input and
  output genuinely diverge
- `searchExerciseLibraryByName` — case-insensitive partial match, uses a
  batched `IN (...)` query for muscles to avoid N+1 scaling on list results
- `getExerciseById` for the detail screen; `getMuscles` generalized to take a
  column name so it serves both workout and library junction tables
- Navigation restructured to a bottom tab navigator with two nested stacks
  (`WorkoutsStackParamList`, `LibraryStackParamList`)
- `ExerciseLibraryScreen` (search + live-filtering list) and
  `ExerciseDetailScreen` (name, category, equipment, description, muscles)

Done when: I can open a screen, search an exercise by name, and see it in a
results list with its muscle groups. ✅ Confirmed on device.

#### Phase 2 — Build a workout (editing surface + AI stub)

The heart of V4 and the app's core interaction. Split into two sub-parts.

**Phase 2a — The editing surface, fed by cloning a past workout**

- Entry point: choose a past workout to start from. It loads as an editable
  _draft_ — a `Workout` in memory that isn't saved yet.
- On the editing surface I can: adjust each set's reps/weight, add/remove
  individual sets, add exercises (pulled from the library via an exercise
  picker built on Phase 1), and remove exercises.
- Set the new workout's name/date.
- Save the assembled draft with `addWorkout` — the existing agnostic save path,
  unchanged. The draft is just a `Workout`; the save path doesn't care it came
  from a clone.

Done when: I can pick a past workout, load it as a draft, change sets/reps/
weight, add and remove exercises and sets, save it, and see the new workout
appear correctly in the list and detail screens.

**Phase 2b — AI entry point (stub only)**

- A visible "Build with AI" entry point: a text input for a natural-language
  request and a button. Present and styled, but does nothing yet.
- Purpose is to design and commit the _seam_ now: the AI producer will take
  (1) my text prompt and (2) past-workout context, and output a `Workout`-
  shaped draft that feeds the exact same editing surface from 2a.
- No network calls, no API key, no parsing. The button is inert or shows a
  "coming in V5" placeholder.

Done when: the AI entry point is visible in the build flow, the hand-off
contract (prompt + context in → `Workout` draft out → editing surface) is
written down, and nothing about it is wired to a real request.

#### Phase 3 — Live in-workout editing

Follow the plan, adjust as reality happens. Reuses the editing mechanics built
in 2a as much as possible.

- Open a saved planned workout into an "active workout" view.
- Tap-to-edit inline on each set's reps/weight — overwrite with what actually
  happened without leaving the screen.
- Swap an exercise for a different library exercise (open question: keep or
  clear its planned sets).
- Add/remove sets live, ideally the same underlying components as the builder.
- Changes save back to the same workout record, so what's stored reflects what
  was actually done.

Open design question carried over: is the live in-workout screen the _same_
screen as the 2a editing surface, or a distinct one? The original roadmap made
them deliberately separate; the re-sequencing (2a now covers most of the same
editing mechanics) may make sharing one screen the better call. Decide when
building Phase 3.

Done when: I can open a planned workout, change a weight/rep on a specific set
mid-workout, swap an exercise, add a set, and have all of it persist when I back
out and reopen later.

#### Phase 4 — Edit and delete past workouts

- Enter an edit mode for a past workout from the detail screen (reuses the
  editing surface).
- Delete a workout with a confirmation step (no silent data loss).
- Delete cascades correctly: removing a workout removes its exercises and their
  sets — no orphaned rows.

Done when: I can correct or remove a past workout and the database stays
consistent.

#### Phase 5 — Notes (lightweight, time-permitting)

- A single free-text notes field per workout (not per exercise/set).
- Editable from the Phase 4 edit flow.
- No AI involvement yet — just a place to jot something down. (Note: this pairs
  naturally with the V5 AI work, since a note like "legs were tight today" is
  exactly the kind of context the AI producer would use.)

Done when: I can add and edit a short note on a workout, and it persists.

#### Phase 6 — Filter the exercise library

- Add filter controls to the library and exercise-picker screens (equipment,
  category, primary muscle).
- Extend search or add a function that accepts optional filters and builds the
  WHERE clause dynamically.
- Consider trimming the 873-exercise dataset to exercises relevant to my
  training before adding filters.

Done when: I can filter the exercise list by equipment, category, or muscle
group in addition to searching by name.

#### Phase 7 — Polish and document

- Styling consistency across all new screens against existing ones.
- Empty/edge states (empty search, workout with zero exercises, empty draft).
- Tab bar polish (icons, labels, header titles).
- Update README for V4's capabilities.
- Reflection: what was hard, what surprised me, what changed from this plan —
  including an honest pace check against the two-week-per-version target before
  committing to V5/V6.

### V4 complete when

- I can build a workout by starting from a past workout and adjusting it.
- A planned workout can be followed during a session with live editing of sets,
  reps, weight, and exercises.
- Past workouts can be edited or deleted, with correct cascade deletes.
- The AI build entry point is visibly present with its hand-off contract
  designed, ready to be made real in V5.
- The schema correctly models multiple sets per exercise.
- The app is something I'm actually using at the gym, not just viewing seeded
  data.

### Open questions / decide-when-you-get-there

- **Editing surface vs. live in-workout screen:** one shared screen or two
  separate ones? (Phase 2a / Phase 3)
- **Past workout vs. preset/template:** are these the same mechanism (a preset
  is just a saved workout you clone) or genuinely different? Presets like
  push/pull/legs are an idea worth capturing but not yet scoped into a phase.
- **Exercise swap in Phase 3:** does swapping keep its planned sets or clear
  them?
- **AI context (deferred to V5, but shapes the 2b seam):** what exactly gets
  passed to the AI — how many past workouts, filtered by muscle group or
  recency, plus notes?

---

## V5 — AI feedback (updated)

The AI seam is designed and stubbed in V4 Phase 2b, so V5 is "make the stub
real" rather than "figure out where AI goes."

- Implement the AI workout producer behind the V4 stub: take my text prompt
  plus past-workout context, call the Anthropic API, and turn the response into
  a valid `Workout` draft that feeds the existing editing surface.
- The real engineering here (flagged early so it's not a surprise): asynchronous
  network requests that can fail or time out, API key handling, prompt design,
  passing the right past-workout context, and — the underestimated part —
  validating that the model's response is a well-formed `Workout` and handling
  it gracefully when it isn't.
- Build and verify the producer in isolation first (log the `Workout` object,
  feed a hardcoded one to the editing surface) before wiring a live request, so
  every bug is contained to the AI layer.
- In-workout and post-workout feedback: tell the AI something ("hamstring hurt
  on that set") and get suggestions, including proposed changes to accept.
- Full notes support builds on V4 Phase 5's lightweight version.

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
