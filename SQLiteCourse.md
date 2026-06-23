# SQLite for Your Workout App — A Focused Course

A custom course built around exactly what you need: storing your workout data
on the device using `expo-sqlite`, in your React Native app, with your real
data model.

This is narrower than the JavaScript or React courses. SQL is a smaller thing
to learn, and you already understand your data. The goal is to get you from
zero to confidently reading and writing your workouts in a local database.

**Format (same as before):** concept → example → practice → quiz. You write
the code. I give feedback. Don't paste solutions you don't understand — type
things out so they register.

**A note on the why:** Phase 5 of your roadmap is "connect to real data." You
already decided SQLite over AsyncStorage because your data is relational —
workouts contain exercises, and you'll eventually want to query by date, filter
by muscle group, and calculate volume over time. This course is the foundation
for that decision.

---

## Module 1 — Thinking in Tables

### Concept

A relational database stores data in **tables**. A table is a grid: columns
define _what kind_ of data each row holds, rows are the actual records.

If that sounds like a spreadsheet, that's a useful first analogy — but a
database adds two things a spreadsheet doesn't have: strict types per column,
and relationships between tables.

Here's the mental shift from your current code. Right now your data lives as
TypeScript objects in an array:

```ts
const workout = {
  id: 1,
  name: "Pull Day",
  date: "2026-06-10",
  durationMinutes: 52,
  exercises: [
    /* ... */
  ],
};
```

In a database, that same workout becomes a **row** in a `workouts` table:

| id  | name     | date       | durationMinutes |
| --- | -------- | ---------- | --------------- |
| 1   | Pull Day | 2026-06-10 | 52              |

Notice what's missing: the `exercises` array. A database column can't hold an
array of objects. Instead, exercises live in their _own_ table, and each
exercise row points back to the workout it belongs to. That pointing-back is
the "relational" part, and it's Module 3. For now, just absorb that **one
object with a nested array becomes two tables.**

### Primary keys

Every table needs a way to uniquely identify each row. That's the **primary
key** — usually a column called `id`. No two rows can share a primary key. In
SQLite you can let the database assign these automatically, so you never have
to track "what's the next id" yourself.

### Column types

SQLite has a small, friendly set of types:

