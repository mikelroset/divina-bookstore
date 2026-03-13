# reading-goals-insights (delta)

## MODIFIED Requirements

### Requirement: Global reading progress bar

The "Progrés global de lectura" block on the home page SHALL display the aggregate progress across **all** books in "Llegint" (reading) status.

- **Calculation:** The percentage SHALL be computed as: (sum of `currentPage` of all reading books) / (sum of `pages` of all reading books) × 100, rounded to the nearest integer.
- **Multiple books:** When the user has 2 or more books in "Llegint" status, the progress SHALL reflect the combined progress (e.g. 50/200 + 30/100 = 80/300 ≈ 27%), not 0% or any single-book value.
- **Data types:** The system SHALL coerce `pages` and `currentPage` to numbers before summing (e.g. when values come from storage as strings). Invalid or missing values SHALL be treated as 0.
- **Empty state:** When there are no books in "Llegint" status or when total pages is 0, the progress SHALL display 0%.
