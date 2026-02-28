# reading-goals-insights (delta)

## NEW Requirements

### Requirement: Quick update of current page from home (Llegint ara)

On the home page, within the "Llegint ara" block, the system SHALL allow the user to update the current page count of the book they are reading without opening the full edit form.

- The block SHALL display an input field pre-filled with the current page value and a button to save the new value.
- On save, the system SHALL persist the new `currentPage` and update `pageLog` (same logic as when saving from the book form: append today's entry, keep last 7 days). The system SHALL call the reading activity recording (e.g. for streak) when the user saves.
- The UI SHALL reflect the updated value immediately after a successful save.
- Validation: the value SHALL be a non-negative integer; if the book has a total `pages` value, the new current page SHALL NOT exceed it; the new value SHALL NOT be less than the current value (no "negative progress" from this block). Empty or non-numeric input SHALL show an inline error and SHALL NOT be saved.
- On network or persistence error, the system SHALL show an error message and keep the previous value visible in the UI.
- If there is no book in "Llegint" status, the block SHALL NOT be shown or SHALL show a clear empty state (e.g. "No tens cap llibre en lectura").
- On desktop, the layout of the block SHALL not show visible blank gaps (e.g. when a row does not fill all columns).
