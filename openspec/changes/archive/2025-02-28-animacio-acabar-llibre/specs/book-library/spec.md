# book-library (delta)

## NEW Requirements

### Requirement: Completion celebration

When the user saves a progress update and the resulting progress equals the total pages (100% completion), the system SHALL show a brief celebration.

- **Trigger:** The celebration SHALL trigger only on the transition from progress < total pages to progress = total pages. It SHALL NOT trigger when re-saving the same value or when the book was already completed.
- **Animation:** The system SHALL display a confetti animation.
- **Message:** The system SHALL display a short, positive congratulations message that auto-dismisses after a few seconds. Message examples MAY rotate (e.g. "Enhorabona! Has acabat el llibre.", "Brutal! Llibre completat.", "Objectiu aconseguit. Ben fet!").
- **Non-blocking:** During the celebration, the user SHALL be able to continue interacting with the app (no modal, no freeze).
- **Edge cases:** If total pages is null, 0, or invalid, the celebration SHALL NOT trigger. If progress exceeds total pages, the celebration SHALL NOT trigger. The celebration SHALL be idempotent (at most once per completion transition).
