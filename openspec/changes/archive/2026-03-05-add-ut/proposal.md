# Proposal: Feature – Add UT (Unit Tests)

## Objectiu

Afegir tests unitaris per augmentar la cobertura i reduir regressions a l'app.

## Abast

- Identificar mòduls crítics (utils: helpers, readingInsights; lògica de negoci pura).
- Crear UTs per als casos d'ús principals i edge cases.
- Assegurar que la suite es pot executar en CI.

## Deliverables

- Suite de tests executada amb `npm run test` / `vitest run`.
- Tests per a: `safeProgress`, `readingInsights` (computePace, computeETA, getWeeklyPagesRead).
- Workflow de CI (GitHub Actions) que executi els tests en cada push/PR.

## Referència

- [Notion – Feature: Add UT](https://www.notion.so/miquelroset/Feature-Add-UT-31a1492a70428042bcd0c48e8ec0afc6)
