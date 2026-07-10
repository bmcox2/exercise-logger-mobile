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

## V4 Phase 3 — The in-workout flow (In Depth)

### What this phase is

Phase 3 turns a saved _planned_ workout into something I actually do at the
gym: one exercise on screen at a time, logging what I actually lifted against
what I planned, stepping through each set, with live edits and timers, until
the workout is finished and flips from `"planned"` to `"completed"`.

This is the largest phase in V4 by far, and it's the first time a single
screen carries this much at once (current exercise, set progression, editable
actuals, timers, a live-edit menu). So it's broken into sub-phases the way
Phase 2 was, built spine-first: get the core set-logging loop working, then
hang everything else off it.

Modeled loosely on the Volt app's in-workout flow, with two deliberate
departures from Volt noted below.

### Two decisions already made

- **Flat, not grouped.** Volt organizes exercises into groups (supersets /
  circuits) and cycles set-by-set through a group. My data model is flat —
  a workout is a list of exercises, each with a list of sets — and the
  in-workout flow follows that: one exercise, do all its sets, then the next
  exercise. Groups/supersets are a possible future version, not V4; adding
  them now would mean a schema change and threading group structure through
  everything already built.
- **Timers are in scope, but come last within Phase 3**, because they
  introduce genuinely new concepts (intervals, effect cleanup) that are
  separable from the core logging loop.

---

### Phase 3a — Start a workout & the core set-logging loop (the spine)

The thing everything else feeds. Build the simplest version that works end to
end before adding anything on top.

- **Entry point:** a way to pick a saved _planned_ workout and start doing it.
  Reuses `getWorkouts("planned")`. Likely a list screen similar in shape to
  `SelectSourceWorkout`. (Design decision below: where this lives, and whether
  it connects to the save-vs-start open question.)
- **The active-workout state:** load the planned workout and represent it in a
  form that tracks, per set, the _planned_ target and the _actual_ value the
  user logs, plus which exercise/set is current, plus which sets are done.
- **The screen:** one exercise on screen at a time; current set indicator
  ("SET 1 2 3"); planned weight/reps shown as the starting hint; an editable
  field for actual weight/reps; a "Done" button that logs the actual values
  and advances to the next set, then the next exercise.
