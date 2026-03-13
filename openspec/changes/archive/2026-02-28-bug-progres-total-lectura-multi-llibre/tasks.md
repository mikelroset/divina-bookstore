# Tasks: Progrés total lectura multi-llibre

## 1. Càlcul robust a stats.js

- [x] 1.1 Convertir `book.pages` i `book.currentPage` a nombre amb `Number()` (o equivalent) abans de sumar a `totalPages` i `readPages`.
- [x] 1.2 Assegurar que valors `undefined`/`null`/`NaN` es tracten com a 0.

## 2. Tests

- [x] 2.1 Afegir test que donada una llista amb 2+ llibres `status: "reading"`, el `progressPercentage` és la suma de `currentPage` / suma de `pages` arrodonit.

## 3. Verificació

- [x] 3.1 Executar tests: `npm run test -- src/utils/stats.test.js`
- [x] 3.2 Verificar visualment amb 2+ llibres en "llegint" que la barra de progrés mostra el percentatge correcte.
