# reading-goals-insights

## Requirements

### Requirement: Annual reading goal and progress

The system SHALL allow the user to set an annual reading goal (number of books) from their profile. The system SHALL display a visual progress bar showing completed books vs goal (e.g. percentage) on the profile and/or dashboard.

The annual goal value SHALL be persisted to storage (e.g. Firestore prefs) when the user changes it (on blur or on a debounced update). The profile form SHALL allow the user to type the number normally (e.g. "10" without the field forcing a leading zero or showing "010"). After page refresh or re-login, the saved annual goal SHALL be loaded and displayed correctly.

### Requirement: Pace-based completion prediction

The system SHALL compute the user's average reading pace (pages per day) from "current page" updates over the last 7 days. On the currently-reading book view, the system SHALL display dynamic text: "Al teu ritme actual, acabaràs aquest llibre en X dies (Data estimada: DD/MM)". If pace is zero or negative (no activity or re-reading), the system SHALL NOT show an estimated date and SHALL show a motivational empty state (e.g. "Llegeix unes quantes pàgines per calcular el teu ritme!").

### Requirement: Daily streak

The system SHALL show a "streak" (fire) icon on the Dashboard. The streak SHALL increase each day the user updates "current page" on any book. If a day passes with no such activity, the streak SHALL reset to zero.

The system SHALL record the current calendar day in the user's reading activity when the user saves a book with an updated "current page" (e.g. from the Add/Edit book form). The streak SHALL be computed from this stored list of activity days (consecutive days up to and including today) and SHALL be loaded and displayed on the Dashboard so that it is not always zero when the user has been reading on consecutive days.

### Requirement: Mini-chart of weekly progress

Within the book detail view (for the book being read), the system SHALL include a simple mini-chart showing page progress over the last week.

### Requirement: Home dashboard block UI consistency

On the home page (dashboard), all blocks SHALL share the same visual format:

- **Icons:** Each block SHALL display an icon at the start of its title. Icons SHALL be themed to the block (e.g. streak block with flame; other blocks with an appropriate icon each). All block icons SHALL use the same color (primary/green) for visual consistency. Affected blocks include: Ratxa, Aquest mes, Gènere preferit, Total llibres, Objectiu anual, Progrés global de lectura, Llegint ara.
- **Typography:** All block titles SHALL use the same typography and SHALL use sentence case (only the first letter of the title in uppercase). Target titles: "Ratxa", "Aquest mes", "Gènere preferit", "Total llibres", "Objectiu anual", "Progrés global de lectura", "Llegint ara".

### Requirement: Quick update of current page from home (Llegint ara)

On the home page, within the "Llegint ara" block, the system SHALL allow the user to update the current page count of the book they are reading without opening the full edit form.

- The block SHALL display an input field pre-filled with the current page value and a button to save the new value.
- On save, the system SHALL persist the new `currentPage` and update `pageLog` (same logic as when saving from the book form: append today's entry, keep last 7 days). The system SHALL call the reading activity recording (e.g. for streak) when the user saves.
- The UI SHALL reflect the updated value immediately after a successful save.
- Validation: the value SHALL be a non-negative integer; if the book has a total `pages` value, the new current page SHALL NOT exceed it; the new value SHALL NOT be less than the current value (no "negative progress" from this block). Empty or non-numeric input SHALL show an inline error and SHALL NOT be saved.
- On network or persistence error, the system SHALL show an error message and keep the previous value visible in the UI.
- If there is no book in "Llegint" status, the block SHALL NOT be shown or SHALL show a clear empty state (e.g. "No tens cap llibre en lectura").
- On desktop, the layout of the block SHALL not show visible blank gaps (e.g. when a row does not fill all columns).
- When the user updates book data (e.g. total pages) from the edit form for a book in "Llegint" status, the system SHALL preserve the book's status and existing fields (e.g. by merging the update with the existing book) so that the "Llegint ara" block remains visible after save.

### Requirement: Edge cases and data protection

- If average pages per day over the last 7 days is ≤ 0, the system SHALL NOT show an estimated completion date and SHALL show the motivational empty state.
- If the user decreases "current page" (re-reading), the pace algorithm SHALL ignore negative deltas (e.g. keep previous pace or set to 0 until positive updates).
- If a book is "Llegint" but has 0 total pages, the system SHALL prompt for total pages before enabling completion prediction and insights.
