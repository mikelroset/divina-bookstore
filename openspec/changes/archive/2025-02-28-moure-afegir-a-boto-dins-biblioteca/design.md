# Design: Moure Afegir a botó dins de Biblioteca

## Canvis en la navegació

- **BottomNav**: eliminar l’element amb `ROUTES.ADD` (icona PlusCircle, label "Afegir").
- La ruta `/add` i `/add/:id` es mantenen; s’accedeix des de LibraryView.

## Canvis en LibraryView

- **Botó Afegir**: a la part superior, al costat o sota el títol. CTA contextual:
  - Biblioteca buida: "Afegir el primer llibre" o "Comença la teva biblioteca"
  - Biblioteca amb llibres: "+ Afegir llibre"
- **Estil**: botó amb estil primari (gradient, border) coherent amb el disseny existent.
- **Acció**: `navigate(ROUTES.ADD)`.

## Estat buit

- Quan `books.length === 0`:
  - Missatge: "Encara no tens llibres a la teva biblioteca"
  - Botó destacat: "Afegir el primer llibre"
  - El botó naviga a `/add`.

## Responsive

- Desktop: botó a la part superior.
- Mobile: botó superior (mateix lloc). FAB opcional si es considera millor UX.

## Redirecció ruta antiga

- El Notion menciona `/add-book`; el projecte usa `/add`. Si existeix ruta antiga, afegir redirect. Verificar: no sembla que hi hagi `/add-book` al codi actual; ROUTES.ADD = "/add". No cal canvi.
