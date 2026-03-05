# Design: Unit Tests

## Mòduls a testejar

### 1. helpers.js – safeProgress

- Ja hi ha tests per getDaysReading, calculateProgress, etc.
- **safeProgress** no està cobert: retorna null per a dades incoherents (negatiu, > 100%, pages 0); retorna 0–100 en cas vàlid.

### 2. readingInsights.js

- **computePace:** Retorna pàgines per dia des de pageLog (últims 7 dies). Edge cases: pageLog buit, < 2 entrades, deltes negatius (ignorats), múltiples dies.
- **computeETA:** Retorna { daysLeft, dateStr } o null. Edge cases: pages 0, current >= pages, pace 0.
- **getWeeklyPagesRead:** Retorna array { date, pagesRead } per als últims 7 dies. Edge cases: pageLog buit, múltiples entrades el mateix dia (suma).

### 3. CI

- GitHub Actions: workflow que executa `npm run test` (o `npm run test:run`) en push/PR a main i a les branques feature/*.

## Estratègia

- Usar dates fixades (mock de Date.now) per a readingInsights si cal, o construir pageLog amb timestamps controlats.
- Evitar tests que depenguin de hora real quan sigui possible.
