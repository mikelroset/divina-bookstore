# Design: Animació a l'acabar un llibre

## Context

L'app permet actualitzar el progrés d'un llibre en dos fluxos:
1. **Home** (ReadingBookBlock): input de pàgines + botó "Actualitza progrés" → `handleUpdateCurrentPageFromHome` (App.jsx).
2. **Formulari Add/Edit** (BookForm): camp Pàgina Actual + guardar → `handleSave` (AddBookRoute).

Cal detectar la transició de progrés < total a progrés = total i disparar la celebració just després del guardat correcte.

## Decisions

1. **Biblioteca de confeti:** `canvas-confetti` (lleugera, sense dependències React, compatible amb el bundle actual).

2. **Utilitat de celebració:** Crear `src/utils/celebration.js` amb:
   - `triggerConfetti()`: crida a canvas-confetti amb configuració moderada (durada ~3s, no bloqueja).
   - `CELEBRATION_MESSAGES`: array de missatges rotables.
   - `showCelebration(onDismiss?)`: dispara confeti + mostra toast temporal; auto-neteja després de ~4s.

3. **Condició de transició:** `prevCurrentPage < totalPages && newCurrentPage === totalPages && totalPages > 0`, amb totalPages vàlid (numèric, > 0).

4. **Punts d'integració:**
   - `handleUpdateCurrentPageFromHome`: abans de `updateBook`, comprovar si `newCurrentPage === book.pages && (book.currentPage ?? 0) < book.pages`. Després del `updateBook` exitós, si es compleix → `showCelebration()`.
   - `AddBookRoute handleSave`: abans de guardar, amb `editingBook` i `bookData.currentPage`, comprovar transició. Després del guardat exitós → `showCelebration()` (abans de `navigate`).

5. **Toast/ missatge:** Component lleuger o `alert` temporal? El Notion diu "desapareix automàticament" i "no bloqueja". Utilitzar un toast no modal: div fix (ex. bottom-center) que es mostra 3–4s i després es dissolvia amb CSS.

6. **Opció A per progrés > total (Edge Case 2):** El formulari i ReadingBookBlock ja validen i impedeixen guardar si currentPage > pages. Per tant, no cal clamp addicional; només assegurar que no es celebri en aquest cas.
