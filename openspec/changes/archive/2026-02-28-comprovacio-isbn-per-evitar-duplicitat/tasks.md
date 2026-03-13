# Tasks: Comprovació d'ISBN per evitar duplicitat

## 1. Utilitats

- [x] 1.1 Afegir `normalizeISBN(isbn)` a helpers.js: extraure només dígits (10 o 13).

## 2. Camp ISBN obligatori

- [x] 2.1 A BookForm: validar que ISBN no sigui buit i tingui format vàlid (ISBN-10 o ISBN-13).
- [x] 2.2 Mostrar missatge d'error si ISBN buit o invàlid.

## 3. Comprovació de duplicats al bookService

- [x] 3.1 A bookService.addBook: abans de crear, obtenir llibres de l'usuari i comprovar si algun té el mateix ISBN normalitzat.
- [x] 3.2 Si existeix duplicat, llançar error amb missatge identifiable.
- [x] 3.3 NO aplicar la comprovació a updateBook (editar un llibre existent). _Nota: s'ha afegit també a updateBook per coherència quan es canvia l'ISBN._

## 4. Missatge d'error a la UI

- [x] 4.1 Afegir clau de traducció `bookForm.errorBookAlreadyExists` als tres idiomes (ca, es, en).
- [x] 4.2 En AddBookRoute / useBookSave: capturar l'error i mostrar el missatge traduït (toast o inline).
