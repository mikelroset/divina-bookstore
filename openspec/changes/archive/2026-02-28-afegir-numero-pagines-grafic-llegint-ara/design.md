# Design: Afegir número de pàgines al gràfic de "Llegint ara"

## Decisió

- **Dades:** Afegir a `readingInsights.js` una funció `getWeeklyPagesRead(pageLog)` que retorni per als últims 7 dies `{ date, pagesRead }`, on `pagesRead` és la suma de pàgines llegides aquell dia (deltes entre entrades consecutives del pageLog; delta negatiu → 0). Múltiples entrades el mateix dia es sumen.
- **Visual:** El component `WeeklyMiniChart` (HomeView i AddBookView) passarà a rebre dades amb `pagesRead`. L'alçada de la barra serà proporcional a `pagesRead` (o mínima si 0). S'afegirà una etiqueta visible sobre o dins la barra amb el valor (enter), p. ex. "12" o "12 pàg.".
- **Edge cases:** (1) Delta negatiu entre entrades → comptar 0 pàgines per a aquella transició. (2) Dia amb 0 pàgines → es pot mostrar "0" o no mostrar etiqueta. (3) Sense dades al període → no mostrar etiquetes numèriques.
- **Reutilització:** El gràfic es reutilitza a HomeView i AddBookView; amb una sola font de veritat (getWeeklyPagesRead) i el mateix component amb etiquetes, ambdós queden coberts.
