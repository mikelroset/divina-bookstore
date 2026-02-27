# reading-goals-insights (delta)

## MODIFIED Requirements

### Requirement: Daily streak

The system SHALL show a "streak" (fire) icon on the Dashboard. The streak SHALL increase each day the user updates "current page" on any book. If a day passes with no such activity, the streak SHALL reset to zero.

**Clarification (bug fix):** The system SHALL record the current calendar day in the user's reading activity when the user saves a book with an updated "current page" (e.g. from the Add/Edit book form). The streak SHALL be computed from this stored list of activity days (consecutive days up to and including today) and SHALL be loaded and displayed on the Dashboard so that it is not always zero when the user has been reading on consecutive days.
