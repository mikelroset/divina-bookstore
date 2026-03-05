# Design: Mostrar tots els llibres "Llegint" a l'inici

## Canvi

- **Abans:** `readingBook = books.find(b => b.status === "reading")` → un sol llibre.
- **Després:** `readingBooks = books.filter(b => b.status === "reading")` → tots els llibres en lectura.

## Layout

- Mantenir el bloc "Llegint ara" amb el mateix estil.
- Per a cada llibre: una subsecció (targeta o bloc separat) amb:
  - Portada (BookCover)
  - Títol, autor
  - Barra de progrés, pàgines, ETA (computeETA)
  - Input + botó "Actualitza progrés" (per llibre)
  - Gràfic setmanal (WeeklyMiniChart) si hi ha dades
- Si hi ha diversos llibres, mostrar-los en llista vertical (space-y) o similar.
- L'input `currentPageInput` i `handleSaveCurrentPage` han de ser per llibre: estat per `bookId` o refactoritzar a un component `ReadingBookBlock` que rep un sol llibre i gestiona el seu estat intern.

## Implementació

- Opció A: Component `ReadingBookBlock({ book, onUpdateCurrentPage })` que encapsula la lògica d'input i desar per un llibre.
- Opció B: Estat `currentPageInputs` com a objecte `{ [bookId]: string }` i `handleSaveCurrentPage(bookId, ...)`.
- Recomanació: Opció A per mantenir el codi net.
