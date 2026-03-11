# reviews (delta)

## ADDED Requirements

### Requirement: Reviews section access

When an authenticated member accesses the main navigation, the system SHALL display a new section named "Ressenyes". When the member taps Ressenyes, they SHALL access the list of available reviews.

### Requirement: Reviews list display

When a member accesses the Ressenyes section, the system SHALL display a paginated list of reviews with at least: book title, author, member who published, publication date, like count, and like button. The review text SHALL appear truncated in summary view.

### Requirement: Expandable review view

When a member taps a review in the list, the system SHALL expand it to show full content. When the member taps again or selects another review, the previous one SHALL collapse.

### Requirement: Pagination

When there are more than 10 reviews, the system SHALL show pagination. Each page SHALL display 10 reviews. When the member changes page, the system SHALL load the corresponding reviews.

### Requirement: Like system

When a member taps Like on a review, the like count SHALL increase by 1. If the member has already liked that review, the button SHALL show "Liked" (or equivalent). Tapping again SHALL remove the like and decrease the count by 1.

### Requirement: Duplicate like prevention

The system SHALL NOT create duplicate likes for the same member on the same review. Each member MAY have at most 1 like per review. Like operations SHALL be atomic to handle concurrent likes.

### Requirement: Search reviews

When a member uses the search field, the system SHALL filter reviews by: book title, author, and member name.

### Requirement: Filters

The system SHALL allow filtering by: title, author, member, and publication date. When filters are active, pagination SHALL apply to the filtered results. When search or filters return no results, the system SHALL display "No s'han trobat ressenyes amb aquests criteris." and an option to clear filters.

### Requirement: Publish reviews

When a member has completed a book, they SHALL be able to publish a new review with: book title, author, and review text. The review SHALL appear in the list ordered by publication date (newest first).

### Requirement: Truncation of long reviews

When a review exceeds 250 characters, the system SHALL show a truncated summary with a "Llegir més" option. When the member selects "Llegir més", the full review SHALL be displayed.

### Requirement: Deleted member author display

When the author's account is deleted, the review SHALL remain but the author SHALL be displayed as "Membre eliminat". Like counts SHALL be preserved.
