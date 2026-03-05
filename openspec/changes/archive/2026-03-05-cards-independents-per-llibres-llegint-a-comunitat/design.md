# Design: Cards independents per llibre a la comunitat

## Context

- Actualment la vista de comunitat mostra **1 card per lector**, amb una llista de llibres dins cada card.
- Els dades (`currentBooks` per usuari) ja existeixen gràcies al canvi "mostrar-tots-llibres-usuari-llegint".
- Ara es vol **1 card per llibre**: cada llibre en lectura és una card independent que mostra el lector + el llibre + botó encoratjar.

## Decisió

### 1. Estructura de dades (sense canvis)

- `community/{userId}` amb `currentBooks` array; `communityService.getCommunityReaders()` retorna lectors amb `currentBooks`.
- No cal modificar el model de dades; només canviar la renderització.

### 2. Aplanar a "llista de (reader, book)"

- A partir de `communityReaders` (i l'usuari actual), construir una llista plana: `{ reader, book }[]`.
- Per cada lector, iterar `reader.currentBooks` i afegir un ítem per cada llibre.
- Per l'usuari actual: afegir els seus llibres amb `currentUser` com a reader.

### 3. Ordenació del feed

- Ordenar tots els ítems `(reader, book)` per activitat més recent:
  - `book.lastUpdatedAt` desc, o `book.startDate` desc, o `book.title` asc (ordre estable).
- El feed unificat inclou tant els llibres de l'usuari actual com els d'altres lectors.

### 4. Component ReadingBookCard (o equivalent)

- Una card autònoma que rep `{ reader, book }`.
- Contingut obligatori:
  - Avatar + nom de l'usuari (enllaç a perfil si existeix)
  - Text "està llegint"
  - BookCover (portada o placeholder)
  - Títol, autor (si existeix), gènere (si existeix)
  - Pàgines llegides / totals, % progrés (amb safeProgress), dies llegint (amb getDaysReading)
  - Botó "Encoratja" (desactivat si ja s'ha encoratjat)
- Click a la card/llibre → detall del llibre (mateix comportament actual).
- Click a nom/avatar → perfil usuari (si existeix).
- Guardrails: progrés invàlid → "—"; gènere buit → ometre; error encoratjar → missatge i reintentar.

### 5. CommunityView: canvi d'estructura

- Eliminar la graella actual (1 card per reader amb llista dins).
- Crear llista plana `allReadingItems = [...]` (reader + book) per usuari actual + altres lectors.
- Ordenar per activitat.
- Renderitzar `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">` amb una `ReadingBookCard` per cada ítem.

### 6. Bloc "Estàs llegint" vs "La resta de lectors"

- Opció A: Un sol feed amb totes les cards (usuari actual + altres) ordenat per activitat.
- Opció B: Mantenir dos blocs: primer "Estàs llegint" (cards del current user), després "La resta" (cards dels altres).
- Recomanació: Opció B per claredat, però amb la mateixa representació de card (1 card per llibre) en ambdós blocs.

### 7. Rendiment i layout

- Lazy-load d'imatges: BookCover i Avatar ja gestionen fallbacks; afegir `loading="lazy"` si encara no hi és.
- Títols/noms llargs: `line-clamp-2` per evitar desquadrar la card.
- Mida de card consistent en el grid.
