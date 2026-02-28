# reading-goals-insights (delta)

## MODIFIED Requirements

### Requirement: Mini-chart of weekly progress (Llegint ara)

Within the "Llegint ara" block (home) and the book edit view when the book is in "Llegint" status, the system SHALL include a simple mini-chart showing page progress over the last 7 days.

- **Pages read per day:** The chart SHALL show the number of **pages read** per day (not only a proportional bar). Each bar SHALL display a visible label with the numeric value (integer) of pages read that day.
- **Aggregation:** If there are multiple log entries on the same day, the value for that day SHALL be the sum of pages read (positive deltas between consecutive entries). Negative deltas (e.g. correction, re-reading) SHALL count as 0 for that transition.
- **Empty state:** When there is no reading data in the period, the chart SHALL show an empty state consistent with the UI; no page labels SHALL be shown.
- **Format:** The label SHALL be short (e.g. "12" or "12 pàg.") and the UI SHALL be in Catalan.
