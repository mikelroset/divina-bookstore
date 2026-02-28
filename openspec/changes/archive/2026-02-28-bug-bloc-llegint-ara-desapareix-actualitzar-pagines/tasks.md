# Tasks: Bug – Bloc "Llegint ara" desapareix en actualitzar pàgines

## 1. Preservar llibre existent en actualitzar

- [x] 1.1 A App.jsx, dins de AddBookRoute handleSave, quan s'actualitza un llibre existent (`editingBook`), fusionar el llibre actual amb les dades del formulari abans de cridar updateBook: `dataToSave = { ...editingBook, ...dataToSave }` (i després aplicar la lògica de pageLog si cal), per preservar `status` i la resta de camps.

## 2. (Opcional) Merge al context

- [x] 2.1 A BooksContext, en updateBook, en substituir el llibre a l'estat fer merge amb l'anterior: `prevBooks.map(book => book.id === bookId ? { ...book, ...updatedBook, id: bookId } : book)` per no perdre camps que el servei no retorni.

## 3. Verificació

- [ ] 3.1 Revisar: editar el total de pàgines d'un llibre "Llegint", guardar, tornar a inici; el bloc "Llegint ara" ha de romandre visible amb les dades actualitzades.
