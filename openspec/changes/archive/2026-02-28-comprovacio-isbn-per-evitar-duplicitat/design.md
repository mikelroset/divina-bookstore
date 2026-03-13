# Design: Comprovació d'ISBN per evitar duplicitat

## Flux

1. Usuari emplena el formulari d'afegir llibre (incloent ISBN).
2. En enviar, BookForm valida ISBN (obligatori, format ISBN-10 o ISBN-13).
3. useBookSave / addBook rep les dades.
4. bookService.addBook: abans de crear, normalitza l'ISBN i comprova si l'usuari ja té un llibre amb el mateix ISBN.
5. Si existeix: llançar error que arriba a la UI (toast/missatge).
6. Si no existeix: desar el llibre.

## Normalització d'ISBN

- Eliminar guions i espais
- Extraure només dígits
- Format final: 10 o 13 dígits

Això permet comparar `978-0-14-118280-3` amb `9780141182803`.

## Validació de format

- ISBN-10: exactament 10 dígits (després de normalitzar)
- ISBN-13: exactament 13 dígits
- `validateISBN` ja existeix a helpers.js; s'utilitzarà i s'afegirà `normalizeISBN` per a la comparació

## Comprovació de duplicats

Firestore no suporta UNIQUE. S'usa una comprovació prèvia a la creació:
- Obtenir llibres de l'usuari
- Filtrar per ISBN normalitzat
- Si algun coincideix, no crear i retornar error

Per inserció concurrent: la comprovació no és atòmica. En una fase futura es podria usar una col·lecció auxiliar `bookIsbns` o transaccions per millorar la garantia.

## Missatge d'error (i18n)

Clau: `bookForm.errorDuplicateIsbn` (o similar)
- ca: "Aquest llibre ja existeix a la teva biblioteca"
- es: "Este libro ya existe en tu biblioteca"
- en: "This book already exists in your library"
