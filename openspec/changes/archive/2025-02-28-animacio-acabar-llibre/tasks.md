# Tasks: Animació a l'acabar un llibre

## 1. Dependència i utilitat

- [x] 1.1 Instal·lar `canvas-confetti`.
- [x] 1.2 Crear `src/utils/celebration.js` amb `triggerConfetti()`, `CELEBRATION_MESSAGES` i `showCelebration()`.

## 2. Component toast

- [x] 2.1 Crear component `CelebrationToast` que mostri un missatge i desaparegui al cap de 3–4 segons (integrad dins de `showCelebration` amb DOM).

## 3. Integració Home

- [x] 3.1 A `handleUpdateCurrentPageFromHome` (App.jsx): comprovar transició (prev < total, new === total, total > 0). Si es compleix després del guardat, cridar `showCelebration()`.

## 4. Integració formulari Add/Edit

- [x] 4.1 A `AddBookRoute handleSave`: comprovar transició amb `editingBook` i `bookData`; si es compleix després del guardat, cridar `showCelebration()` abans de `navigate`.

## 5. Verificació

- [x] 5.1 Comprovar que no es celebra amb total invàlid (null, 0).
- [x] 5.2 Comprovar que no es celebra en re-guardar el mateix valor (idempotència).
- [x] 5.3 Comprovar que la UI roman interactiva durant la celebració.
