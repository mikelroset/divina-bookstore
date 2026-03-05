# Design: Múltiples llibres en lectura per usuari a la comunitat

## Context

- Actualment la col·lecció Firestore `community/{userId}` guarda un únic `currentBook` (objecte o null). El client (BooksContext) envia un sol llibre amb estat “reading” i la vista de comunitat mostra un llibre per lector.
- La font de veritat dels llibres de cada usuari és `users/{userId}/books`; el client no pot llegir els llibres d’altres usuaris (regles Firestore). Per tant la comunitat es basa en el que cada usuari **sincronitza** al document `community/{userId}`.

## Decisió

1. **Model de dades (Firestore):** Ampliar `community/{userId}` per suportar una llista de llibres en lectura:
   - Afegir camp **`currentBooks`** (array d’objectes). Cada ítem: `{ id, title, author?, genre?, coverUrl?, currentPage?, pages?, startDate?, lastUpdatedAt? }`.
   - Mantenir **`currentBook`** (opcional) per compatibilitat enrere: si un client antic escriu només `currentBook`, la lògica de lectura normalitzarà a `currentBooks = currentBook ? [currentBook] : []`.

2. **Sincronització (BooksContext):** En lloc de `books.find(b => b.status === "reading")`, enviar **tots** els llibres amb `status === "reading"`: `books.filter(b => b.status === "reading")`. Cridar `updateCurrentReading(user.uid, user, readingBooksArray)`. **No sincronitzar mentre `loading === true`** per no sobreescriure el document de la comunitat amb `currentBooks: []` abans d’haver carregat els llibres des de Firestore.

3. **communityService:**
   - **updateCurrentReading(userId, userData, currentBooksArray):** Escriure `currentBooks: array` (mapejat als camps necessaris, amb `lastUpdatedAt` per ordenació). Opcionalment escriure també `currentBook: currentBooksArray[0]` per compatibilitat.
   - **getCommunityReaders(activeCommunityId):** Retornar **tots** els membres de la comunitat. Per cada membre, llegir el document `community/{userId}`; construir `currentBooks = doc.currentBooks ?? (doc.currentBook ? [doc.currentBook] : [])`. Ordenar cada llista de llibres per `lastUpdatedAt` desc (o `startDate` desc, o títol si no hi ha dates). Incloure membres amb `currentBooks: []` (per mostrar l’estat buit).

4. **CommunityView:**
   - Per a **l’usuari actual** (“Estàs llegint”): mostrar llista de tots els llibres amb `status === "reading"` (ja tenim `userBooks`; fer `userBooks.filter(b => b.status === "reading")`). Si la llista és buida, no mostrar el bloc o mostrar “Ara mateix no estàs llegint cap llibre.”
   - Per a **cada altre lector:** una card per lector; dins la card, una **llista** de llibres (`reader.currentBooks`). Cada llibre amb: coberta, títol, autor, gènere, barra de progrés (amb guardrail: si progrés invàlid, mostrar “—” o 0%). Si `currentBooks.length === 0`, mostrar “Ara mateix no està llegint cap llibre.”
   - Botó “Encoratja”: un per llibre (o mantenir un per card amb desplegable si hi ha molts llibres). Per simplificar: un botó “Encoratja” per cada llibre dins la card del lector (segons AC: encoratjar per llibre).

5. **Ordenació:** Ordenar els llibres d’un mateix usuari per `lastUpdatedAt` desc; si no existeix, per `startDate` desc; si no, alfabètic per títol.

6. **Guardrails de progrés:** Funció helper `safeProgress(currentPage, pages)` que retorna percentatge o null si invàlid (negatiu, > 100%, pages 0). A la UI, mostrar “—” o “0%” quan sigui null.

7. **Estadístiques:** “Llibres en curs” = suma de `currentBooks.length` de tots els lectors + llibres en lectura de l’usuari actual. “Lectors actius” = nombre de membres que tenen almenys un llibre en lectura (o tots els membres si mostrem tots amb estat buit). “Progrés mitjà” i “Gèneres diversos” calculats sobre tots els llibres en curs.
