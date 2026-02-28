# Tasks: Afegir número de pàgines al gràfic de "Llegint ara"

## 1. Dades: pàgines llegides per dia

- [x] 1.1 Afegir a `readingInsights.js` la funció `getWeeklyPagesRead(pageLog)` que retorni `Array<{ date: string, pagesRead: number }>` (últims 7 dies). Per cada dia, `pagesRead` = suma de deltes positives entre entrades consecutives del pageLog amb data aquella dia; delta negatiu → 0.
- [x] 1.2 Assegurar que el format de data és consistent (YYYY-MM-DD) i que dies sense activitat tenen `pagesRead: 0`.

## 2. Gràfic: etiquetes visibles

- [x] 2.1 Actualitzar `WeeklyMiniChart` per acceptar dades amb `pagesRead` i mostrar una etiqueta (número enter) per a cada barra (sobre la barra o a dins). Format curt: "12" o "12 pàg.".
- [x] 2.2 L'alçada de la barra ha de ser proporcional a `pagesRead` (max 1 per normalitzar). Si tot és 0, barres mínimes o sense alçada.
- [x] 2.3 Quan no hi ha dades (tots 0 o array buit), no mostrar etiquetes numèriques o mostrar estat buit coherent.

## 3. Integració

- [x] 3.1 A HomeView, fer servir `getWeeklyPagesRead(readingBook.pageLog)` i passar el resultat a `WeeklyMiniChart`.
- [x] 3.2 A AddBookView, fer servir `getWeeklyPagesRead(editingBook.pageLog)` i passar el resultat a `WeeklyMiniChart` (o extreure el component a un fitxer comú si cal per evitar duplicat).

## 4. Verificació

- [ ] 4.1 Revisar visualment: el gràfic mostra el número de pàgines per dia; múltiples entrades el mateix dia sumen; valors negatius no apareixen (0).
