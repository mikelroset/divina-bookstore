# Design: Bug – La Ratxa no es calcula bé

## Context

- La ratxa es basa en `readingActivityDays` al document `users/{uid}/prefs/settings`.
- Quan l’usuari actualitza la “pàgina actual” d’un llibre i desa, s’ha de cridar `recordReadingActivity()` (addReadingActivityDay) per afegir el dia actual a la llista.
- El streak es calcula amb `computeStreak(readingActivityDays)`: dies consecutius amb activitat fins avui (si avui no hi ha activitat, streak = 0).
- El Dashboard rep `streak` des de `useUserPrefs` i el mostra a la StatCard “Ratxa”.

## Decisions

1. **Verificar el punt d’registre:** Assegurar que `recordReadingActivity` es crida cada vegada que es desa un llibre amb `currentPage` (ex. des d’AddBookRoute en guardar). Si només es crida en algunes rutes, el registre serà incomplet.
2. **Verificar càrrega de prefs:** El hook `useUserPrefs` ha de carregar `readingActivityDays` des de Firestore; comprovar que no hi ha condicions de cursa o que el valor es mostra després de la càrrega.
3. **Verificar computeStreak:** La lògica de dies consecutius des d’avui ha de ser correcta (format de data, ordenació, reinici si avui no està a la llista).
