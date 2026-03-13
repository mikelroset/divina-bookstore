# Tasks: Ressenyes sense llibres duplicats (títol original)

## 1. Utilitats de normalització

- [x] 1.1 Crear `normalizeTitle`, `normalizeAuthor`, `getBookMatchKey` a `src/utils/normalizeBookKey.js`.
- [x] 1.2 Retornar `matchKey` en format `${normalizedTitle}|${normalizedAuthor}`.

## 2. Catàleg de llibres

- [x] 2.1 Crear `catalogBooksService.js` amb `findOrCreateCatalogBook(originalTitle, author)`.
- [x] 2.2 Query `catalogBooks` per `_matchKey`; si existeix retornar id; si no, crear doc i retornar id.
- [x] 2.3 Afegir regles Firestore per `catalogBooks` (read/create per usuaris autenticats).

## 3. Integració amb ressenyes

- [x] 3.1 Modificar `addReview` a `reviewService.js`: acceptar `originalTitle` (o derivar de book).
- [x] 3.2 Cridar `findOrCreateCatalogBook(originalTitle, author)` abans de crear la ressenya.
- [x] 3.3 Guardar `catalogBookId` a la ressenya (nou camp).
- [x] 3.4 `ReviewsView`: passar `originalTitle: publishBook.originalTitle || publishBook.title` quan es crida `addReview`.

## 4. Camp originalTitle obligatori

- [x] 4.1 A `BookForm`: afegir validació que `originalTitle` no sigui buit (pre-omplir amb `title` si buit en edició).
- [x] 4.2 Mostrar `originalTitle` com a camp obligatori amb label adequat.

## 5. Agrupació a la UI (opcional fase 1)

- [ ] 5.1 A `ReviewsView`: agrupar ressenyes per `catalogBookId` quan estigui definit; mostrar títol del catàleg o bookTitle.
- [ ] 5.2 Si `catalogBookId` és null (ressenyes antigues), mostrar com abans sense agrupar.
