# Tasks: Fix encouragement UX

## 1. Feedback al botó d’enviar (Comunitat)

- [x] 1.1 A `CommunityView`, afegir estat `sentToUids` (array d’UIDs). En èxit de `sendEncouragement(..., reader.uid)`, afegir `reader.uid` a `sentToUids`.
- [x] 1.2 Per a cada botó "Encoratja": si `reader.uid` està a `sentToUids`, mostrar "Enviat ✓" i desactivar el botó; en cas contrari, mantenir "Enviant...", "Error. Torna-ho a intentar" o "Encoratja" segons l’estat actual.
- [x] 1.3 Assegurar que el botó queda desactivat quan `sendingToUid !== null` o quan `sentToUids.includes(reader.uid)`.

## 2. Indicador a la navegació per al receptor

- [x] 2.1 Crear hook `useEncouragementCount(userId)` que cridi `encouragementService.getEncouragementsForUser(userId)` i retorni `{ count, loading }` (count = longitud del resultat). Ubicació: `src/hooks/useEncouragementCount.js` (o dins d’un fitxer de hooks existent).
- [x] 2.2 A `App.jsx`, quan hi ha `user`, invocar `useEncouragementCount(user.uid)` i passar `encouragementCount` (el número) a `BottomNav` com a prop (p. ex. `encouragementCount={count}`).
- [x] 2.3 A `BottomNav`, acceptar la prop opcional `encouragementCount`. A l’enllaç "Inici", si `encouragementCount > 0`, mostrar un badge visual (comptador o punt) sobre o al costat de la icona/label d’Inici, amb estil coherent (p. ex. cercle primary, text petit).
- [x] 2.4 Verificar que en obrir Inici es continuen mostrant els encoratjaments com abans (HomeView no canvia la lògica de la secció "Encoratjaments").

## 3. Documentació i verificació

- [x] 3.1 Comprovar que no hi ha regressions: enviar encoratjament des de Comunitat, veure "Enviat ✓", i des d’un altre usuari (receptor) veure badge a Inici i els encoratjaments a la pantalla d’Inici.
