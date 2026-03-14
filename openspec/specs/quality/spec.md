# quality

## Requirements

### Requirement: Unit test coverage for critical utils

The project SHALL include unit tests for critical utility modules to reduce regressions.

- **helpers.safeProgress:** SHALL be tested for valid inputs (0–100), null/undefined, negative values, values exceeding total pages, zero total pages, and NaN.
- **readingInsights:** The functions `computePace`, `computeETA`, and `getWeeklyPagesRead` SHALL have unit tests covering base cases and edge cases (empty input, insufficient data, negative deltas ignored, multiple entries per day aggregated).

### Requirement: CI runs tests

The project SHALL run the test suite in CI (e.g. GitHub Actions) on every push and pull request to the default branch. The workflow SHALL execute `npm run test:run` (or equivalent) and fail the build if tests fail. The CI SHALL also run `npm run test:coverage` to enforce coverage thresholds.

### Requirement: Coverage and gamification/userPrefs tests

The project SHALL configure Vitest coverage (v8) with thresholds. Objectiu mínim: 70% (línies, funcions, branches); es pot iniciar amb umbral menor documentant el gap i augmentar incrementalment.

- **gamificationService:** The functions `pointsToLevel` and `pointsToNextLevel` SHALL have unit tests covering base cases and edge cases (nivells 1–71, màxim 71, progressPct).
- **userPrefsService:** The function `computeStreak` SHALL have unit tests covering ratxa consecutiva, avui no present (0), ordre invers, dies buits.
