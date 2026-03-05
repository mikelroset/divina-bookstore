# community-management (delta)

## NEW Requirements

### Requirement: One card per book on community screen

The community screen SHALL display each book in "Llegint" (reading) status as an **independent card**, not grouped inside a reader card.

- **Layout:** Each book SHALL be rendered as its own card. A user with multiple books in progress SHALL have multiple cards (one per book).
- **Card content:** Each card SHALL display: reader (avatar and display name), "està llegint" status text, book cover (or placeholder), title, author (if present), genre (if present), pages read / total pages, progress %, days reading, and "Encoratja" (encourage) button.
- **Ordering:** Cards SHALL be ordered by most recent activity (lastUpdatedAt or startDate descending), or by title if no date is available.
- **Interactions:** Click on card/book opens book detail; click on reader name/avatar opens user profile (if available). Encourage button SHALL show "Encoratjat" or be disabled when already encouraged for that book.
- **Guardrails:** Invalid progress (negative or > 100%) SHALL display "—"; missing genre SHALL be omitted (not "Sense gènere"); encourage API errors SHALL show non-intrusive error message and allow retry.
- **Performance:** Page SHALL load without perceptible degradation for up to ~50 users and ~10 books per user (up to 500 cards). Images MAY use lazy-loading.
