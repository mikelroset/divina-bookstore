# reading-goals-insights

## Requirements

### Requirement: Annual reading goal and progress

The system SHALL allow the user to set an annual reading goal (number of books) from their profile. The system SHALL display a visual progress bar showing completed books vs goal (e.g. percentage) on the profile and/or dashboard.

The annual goal value SHALL be persisted to storage (e.g. Firestore prefs) when the user changes it (on blur or on a debounced update). The profile form SHALL allow the user to type the number normally (e.g. "10" without the field forcing a leading zero or showing "010"). After page refresh or re-login, the saved annual goal SHALL be loaded and displayed correctly.

### Requirement: Pace-based completion prediction

The system SHALL compute the user's average reading pace (pages per day) from "current page" updates over the last 7 days. On the currently-reading book view, the system SHALL display dynamic text: "Al teu ritme actual, acabaràs aquest llibre en X dies (Data estimada: DD/MM)". If pace is zero or negative (no activity or re-reading), the system SHALL NOT show an estimated date and SHALL show a motivational empty state (e.g. "Llegeix unes quantes pàgines per calcular el teu ritme!").

### Requirement: Daily streak

The system SHALL show a "streak" (fire) icon on the Dashboard. The streak SHALL increase each day the user updates "current page" on any book. If a day passes with no such activity, the streak SHALL reset to zero.

### Requirement: Mini-chart of weekly progress

Within the book detail view (for the book being read), the system SHALL include a simple mini-chart showing page progress over the last week.

### Requirement: Edge cases and data protection

- If average pages per day over the last 7 days is ≤ 0, the system SHALL NOT show an estimated completion date and SHALL show the motivational empty state.
- If the user decreases "current page" (re-reading), the pace algorithm SHALL ignore negative deltas (e.g. keep previous pace or set to 0 until positive updates).
- If a book is "Llegint" but has 0 total pages, the system SHALL prompt for total pages before enabling completion prediction and insights.
