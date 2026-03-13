# reviews (delta)

## NEW Requirements

### Requirement: Deduplicate books in reviews (original title + author)

The system SHALL avoid duplicate book entries in the reviews system by using **original title** and **author** as the canonical identifier for a book. All reviews of the same book SHALL be grouped together.

- **Original title mandatory:** When a user adds a book or publishes a review, they SHALL provide the original title of the book (e.g. "Harry Potter and the Philosopher's Stone" for translations).
- **Canonical catalog:** The system SHALL maintain a global catalog of books identified by (normalized original title, normalized author). When publishing a review, the system SHALL look up or create the catalog entry and associate the review with it.
- **Normalization:** When comparing titles and authors, the system SHALL ignore: case, extra spaces, common punctuation variations (e.g. `&` vs `and`), and dots in author names (e.g. "G. R. R. Martin" = "George R R Martin").
- **Association:** If a catalog book exists with the same normalized original title and author, the new review SHALL be associated with it. If not, a new catalog entry SHALL be created.
- **Display:** Reviews belonging to the same catalog book SHALL be displayed grouped under that book.
- **Backward compatibility:** For existing books without `originalTitle`, the system SHALL use `title` as fallback when publishing a review. New books SHALL require `originalTitle` when the book will be eligible for reviews (completed status).
