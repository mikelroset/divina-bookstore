# quality (delta)

## NEW Requirements

### Requirement: Unit test coverage for critical utils

The project SHALL include unit tests for critical utility modules to reduce regressions.

- **helpers.safeProgress:** SHALL be tested for valid inputs (0–100), null/undefined, negative values, values exceeding total pages, zero total pages, and NaN.
- **readingInsights:** The functions `computePace`, `computeETA`, and `getWeeklyPagesRead` SHALL have unit tests covering base cases and edge cases (empty input, insufficient data, negative deltas ignored, multiple entries per day aggregated).

### Requirement: CI runs tests

The project SHALL run the test suite in CI (e.g. GitHub Actions) on every push and pull request to the default branch and feature branches. The workflow SHALL execute `npm run test:run` (or equivalent) and fail the build if tests fail.
