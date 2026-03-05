# Tasks: Add UT

## 1. safeProgress (helpers)

- [x] 1.1 Afegir tests per safeProgress a helpers.test.js: casos base (50/100→50, 0/100→0), edge cases (null, negatiu, > 100%, pages 0, NaN).

## 2. readingInsights

- [x] 2.1 Crear readingInsights.test.js amb tests per computePace: pageLog buit, 1 entrada (→0), 2+ entrades amb deltes positius, deltes negatius ignorats.
- [x] 2.2 Tests per computeETA: pages 0 → null, current >= pages → null, pace 0 → null, cas vàlid retorna daysLeft i dateStr.
- [x] 2.3 Tests per getWeeklyPagesRead: pageLog buit retorna 7 dies amb 0, múltiples entrades el mateix dia es sumen, format de sortida correcte.

## 3. CI

- [x] 3.1 Crear .github/workflows/test.yml que executi `npm run test:run` en push i pull_request a main i feature branches.

## 4. Verificació

- [x] 4.1 Executar `npm run test:run` i assegurar que tots els tests passen.
