# Design: Bug – Bloc "Llegint ara" desapareix en actualitzar pàgines

## Decisió

- **Causa:** En l'actualització des del formulari (AddBookRoute), es passa a `updateBook` només les dades del formulari (`bookData`). Si el formulari no inclou algun camp (o el payload es construeix sense fer merge amb el llibre actual), el llibre actualitzat al context pot quedar sense `status: "reading"` o sense altres camps, i el bloc "Llegint ara" deixa de mostrar-se perquè `books.find(b => b.status === "reading")` no el troba.

- **Solució:** En fer *update*, fusionar sempre el llibre existent amb les dades del formulari abans d'enviar a `updateBook`, de manera que camps com `status`, `pageLog` o qualsevol altre que no vingui del formulari es preservin. Concretament a `App.jsx` dins de `handleSave` d'AddBookRoute: quan `editingBook` existeix, fer `dataToSave = { ...editingBook, ...dataToSave }` (o equivalent) abans de cridar `updateBook(editingBook.id, dataToSave)`.

- Opcional: al context, en substituir el llibre després d'`updateBook`, fer merge amb el llibre anterior (`{ ...book, ...updatedBook }`) com a xarxa de seguretat per no perdre camps que el servei no retorni.
