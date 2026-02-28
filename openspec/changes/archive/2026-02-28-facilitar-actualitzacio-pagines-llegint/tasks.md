# Tasks: Facilitar l'actualització de pàgines dels llibres en "Llegint"

## 1. Passar callbacks a HomeView

- [x] 1.1 A App.jsx, passar `updateBook` i `recordReadingActivity` a HomeView (o un sol callback `onUpdateCurrentPage(bookId, newCurrentPage)` que encapsuli la lògica de pageLog i recordReadingActivity).

## 2. Bloc "Llegint ara": camp i botó

- [x] 2.1 Afegir un input numèric pre-omplert amb el valor actual de pàgines llegides (`readingBook.currentPage`).
- [x] 2.2 Afegir un botó "Actualitza progrés" (o similar) que en clicar validi i desi el nou valor.
- [x] 2.3 En desar: actualitzar `currentPage` i `pageLog` (mateixa lògica que a AddBookRoute), cridar `recordReadingActivity()` i reflectir canvis a la UI.

## 3. Validació i missatges d'error

- [x] 3.1 Validar que el valor és numèric i >= 0; si no, mostrar missatge d'error contextual i no desar.
- [x] 3.2 Si el llibre té `pages` definit i el nou valor > pages, no desar i mostrar missatge.
- [x] 3.3 Si el nou valor < valor actual (progrés negatiu), no desar i indicar el motiu.
- [x] 3.4 En error de xarxa/persistència, mostrar error i mantenir el valor anterior visible.

## 4. Layout i estat buit

- [x] 4.1 Si no hi ha llibre en "Llegint", el bloc no es mostra o es mostra "No tens cap llibre en lectura".
- [x] 4.2 Revisar layout escriptori del bloc per evitar espais buits (reflow net).

## 5. Verificació

- [ ] 5.1 Revisar visualment: desar des d'inici actualitza la UI i la barra de progrés; errors es mostren correctament.
