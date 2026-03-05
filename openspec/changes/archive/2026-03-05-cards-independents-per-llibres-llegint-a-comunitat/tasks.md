# Tasks: Cards independents per llibres Llegint a comunitat

## 1. Component ReadingBookCard

- [x] 1.1 Crear `ReadingBookCard` (o dins CommunityView) que rep `{ reader, book }`. Mostrar: Avatar + nom, "està llegint", BookCover, títol, autor (si existeix), gènere (si existeix), pàgines/total, % progrés (safeProgress), dies llegint (getDaysReading), botó Encoratja.

## 2. Aplanar dades i ordenació

- [x] 2.1 Construir llista plana `(reader, book)[]` a partir de `communityReaders` i llibres de l'usuari actual. Un ítem per cada llibre en lectura.
- [x] 2.2 Ordenar per activitat: lastUpdatedAt desc, startDate desc, o títol asc.

## 3. CommunityView – bloc "Estàs llegint"

- [x] 3.1 Canviar el bloc "Estàs llegint" de llista a graella de cards: 1 card per llibre (ReadingBookCard). Mantenir mateix estil de card que la resta.

## 4. CommunityView – bloc "La resta de lectors"

- [x] 4.1 Canviar la graella: en lloc de 1 card per reader amb llista dins, renderitzar 1 card per llibre (ReadingBookCard). Cada card mostra lector + llibre + encoratjar.

## 5. Guardrails i interaccions

- [x] 5.1 Progrés invàlid (pàgines 0, negatiu, > 100%): mostrar "—".
- [x] 5.2 Gènere buit: ometre (no mostrar "Sense gènere").
- [x] 5.3 Error encoratjar: missatge no intrusiu i opció de reintentar.
- [x] 5.4 Click a card/llibre → detall llibre. Click a nom/avatar → perfil (si existeix).
- [x] 5.5 Títols/noms llargs: line-clamp-2 per no desquadrar.

## 6. Rendiment (opcional)

- [x] 6.1 Afegir `loading="lazy"` a BookCover i Avatar si encara no hi és (o verificar que no bloqueja rendering).

## 7. Verificació

- [x] 7.1 Comprovar amb 0, 1, diversos llibres per usuari; múltiples usuaris. Feed ordenat, cards consistents, encoratjar funciona.
