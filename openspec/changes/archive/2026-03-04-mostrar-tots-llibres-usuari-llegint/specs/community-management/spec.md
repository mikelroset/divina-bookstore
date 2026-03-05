# community-management (delta)

## NEW Requirements

### Requirement: Multiple books in progress per user on community screen

The community screen SHALL show, for each member, **all** books that the member has in "Llegint" (reading) status, not only one.

- **Data:** The document `community/{userId}` SHALL support a `currentBooks` array (list of books in progress). Each item SHALL include at least: id, title, author (optional), coverUrl (optional), currentPage, pages, startDate, and lastUpdatedAt for ordering. The client SHALL sync all books with status "reading" to this array.
- **Display:** For each user (including the current user in the "Estàs llegint" section), the UI SHALL display a list of all books in progress. Each book SHALL show at least title, author if present, cover if present, and progress (pages or percentage). Progress that is inconsistent (negative or > 100%) SHALL be displayed as "—" or 0% without breaking the UI.
- **Ordering:** Books for a given user SHALL be ordered by most recent activity (lastUpdatedAt or startDate descending), or alphabetically by title if no date is available.
- **Empty state:** If a user has no books in progress, their module SHALL still appear with the message "Ara mateix no està llegint cap llibre." (or equivalent).
- **Performance:** The page SHALL load without perceptible degradation for up to ~50 users and up to ~10 books per user in progress.
