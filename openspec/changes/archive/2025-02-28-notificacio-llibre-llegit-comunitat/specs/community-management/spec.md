# community-management (delta)

## NEW Requirements

### Requirement: Book completed notification to community members

When a community member marks a book as completed (by updating progress to 100% or via form), the system SHALL notify other members of the same community.

- **Auto-complete:** When the user updates current page and the value is >= total pages (with total > 0), the book status SHALL automatically change to "completed". This SHALL NOT apply if total pages is empty or 0, or if progress decreased.
- **Notification creation:** When a book becomes completed, the system SHALL create a notification document per community the user belongs to. The notification SHALL include: book title, completed-by user name, completed-at date. Idempotency: no duplicate notification for the same (community, book) within a short period.
- **Display:** Other community members (excluding the completer) SHALL see a notification block on the Home page, with the same visual style as other blocks (e.g. encouragements).
- **Dismiss and expiry:** The notification SHALL have a "Tancar" (close) button. When pressed, it SHALL no longer be shown to that user. If not dismissed, it SHALL expire 3 days after creation (same logic as encouragements).
