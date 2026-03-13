# Design: Progrés total lectura multi-llibre

## Context

La barra de progrés total de lectura es mostra a `HomeView` i utilitza `stats.progressPercentage` que prové de `computeStats(books)` en `src/utils/stats.js`.

## Diagnòstic

La funció `computeStats` ja fa el càlcul correcte conceptualment: suma `pages` i `currentPage` de tots els llibres amb `status === "reading"`. El bug pot ser:

1. **Coacció de tipus**: Firebase retorna `pages` i `currentPage` com a strings. Si es fan operacions amb strings sense convertir a nombre, `reduce` pot produir concatenacions en lloc de sumes (ex: `0 + "50" + "30"` → `"05030"`).
2. **Falta de test per múltiples llibres**: No hi ha test explícit que validi el càlcul amb 2+ llibres "reading".

## Solució

- A `computeStats` en `src/utils/stats.js`: usar `Number()` (o `parseInt`) per convertir `book.pages` i `book.currentPage` abans de sumar, de manera que sempre operem amb nombres.
- Afegir test a `stats.test.js` per múltiples llibres en "reading" que asseguri el càlcul correcte.
- Si el bug persisteix després d'això, investigar si `books` arriba incomplet o amb formats inesperats des del origen de dades.

## On es mostra

- `HomeView`: bloc "Llegint ara" amb `ProgressBar value={stats.progressPercentage}`.
