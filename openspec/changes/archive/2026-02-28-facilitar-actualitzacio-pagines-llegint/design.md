# Design: Facilitar l'actualització de pàgines dels llibres en "Llegint"

## Decisió

- **Ubicació:** Dins del bloc "Llegint ara" de `HomeView.jsx`, sota la informació del llibre (títol, autor, barra de progrés).
- **UI:** Camp numèric (input type="number" o text amb validació) pre-omplert amb `readingBook.currentPage ?? 0`, i botó "Desar" (o "Actualitza progrés").
- **Persistència:** Reutilitzar la mateixa lògica que a `AddBookRoute`: `updateBook(bookId, { currentPage, pageLog })` on `pageLog` s'actualitza afegint l'entrada d'avui (últims 7 dies). Cridar `recordReadingActivity()` després de desar per actualitzar la ratxa.
- **Props:** HomeView ha de rebre `onUpdateCurrentPage` (o rebre `updateBook` + `recordReadingActivity` des d'App) per poder desar des de la pantalla d'inici.
- **Validació abans de desar:**
  - Valor ha de ser un número vàlid (enter >= 0).
  - Si `readingBook.pages` existeix i > 0: nou valor <= pages.
  - Nou valor >= (readingBook.currentPage ?? 0) — no permetre "retrocedir" des d'aquest bloc (opcional segons producte; el Notion diu "no es pot desar").
  - Si falla: mostrar missatge inline (no alert) i no cridar updateBook.
- **Estats:** loading (desant), error (missatge), èxit (UI s'actualitza via context).
- **Layout escriptori:** El bloc "Llegint ara" és una sola columna (portada + contingut); no cal grid de 3. Assegurar que no hi ha forats si en el futur hi hagués més d'un llibre en lectura (reflow net).
