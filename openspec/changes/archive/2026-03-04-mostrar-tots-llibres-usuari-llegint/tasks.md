# Tasks: Mostrar tots els llibres que un usuari està llegint

## 1. Model i servei de comunitat

- [x] 1.1 A `communityService.updateCurrentReading`, acceptar un array de llibres en lectura (no un únic llibre). Escriure a `community/{userId}` el camp `currentBooks` (array amb id, title, author, genre, coverUrl, currentPage, pages, startDate, lastUpdatedAt per cada llibre). Opcional: escriure també `currentBook` amb el primer ítem per compatibilitat.
- [x] 1.2 A `communityService.getCommunityReaders`, retornar tots els membres de la comunitat. Per cada membre, llegir `community/{userId}` i construir `currentBooks = doc.currentBooks ?? (doc.currentBook ? [doc.currentBook] : [])`. Ordenar cada array de llibres per lastUpdatedAt desc, després startDate desc, després títol. Incloure membres amb currentBooks buit.

## 2. Sincronització des del client

- [x] 2.1 A BooksContext, en lloc de `books.find(b => b.status === "reading")`, usar `books.filter(b => b.status === "reading")` i cridar `updateCurrentReading(user.uid, user, readingBooksArray)`.

## 3. Helper de progrés segur

- [x] 3.1 Afegir (a utils o a CommunityView) una funció `safeProgress(currentPage, pages)` que retorni el percentatge vàlid o null si és incoherent (negatiu, > 100%, pages 0 o undefined). Utilitzar-la a la vista per mostrar “—” o 0% quan sigui null.

## 4. Vista de comunitat – usuari actual

- [x] 4.1 A CommunityView, al bloc “Estàs llegint”, mostrar tots els llibres de l’usuari amb estat “reading” (userBooks.filter(b => b.status === "reading")). Si n’hi ha més d’un, mostrar una llista; si n’hi ha zero, mostrar “Ara mateix no estàs llegint cap llibre.” (o amagar el bloc si es prefereix).

## 5. Vista de comunitat – altres lectors

- [x] 5.1 Per a cada lector a la graella, mostrar la llista `reader.currentBooks` (no només reader.currentBook). Cada llibre: coberta, títol, autor, gènere, progrés (amb safeProgress). Si currentBooks.length === 0, mostrar “Ara mateix no està llegint cap llibre.”
- [x] 5.2 Botó “Encoratja”: un per cada llibre del lector (readerBookKey = reader.uid + book.id). Deshabilitar per llibre segons cooldown/sent.

## 6. Estadístiques

- [x] 6.1 Actualitzar el càlcul de “Llibres en curs” a la suma de tots els currentBooks.length + llibres en lectura de l’usuari actual. Progrés mitjà i gèneres diversos sobre tots els llibres en curs.

## 7. Verificació

- [x] 7.1 Comprovar que amb 0, 1 o diversos llibres “Llegint” per usuari la UI es comporta correctament i no hi ha errors de renderitzat. Comprovar ordenació i guardrails de progrés.
