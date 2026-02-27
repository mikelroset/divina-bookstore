# Tasks: Bug – La Ratxa no es calcula bé

## 1. Registre d’activitat de lectura

- [x] 1.1 Comprovar que en desar un llibre amb actualització de “pàgina actual” (formulari Afegir/Editar llibre) es crida `recordReadingActivity` (o equivalent) perquè el dia actual quedi registrat a les prefs de l’usuari.
- [x] 1.2 Si no es crida en cap cas, afegir la crida al flux de guardat (ex. AddBookRoute / handleSave) quan `currentPage` estigui present als dades desades.
- [x] 1.3 Comprovar que `addReadingActivityDay` persisteix correctament a `users/{uid}/prefs/settings` (readingActivityDays) i que les regles de Firestore ho permeten.

## 2. Càlcul i càrrega del streak

- [x] 2.1 Comprovar que `computeStreak(readingActivityDays)` retorna el nombre correcte de dies consecutius amb activitat fins avui (incloent avui si està a la llista).
- [x] 2.2 Comprovar que `useUserPrefs` carrega les prefs (incloent `readingActivityDays`) i exposa `streak`; que la vista d’Inici rep i mostra aquest valor.

## 3. Verificació

- [x] 3.1 Reproduir: llegir uns dies seguits (actualitzant pàgina actual i desant); obrir Inici i comprovar que la Ratxa reflecteix els dies consecutius. Un dia sense activitat ha de reiniciar la ratxa a 0.
