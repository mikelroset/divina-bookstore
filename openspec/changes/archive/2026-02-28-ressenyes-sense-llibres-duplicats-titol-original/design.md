# Design: Ressenyes sense llibres duplicats

## Catàleg global de llibres

Nova col·lecció Firestore `catalogBooks` (document root). Cada document representa un llibre canònic identificat per títol original + autor.

```js
{
  id: string,           // auto
  originalTitle: string,
  author: string,
  _matchKey: string,    // clau normalitzada per a cerca (lowercase, trim, etc.)
  createdAt: Timestamp
}
```

Camp `_matchKey`: resultat de `normalizeForMatch(originalTitle, author)` per permetre consultes eficients. Format: `${normalizedTitle}|${normalizedAuthor}`.

## Normalització

Funció `normalizeForMatch(title, author)`:
- Trim i lowercase
- Collapse espais múltiples a un
- Eliminar accents (NFD + remove combining marks)
- Per l'autor: eliminar punts (G. R. R. Martin → G R R Martin)
- Símbols comuns: `&` → `and` (opcional, fase inicial senzilla)

## Flux de publicació de ressenya

1. Usuari selecciona llibre completat (amb `originalTitle` o `title` com a fallback).
2. Obtenim `originalTitle = book.originalTitle || book.title`, `author = book.author`.
3. Cridem `findOrCreateCatalogBook(originalTitle, author)`:
   - `matchKey = normalizeForMatch(originalTitle, author)`
   - Query: `catalogBooks` on `_matchKey == matchKey`
   - Si existeix: retornar `doc.id`
   - Si no: `addDoc` i retornar el nou id
4. Creem ressenya amb `catalogBookId` (nou camp) i mantenim `bookTitle`, `bookAuthor` per display.
5. Les ressenyes amb el mateix `catalogBookId` es mostren agrupades.

## Camp originalTitle obligatori

- A `BookForm`: validar que `originalTitle` no sigui buit (o usar `title` com a valor per defecte quan el títol és en l'idioma original).
- AC: "ha d'introduir obligatòriament el títol original". Si el llibre és en l'idioma original, `originalTitle` pot ser igual que `title`. El form pot pre-omplir `originalTitle` amb `title` quan l'usuari encara no l'ha tocat.

## Índex Firestore

- `catalogBooks`: índex per `_matchKey` (ASC) per consultes `where("_matchKey", "==", value)`.

## Compatibilitat enrere

- Llibres existents sense `originalTitle`: en publicar ressenya, usar `book.title` com a fallback.
- Ressenyes antigues sense `catalogBookId`: mantenir display actual (bookTitle, bookAuthor); la agrupació només aplica a ressenyes noves amb catalogBookId. Opcional: migració futura.
