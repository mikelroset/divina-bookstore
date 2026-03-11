# Design: Ressenyes

## Model de dades (Firestore)

### Col·lecció `reviews`

Document per ressenya:
- `bookId` (string): ID del llibre a la biblioteca de l'autor
- `bookTitle` (string)
- `bookAuthor` (string)
- `authorUserId` (string)
- `authorDisplayName` (string)
- `authorPhotoURL` (string, opcional)
- `text` (string): text de la ressenya
- `createdAt` (timestamp)
- `likeCount` (number): comptador denormalitzat per eficiència

### Subcol·lecció `reviews/{reviewId}/likes`

Document per like: `{userId}` com a ID del document.
- Permet consultar ràpid si un usuari ha fet like.
- 1 doc per usuari = màxim 1 like per membre (restricció estructural).

### Consistència del comptador

- Usar **transacció** Firestore per toggle like: llegir doc like, crear/eliminar, actualitzar likeCount.
- Frontend: debounce del botó like (300–500 ms) per evitar spam de clics.

## Navegació i rutes

- Ruta: `/reviews`
- Nav: afegir "Ressenyes" a `BottomNav` (entre Comunitat i Afegir, o substituint temporalment un slot).
- L'enllaç només visible si l'usuari està autenticat (com la resta de l'app).

## Fluxos principals

1. **Llistat**: query `reviews` ordenat per `createdAt` desc, amb `limit(10)` i `startAfter` per paginació.
2. **Cerca/filtres**: filtrar al client o amb query compost (Firestore limitacions: un índex per combinació). MVP: filtrar en memòria si el dataset és petit; si creix, moure a Cloud Functions o queries compostos.
3. **Publicar**: formulari modal/pàgina que requereix llibre acabat; crea doc a `reviews`.
4. **Like**: transacció que crea/elimina doc a `likes` i actualitza `likeCount`.
5. **Membre eliminat**: si `authorDisplayName` és buit o indiquem membre eliminat, mostrar "Membre eliminat" (no eliminar ressenyes).

## UX i accessibilitat

- Resum truncat: màxim 250 caràcters; botó "Llegir més" / "Mostrar menys".
- Estat buit: "No s'han trobat ressenyes amb aquests criteris" + opció per netejar filtres.
- Focus visible i ordre de tabulació lògic.
- Loading i error states visuals (spinner, missatge d'error).

## Decisions

- **Llibre acabat**: comprovem `status === "completed"` per permetre publicar ressenya.
- **Autor eliminat**: mantenir ressenya; mostrar "Membre eliminat" quan no tenim displayName.
- **Truncament**: 250 caràcters per al resum; el "Llegir més" desplega el contingut complet in-place.