- **Progress indicator** across the whole workout (Volt's top bar).
- **Completion:** when the last set of the last exercise is done, the workout
  flips `"planned"` → `"completed"`, the actual logged values are saved,
  `durationMinutes` is set (from a start-to-finish elapsed time), and the app
  navigates out. This reuses the one-save-path principle: on completion it
  produces the same shape `addWorkout(..., "completed")` already consumes.

**The first and most important design decision — the active-workout data
structure.** During a workout, each set needs more than a `DraftWorkoutSet`
carries: a _planned_ value (the target, shown as a hint) AND an _actual_ value
(what I did) AND a done flag; plus the workout needs a progression pointer
(current exercise / current set). Options to weigh when building 3a:

- reuse `DraftWorkout` and overwrite reps/weight with actuals in place, tracking
  progression in separate component state (simplest, but loses the planned
  value once overwritten — and the UI wants to show planned-as-hint alongside
  actual);
- a richer `ActiveWorkout` structure where each set holds planned + actual +
  done (more faithful to the UI, more to build);
- something in between.
  Decide this first, with the UI's needs (show target + type actual) as the
  deciding input.

**Other 3a decisions:**

- Where does "start a workout" live — a new tab, the Workouts tab, a future
  home screen? (Ties to the still-open save-vs-start question: does building a
  workout flow directly into doing it, or are they separate entry points?)
- Whether a `useReducer` (like the builder) is the right tool for progression +
  actuals, or whether this is simpler with plain state.

**Done when:** I can pick a planned workout, step through every exercise and
set logging actual reps/weight, finish it, and see it appear in my completed
history with the correct actual values and a real duration.

---

### Phase 3b — Live edits mid-workout (the actions menu)

Volt's "Actions" menu (replace movement, add set, write note). Most of this
reuses reducer actions and the exercise picker already built in Phase 2.

- An actions menu (bottom sheet / modal) opened from the active workout screen.
- **Add set** live — reuses the `ADD_SET` concept.
- **Replace exercise** — reuses the `SelectExerciseForBuild` picker flow and the
  callback-based navigation pattern from Phase 2.
- **Remove set** if wanted.
- **Write note** — either a lightweight note now (pairs with Phase 5) or a stub
  pointing at it; a mid-workout note ("machine was taken, subbed X") is exactly
  the kind of context the V5 AI will want.

**Design decision (already flagged in the roadmap's open questions):** when I
replace an exercise mid-workout, does the new exercise keep the old one's
planned sets, or start fresh? Decide here.

**Done when:** mid-workout I can add a set, replace an exercise for a different
one from the library, and have those changes persist into the completed record.

---

### Phase 3c — Timers

The genuinely new-concept chunk. Kept separate because intervals and effect
cleanup are new territory and shouldn't be entangled with the core loop while
learning them.

- **Rest timer between sets** — a count-up timer that auto-starts when I finish
  a set and runs until I dismiss it (matches how I actually rest-time my own
  workouts). Requires **no data-model change** — it works for any exercise.
  This is the first timer to build.
- **New concept:** `setInterval`, storing timer state, and cleaning up the
  interval in a `useEffect` return function so it doesn't leak or keep running
  after the component unmounts.
- **Exercise / hold timer** (Volt's timed holds, e.g. 30–60 sec) — a count-up
  or countdown for timed exercises. This one **does** need a data-model
  decision (see open questions): my schema has no concept of a "timed"
  exercise, only reps + weight. The hold timer may be deferred within 3c, or to
  a later version, depending on how big that model change turns out to be.

**Done when:** a rest timer starts automatically after I finish a set and
counts up until I dismiss it. (Stretch: timed exercises show a hold timer.)

---

### Phase 3d — Post-workout summary (lightweight)

The completion _transition_ lives in 3a; this adds a simple summary of what
just happened.

- A basic post-workout summary screen (total time, exercises done, maybe total
  volume) — a light version of Volt's summary, reusing existing detail-render
  patterns. Rich stats/charts (Volt's movement-pattern breakdowns) are backlog.
- Lands the user back somewhere sensible afterward.

**Done when:** finishing a workout shows a basic summary and returns me to a
sensible screen.

---

### Kept in mind but explicitly deferred (V5 / backlog)

These appear in the Volt screenshots and are worth designing _around_ — leaving
clean hook points — without building now. Unlike the AI builder button (a
persistent visible stub), these are transient modals that can slot in at their
trigger points later without redesigning the flow, so they need integration
_awareness_, not stubs:

- **Pre-workout readiness check-in** (Volt image 4) → fires before a workout
  starts; feeds V5 AI. Hook point: the "start workout" action in 3a.
- **Per-set effort / RPE** (image 9) → fires between sets; feeds V5 AI 1-rep-max
  and progression estimates. Hook point: the "Done" action in 3a.
- **Post-workout feedback** (effort slider, enjoyment, notes — image 11) → fires
  on completion; feeds V5 AI. Hook point: the completion transition in 3a / the
  summary in 3d.
- **Video / image demos** per exercise → polish; stub the image area for now.

### Open questions / data-model gaps to decide when reached

- **Active-workout data structure** (3a) — reuse `DraftWorkout` or a richer
  planned+actual+done shape. The biggest single decision in the phase.
- **Start-workout entry point** (3a) — new tab, Workouts tab, or future home
  screen; and whether build flows directly into doing.
- **Replace-exercise keeps or clears sets** (3b).
- **Timed vs rep-based exercises** (3c) — the schema is reps + weight only. Volt
  has timed holds ("30–60 sec"), bodyweight ("BW", no weight), and unilateral
  ("15 reps each"). Supporting timed exercises + their hold timer needs a model
  change (an exercise "type" or a duration field). Decide scope when reaching
  3c; may defer the timed-exercise support itself to a later version even if the
  rest timer ships in V4.

### Whole-picture connections to preserve

- On completion, the active workout must produce the same shape
  `addWorkout(..., "completed")` consumes — the one-save-path principle carries
  straight through from Phase 2.
- Mid-workout notes (3b) connect to Phase 5 (notes) and to V5 (AI context).
- The planned→completed lifecycle built in Phase 2's schema is what this whole
  phase operates on — 3a is where the `"completed"` half of that column finally
  gets used.

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
- **Save vs. start (Phase 3):** are "save for later" and "start this workout
  now" separate actions, or does building flow directly into doing?
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
- (New, V4 Phase 2a) `handleSave` in `BuildWorkoutScreen` has no try/catch around `addWorkout` — a failed save fails silently with no user-facing error. Add proper error handling in Phase 7.