- `INTEGER` — whole numbers (`id`, `reps`, `durationMinutes`)
- `REAL` — decimal numbers (`weight`, if you ever log 22.5 lbs)
- `TEXT` — strings (`name`, `date`)
- `BLOB` — raw binary (you won't need this)

That's nearly all of them. SQLite is loose about types compared to other
databases, but you should still declare them clearly — it documents intent.

### Example

Here's what your `workouts` table definition will look like in SQL. Read it,
don't write it yet:

```sql
CREATE TABLE workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  date TEXT NOT NULL,
  durationMinutes INTEGER
);
```

Line by line:

- `CREATE TABLE workouts` — make a new table named `workouts`
- `id INTEGER PRIMARY KEY AUTOINCREMENT` — id column, auto-assigned, unique
- `name TEXT NOT NULL` — a string that must always be present
- `date TEXT NOT NULL` — SQLite has no real date type; dates are stored as
  text in `YYYY-MM-DD` format, which sorts correctly as plain strings
- `durationMinutes INTEGER` — a number; no `NOT NULL`, so it's allowed to be
  empty

### Practice

On paper or in a comment, design the table for your **exercises**. Look at your
`Exercise` type: `id`, `name`, `reps`, `weight`, `primaryMuscles[]`,
`secondaryMuscles[]`.

Write out the columns and the type you'd give each one. Two of those fields are
arrays — don't solve those yet, just flag them with a question mark. We tackle
arrays deliberately in Module 3. Bring me your table sketch.

### Quiz

1. Why can't the `exercises` array live as a column in the `workouts` table?
2. What does a primary key guarantee about a table?
3. How does SQLite store dates, and why does that format sort correctly?

---

## Module 2 — The Four Core Operations

### Concept

Almost everything you do with a database is one of four operations. People call
them **CRUD**: Create, Read, Update, Delete. In SQL these are:

- `INSERT` — add a new row (Create)
- `SELECT` — read rows (Read)
- `UPDATE` — change existing rows (Update)
- `DELETE` — remove rows (Delete)

For Phase 5, `INSERT` and `SELECT` are the priority — you need to save workouts
and read them back. `UPDATE` and `DELETE` become important in V4 when you build
editing.

### INSERT

Adds a row. You name the columns, then provide the values:

```sql
INSERT INTO workouts (name, date, durationMinutes)
VALUES ('Pull Day', '2026-06-10', 52);
```

Notice you don't provide `id` — `AUTOINCREMENT` handles it. The database hands
back the new id, which matters when you're inserting a workout and then need to
attach its exercises to it (Module 3).

### SELECT

Reads rows. The simplest form grabs everything:

```sql
SELECT * FROM workouts;
```

`*` means "all columns." You can name specific columns instead:

```sql
SELECT name, date FROM workouts;
```

### WHERE — filtering

This is where a database earns its keep. `WHERE` filters rows by a condition:

```sql
SELECT * FROM workouts WHERE id = 1;
SELECT * FROM workouts WHERE date = '2026-06-10';
```

Remember the `find` vs `filter` distinction from your detail screen? SQL is the
same idea, but the _database_ does the filtering instead of JavaScript. Instead
of loading all workouts into memory and filtering in code, you ask the database
for exactly the rows you want. At small scale the difference is invisible; as
your data grows it's the difference between fast and slow.

### ORDER BY — sorting

```sql
SELECT * FROM workouts ORDER BY date DESC;
```

`DESC` = descending (newest first), `ASC` = ascending. This is how your list
screen will show most-recent workouts at the top without you sorting in JS.

### Example

Putting it together — insert two workouts, then read them newest-first:

```sql
INSERT INTO workouts (name, date, durationMinutes) VALUES ('Pull Day', '2026-06-10', 52);
INSERT INTO workouts (name, date, durationMinutes) VALUES ('Push Day', '2026-06-08', 58);

SELECT * FROM workouts ORDER BY date DESC;
```

That `SELECT` returns Pull Day first (June 10), then Push Day (June 8).

### Practice

Write the SQL for each of these against your `workouts` table:

1. Insert a workout: "Leg Day", dated 2026-06-12, 65 minutes.
2. Select only the `name` and `durationMinutes` of every workout.
3. Select the full workout whose `id` is 3.
4. Select all workouts, sorted oldest-first.

Write all four, then bring them to me.

### Quiz

1. What does CRUD stand for, and which SQL keyword maps to each letter?
2. Why don't you include `id` when you `INSERT` a workout?
3. In plain English, what's the advantage of filtering with `WHERE` instead of
   loading every row and filtering in JavaScript?

---

## Module 3 — Relationships and the Array Problem

### Concept

This is the heart of relational databases, and it solves the two open problems
you've been carrying: how do exercises connect to a workout, and what do we do
about those muscle arrays?

### Foreign keys — connecting tables

An exercise belongs to a workout. We express that by giving the `exercises`
table a column that holds the `id` of its parent workout. That column is a
**foreign key** — a value that refers to a primary key in another table.

```sql
CREATE TABLE exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  reps INTEGER,
  weight REAL,
  FOREIGN KEY (workout_id) REFERENCES workouts(id)
);
```

The `workout_id` column is the link. If Pull Day has id 1, then every exercise
row from that workout has `workout_id = 1`. The last line formally declares the
relationship so the database can enforce it.

This is the table version of what your TypeScript already expresses with a
nested array. The array said "these exercises are inside this workout." The
foreign key says the same thing, pointed the other direction: "this exercise
belongs to that workout."

### Reading related data — JOIN

Once exercises point back to workouts, you can ask for them together. A `JOIN`
combines rows from two tables based on the relationship:

```sql
SELECT * FROM exercises WHERE workout_id = 1;
```

Honestly, for your app this simpler form is what you'll use most: "give me all
exercises for this workout." You'll load a workout, then load its exercises
with a query like the one above. Full `JOIN` syntax exists for combining tables
in a single query, but you can build your whole detail screen with two simple
selects — one for the workout, one for its exercises. Start there.

### The array problem — muscle groups

Your `Exercise` has `primaryMuscles: string[]` and
`secondaryMuscles: string[]`. A column can't hold an array. You have three real
options, and this is a genuine design decision worth making consciously:

**Option A — store as JSON text.** Keep the array as a JSON string in a single
column. `["lats", "biceps"]` gets saved as the literal text `'["lats","biceps"]'`,
and you `JSON.parse()` it when reading.

- Pro: dead simple, mirrors your current data exactly, no extra tables.
- Con: you can't easily query "all exercises that hit lats" in SQL — you'd
  filter in JS.

**Option B — comma-separated text.** Store `'lats,biceps'` and `split(',')`
when reading. Same tradeoffs as A but clumsier and more error-prone. Generally
skip this; JSON is cleaner.

**Option C — fully normalized.** A separate `muscles` table plus a junction
table linking exercises to muscles. This is the textbook-correct relational
design and makes "all exercises hitting lats" a clean query.

- Pro: proper relational design, powerful querying.
- Con: significantly more tables, joins, and code for a personal app.

**My recommendation: Option A (JSON text) for now.** Your muscle data is
display information — you show it on the detail screen, you don't yet query by
it. JSON storage matches your existing model, keeps the schema simple, and you
can migrate to Option C later _if and when_ you actually need to query by
muscle (likely in the stats work, V4/V5). Don't build the complex version for a
need you don't have yet. But make this choice knowing the tradeoff, and write
it in your design debt log — "muscle arrays stored as JSON; revisit if
cross-exercise muscle querying is needed."

### Example

Inserting a workout and then an exercise that belongs to it:

```sql
-- workout gets id 1 automatically
INSERT INTO workouts (name, date, durationMinutes) VALUES ('Pull Day', '2026-06-10', 52);

-- exercise points back to workout 1, muscles stored as JSON text
INSERT INTO exercises (workout_id, name, reps, weight)
VALUES (1, 'Lat Pull-down', 10, 120);
```

### Practice

1. You sketched an `exercises` table in Module 1. Rewrite it now as proper
   `CREATE TABLE` SQL, including the `workout_id` foreign key and your chosen
   approach for the muscle arrays (use Option A unless you have a reason not
   to).
2. In plain English, explain why a foreign key is the database equivalent of
   your nested `exercises` array.
3. Write the SQL to fetch all exercises belonging to the workout with id 2.

### Quiz

1. What is a foreign key, and what does it point to?
2. Why can't an array be stored directly in a column?
3. Why might storing muscles as JSON text be the right call _now_ even though
   it's not the "textbook correct" relational design?

---

## Module 4 — expo-sqlite: Running SQL from Your App

### Concept

Everything so far has been raw SQL. Now you connect it to React Native using
`expo-sqlite`, the Expo library that runs a real SQLite database on the device.
This is the bridge between the SQL you've learned and your actual app.

First, install it (this is the only setup command):

```powershell
npx expo install expo-sqlite
```

`npx expo install` again, not `npm install` — Expo picks the version compatible
with SDK 54.

### Opening the database

You open (or create, if it doesn't exist) a database by name. This returns a
database object you run everything through:

```ts
import * as SQLite from "expo-sqlite";

const db = await SQLite.openDatabaseAsync("workouts.db");
```

Notice `await`. Database operations are **asynchronous** — they take real time,
so they return promises. You saw `async/await` in the React course; this is
where it earns its place. Every database call gets awaited.

### The four methods you'll use

`expo-sqlite` gives you a few methods on `db`, each suited to a job:

**`execAsync`** — runs one or more SQL statements, returns nothing. Use it for
setup like `CREATE TABLE`:

```ts
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    durationMinutes INTEGER
  );
`);
```

`IF NOT EXISTS` means "only create it if it isn't already there" — safe to run
every time the app starts.

**`runAsync`** — runs a single `INSERT`, `UPDATE`, or `DELETE` with values, and
tells you what happened:

```ts
const result = await db.runAsync(
  "INSERT INTO workouts (name, date, durationMinutes) VALUES (?, ?, ?)",
  "Pull Day",
  "2026-06-10",
  52,
);
console.log(result.lastInsertRowId); // the new workout's id
```

**`getAllAsync`** — runs a `SELECT` and returns all matching rows as an array:

```ts
const workouts = await db.getAllAsync(
  "SELECT * FROM workouts ORDER BY date DESC",
);
```

**`getFirstAsync`** — runs a `SELECT` and returns just the first row (or
`null`):

```ts
const workout = await db.getFirstAsync(
  "SELECT * FROM workouts WHERE id = ?",
  1,
);
```

### The `?` placeholders — this matters

See those `?` marks? Those are **parameter placeholders**. Instead of jamming
values directly into the SQL string, you pass them separately and let the
library insert them safely.

```ts
// DO THIS
await db.runAsync("INSERT INTO workouts (name) VALUES (?)", userInput);

// NOT THIS
await db.runAsync(`INSERT INTO workouts (name) VALUES ('${userInput}')`);
```

The second version is vulnerable to **SQL injection** — if a value contained SQL
syntax, it could corrupt your query or database. The `?` approach is the
standard, safe way, and it's also cleaner. Build the habit now: **values always
go through `?`, never string interpolation.** This is one of those professional
practices that's easy to do right from the start and painful to retrofit.

### Example — a tiny setup-and-read flow

```ts
const db = await SQLite.openDatabaseAsync("workouts.db");

await db.execAsync(`
  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    durationMinutes INTEGER
  );
`);

await db.runAsync(
  "INSERT INTO workouts (name, date, durationMinutes) VALUES (?, ?, ?)",
  "Pull Day",
  "2026-06-10",
  52,
);

const workouts = await db.getAllAsync("SELECT * FROM workouts");
console.log(workouts);
```

### Practice

Don't wire this into your screens yet — just get comfortable with the methods.
In a scratch file or a temporary function, write code that:

1. Opens a database called `workouts.db`.
2. Creates the `workouts` table if it doesn't exist.
3. Inserts one workout using `?` placeholders.
4. Reads all workouts back with `getAllAsync` and logs them.

Match each task to the right method (`execAsync`, `runAsync`, `getAllAsync`).
Bring me what you write.

### Quiz

1. Which method do you use for `CREATE TABLE`? For `INSERT`? For a `SELECT`
   that returns many rows?
2. Why must every database call be `await`ed?
3. What are the `?` placeholders for, and what's the risk of skipping them and
   interpolating values into the SQL string directly?

---

## Module 5 — Replacing Mock Data in Your App

### Concept

Final module. Everything connects here: you swap `mockWorkouts` for real
database reads, so your app shows persistent data that survives restarts. This
is the actual Phase 5 deliverable.

The shape of the change is this. Right now your list screen does:

```ts
import { mockWorkouts } from "../data/mockData";
// ... data={mockWorkouts}
```

After this module, it instead _loads_ workouts from the database when the
screen opens, holds them in state, and renders from that state.

### Where database code should live

A design point worth pausing on. Don't scatter raw SQL across your screen
components. Screens should ask for data, not know how it's stored. Create a
dedicated file — something like `src/db/database.ts` — that owns all the SQL and
exposes clean functions:

```ts
export async function getWorkouts(): Promise<Workout[]> {
  /* SQL inside */
}
export async function getWorkoutById(id: number): Promise<Workout | null> {
  /* ... */
}
export async function addWorkout(workout: Workout): Promise<void> {
  /* ... */
}
```

Your screens call `getWorkouts()` and never see SQL. This is the same
separation-of-concerns principle from your C++ project — remember moving display
logic out of `Workout` and into `main`? Same idea: storage logic belongs in the
storage layer, not the UI. When you eventually change how data is stored, only
this one file changes.

### Loading data when a screen opens — useEffect

Your screen needs to load workouts _once_ when it mounts. That's exactly what
`useEffect` is for (you met it briefly in the React course). Combined with
`useState` to hold the result:

```tsx
const [workouts, setWorkouts] = useState<Workout[]>([]);

useEffect(() => {
  async function load() {
    const data = await getWorkouts();
    setWorkouts(data);
  }
  load();
}, []);
```

Walking through it:

- `useState<Workout[]>([])` — start with an empty array; this is what renders
  while the data loads.
- `useEffect(() => { ... }, [])` — the empty `[]` means "run once when the
  screen first appears."
- The `async function load()` inside — `useEffect` itself can't be async, so
  you define an async function and call it. Awkward-looking but standard.
- `setWorkouts(data)` — once data arrives, store it in state, which triggers a
  re-render with the real workouts.

Then your `FlatList` reads `data={workouts}` instead of `data={mockWorkouts}`.
Your empty-state handling from Phase 3 now does real work — it shows while data
loads and if the database is genuinely empty.

### Seeding initial data

A fresh database is empty. For testing, you'll want your two real workouts in
there. The clean approach: on app start, check if the database is empty, and if
so, insert your mock workouts once. After that they live in the database and the
mock file's job is done.

```ts
const existing = await db.getAllAsync("SELECT * FROM workouts");
if (existing.length === 0) {
  // insert your seed workouts here
}
```

This is a one-time bootstrap. Once real data is flowing, you can delete the seed
logic — or keep it behind the empty check, where it harmlessly does nothing.

### Handling the nested exercises

Remember: a workout and its exercises are now two tables. So `getWorkouts()`
returns workout rows _without_ their exercises attached. For the detail screen,
`getWorkoutById(id)` does two reads: fetch the workout, then fetch its exercises
with `SELECT * FROM exercises WHERE workout_id = ?`, and assemble them into the
`Workout` shape your screens already expect. And the muscle columns come back as
JSON text — `JSON.parse()` them back into arrays as you build each exercise
object.

The payoff: your screens don't change much at all. They already expect a
`Workout` with an `exercises` array. As long as your database functions return
that exact shape, the UI you built in Phases 3 and 4 keeps working — it just
reads from a real database now.

### Practice

This is the capstone, so build it in steps and check in between each:

1. Create `src/db/database.ts`. Add the open-database call and a function that
   creates both tables (`workouts` and `exercises`) if they don't exist.
2. Write `getWorkouts()` — returns all workouts (no exercises needed for the
   list screen).
3. Add seed logic: if the workouts table is empty, insert your two real
   workouts.
4. Update `WorkoutListScreen` to load from `getWorkouts()` with
   `useState`/`useEffect` instead of importing `mockWorkouts`.
5. Get the list showing real data on your phone. Then write `getWorkoutById()`
   (workout + its exercises, muscles JSON-parsed) and switch the detail screen
   over.

Do step 1, bring it to me, and we'll go from there rather than all at once.

### Quiz

1. Why should SQL live in a dedicated `database.ts` file instead of inside your
   screen components?
2. What does the empty `[]` second argument to `useEffect` do, and why does it
   matter here?
3. Your screens expect a `Workout` with a nested `exercises` array, but the
   database stores those in two separate tables. Whose job is it to reassemble
   that shape, and where does that happen?

---

## You're Ready When

- Your app opens, reads workouts from a real SQLite database, and shows them in
  the list.
- Tapping a workout loads it and its exercises from the database into the
  detail screen.
- You close the app, reopen it, and your workouts are still there.
- All SQL lives in your database layer, not your screens.
- Values always go through `?` placeholders.

That's Phase 5 complete — and the foundation for editing (V4) and everything
after. Work through it module by module. I'm here for feedback at each step.
