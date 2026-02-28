# reading-goals-insights (delta)

## Clarification

### Requirement: Quick update of current page from home (Llegint ara)

When the user updates book data (e.g. total pages) from the edit form for a book in "Llegint" status, the system SHALL preserve the book's status and all existing fields so that the "Llegint ara" block on the home page remains visible after save. The update payload SHALL be merged with the existing book (e.g. `{ ...existingBook, ...formData }`) so that fields not present in the form (such as `status`) are not lost.
