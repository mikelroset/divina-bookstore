# book-library

## Requirements

### Requirement: Completion celebration

When the user saves a progress update and the resulting progress equals the total pages (100% completion), the system SHALL show a brief celebration.

- **Trigger:** The celebration SHALL trigger only on the transition from progress < total pages to progress = total pages. It SHALL NOT trigger when re-saving the same value or when the book was already completed.
- **Animation:** The system SHALL display a confetti animation.
- **Message:** The system SHALL display a short, positive congratulations message that auto-dismisses after a few seconds. Message examples MAY rotate (e.g. "Enhorabona! Has acabat el llibre.", "Brutal! Llibre completat.", "Objectiu aconseguit. Ben fet!").
- **Non-blocking:** During the celebration, the user SHALL be able to continue interacting with the app (no modal, no freeze).
- **Edge cases:** If total pages is null, 0, or invalid, the celebration SHALL NOT trigger. If progress exceeds total pages, the celebration SHALL NOT trigger. The celebration SHALL be idempotent (at most once per completion transition).

### Requirement: Book card rating display

On the library view, each book card SHALL display the book's rating using star icons from Lucide React (not emojis). The system SHALL show filled stars (primary/green color) for the rating value assigned by the user, and empty stars (gray) for the remaining stars up to 5 total.

- If a book has a rating of 1-5, the system SHALL display that many filled stars followed by empty stars (e.g., rating 3 = 3 filled + 2 empty).
- If a book has no rating (rating is 0, null, or undefined), the system SHALL display 5 empty stars (gray).

The star icons SHALL use the `Star` component from Lucide React with appropriate styling: `fill-primary-500 text-primary-500` for filled stars and `text-slate-300` for empty stars.

### Requirement: Book cover placeholder

When a book has no cover URL or the cover image fails to load, the UI SHALL display a placeholder that maintains the same size and aspect ratio as a real cover, without causing layout shift. The placeholder SHALL be visually neutral (e.g. slate background, book icon) and not distract from real covers. Images (real or placeholder) SHALL have appropriate alt text: "Portada de {títol}" or "Portada no disponible". Image load errors SHALL be handled gracefully with fallback to placeholder, without blocking rendering or causing console errors that affect the user experience.
