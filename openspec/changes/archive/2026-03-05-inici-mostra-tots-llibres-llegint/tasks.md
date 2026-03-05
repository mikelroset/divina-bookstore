# Tasks: A l'inici mostra tots els llibres en Llegint

## 1. Refactor HomeView

- [x] 1.1 Canviar `readingBook` (find) a `readingBooks` (filter).
- [x] 1.2 Extreure el bloc d'un llibre en component `ReadingBookBlock` (o inline amb map) que rep `book` i `onUpdateCurrentPage`.
- [x] 1.3 Renderitzar un bloc per cada llibre de `readingBooks`. Si buit, no mostrar la secció (o missatge "Ara mateix no estàs llegint cap llibre").
- [x] 1.4 Assegurar que cada llibre té el seu propi input de pàgines i botó desar (estat local o per bookId).
