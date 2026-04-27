# Candidate Pipeline Kanban Board

A standalone recruiter pipeline board built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **Redux Toolkit**.

This project implements Task 2 from the assignment brief and focuses on fast candidate triage through drag-and-drop workflow management.

---

## Run locally

```bash
npm install
npm run dev
```

Open: `http://localhost:3000`

---

## What this submission includes

### Core requirements

- 5-stage Kanban board:
  - Applied
  - Screening
  - Interview Scheduled
  - Under Review
  - Hired / Rejected
- Candidate cards with:
  - name
  - role
  - experience
  - score badge with color coding
- Drag-and-drop card movement between columns
- Drop-target highlight while dragging over columns
- Candidate detail slide-over panel (right side)
- Filter bar with:
  - role filter
  - score min/max filters
  - clear filters action
- Redux Toolkit for all board state
- Local persistence of candidate stages via `localStorage`

### Advanced features implemented (3)

1. **Undo last move**
   - Visible Undo button
   - Keyboard shortcut: `Ctrl+Z` (and `Cmd+Z` on macOS)
2. **Optimistic UI move with failure rollback**
   - Move happens instantly in UI
   - Simulated API latency: `300ms`
   - Random failure rate: `20%`
   - On failure: automatic rollback + error toast/snackbar
3. **Live search with debounce**
   - Candidate name search input
   - `300ms` debounce before applying filter

---

## Architecture decisions

## 1) App and rendering boundary

- Uses Next.js App Router shell, but board itself is loaded as a **client-only module** via dynamic import with `ssr: false`.
- Reason: this interaction-heavy surface (drag/drop events, localStorage, keyboard listeners) is fully client-state-driven, so disabling SSR avoids hydration edge cases and keeps runtime logic straightforward.

## 2) State model (Redux Toolkit)

Board state is split into two slices:

- `board` slice:
  - `candidates`
  - `filters`
  - `lastAction` (for undo)
- `sidebar` slice:
  - `selectedCandidateId`
  - `isOpen`

Why this split:
- Keeps pipeline data transitions separate from UI chrome state.
- Simplifies selector ownership and reduces accidental coupling.

## 3) Selector-first data access

- Components do not receive candidate lists via prop drilling.
- They subscribe directly to memoized selectors (`createSelector`).
- Filtering and stage grouping happen in selectors, not components.

Why this matters:
- Reduces rerender churn.
- Keeps component code presentational and readable.
- Keeps filtering logic centralized and testable.

## 4) Move flow design (optimistic first)

When dropping a card:
1. Dispatch `moveCandidate` immediately (instant feedback).
2. Trigger simulated network call (`300ms`, 20% fail chance).
3. If call fails:
   - dispatch `undoMove`
   - show error snackbar

Why this design:
- Recruiter-facing workflows are latency-sensitive.
- Optimistic update keeps interactions snappy.
- Rollback protects data integrity when backend update fails.

## 5) Undo strategy

- The slice stores a compact `lastAction` object (`candidateId`, `fromStage`, `toStage`).
- `undoMove` reverts the most recent successful stage mutation.
- Exposed through both Undo button and keyboard shortcut.

Trade-off:
- Single-level undo only (intentional scope control).

## 6) Persistence strategy

- On app startup: preload candidates from `localStorage` if present.
- On candidate state change: persist candidates back to `localStorage`.
- Filters are intentionally not persisted; they reset per session for predictable board entry behavior.

---

## Component structure

- `Board`: page-level assembly (header, filters, columns, drawer)
- `FilterBar`: role/score/search controls
- `Column`: stage drop zone + candidate count
- `CandidateCard`: draggable unit + quick summary
- `CandidateDrawer`: detailed candidate view
- `Snackbar`: transient error feedback for failed optimistic moves

Supporting layers:
- `store/`: slices, selectors, types
- `hooks/useBoard`: interaction hooks (`move`, `undo`, `sidebar`)
- `lib/store`: Redux store setup + persistence bootstrap

---

## Filtering behavior

Filters combine as logical AND:

- role match
- score range (`minScore <= score <= maxScore`)
- name contains query (case-insensitive)

Live search behavior:
- local input state updates every keystroke
- Redux filter update is delayed by `300ms`
- avoids dispatching on every key event

---

## UX and interaction choices

- Clear visual drop-target state on drag-over.
- Empty-state drop area when a column has zero visible cards.
- Slide-over detail panel keeps board context visible while inspecting a candidate.
- Error feedback appears as non-blocking toast/snackbar rather than modal interruption.

---

## Assumptions made

- `Hired / Rejected` is treated as one final column label per the brief.
- Role filter matches broad role families (`Frontend`, `Backend`, `Full Stack`) against full role titles.
- Persistence requirement applies to candidate stage state; filter state persistence is optional.

---

## Explicit cut

**Cut:** multi-level undo history stack.

**Reason:**
- The assignment asks for undo last move; implementing full history (especially with async rollback semantics) increases complexity and failure modes.
- Prioritized robust single-step undo + optimistic rollback correctness over deeper history mechanics.

---

## What I would improve with more time

- Add automated tests for selectors and move/undo reducer behavior.
- Add pointer + keyboard accessible drag-and-drop parity improvements.
- Add column stats (avg score / total) and virtualization threshold for large columns.
- Persist and display operation audit trail (move timestamps + actor).
- Replace simulated API with real endpoint and per-move retry UX.

---

## AI usage disclosure

- **Tools used:** ChatGPT (for README wording/polish only)
- **Estimated AI contribution:** ~10–15%
- **Used for:**
  - wording clarity
  - documentation structure
- **Entirely self-authored:**
  - architecture decisions
  - Redux slice/state model
  - drag/drop and optimistic move logic
  - undo interaction design
  - filter and selector logic

