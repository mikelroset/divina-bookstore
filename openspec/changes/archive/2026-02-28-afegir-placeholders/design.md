# Design: Placeholders per portades i avatars

## Context

- Els components BookCard, CommunityView, HomeView, ProfileView, Header i altres mostren imatges (`coverUrl`, `photoURL`) sense fallback; si la URL és buida o falla, la UI pot quedar amb buits o errors.
- Es requereix experiència visual coherent i fallbacks clars sense canviar el layout.

## Decisió

1. **Components reutilitzables:**
   - **BookCover:** rep `src`, `alt`, `className`. Si `src` és buit o la imatge falla (onError), mostra un div placeholder amb la mateixa mida/ratio (h-48 object-cover per defecte), icona de llibre (BookOpen) o fons neutre (slate-200). Manté les dimensions per evitar layout shift.
   - **Avatar:** rep `src`, `alt`, `displayName` (opcional). Si `src` és buit o falla, mostra un div circular amb inicials (primera lletra del displayName) o icona User; mateixa mida que l’avatar real.

2. **Implementació:**
   - Estat local `imageError` o usar `onError` per canviar a placeholder; no fer retries agressius.
   - Les imatges reals usen `onError` per caure al placeholder; no bloquejar el rendering.
   - `alt` segons AC4: portada "Portada de {títol}" o "Portada no disponible"; avatar "Avatar de {nom}" o "Avatar no disponible".

3. **On aplicar:**
   - BookCard: BookCover
   - CommunityView: BookCover per llibres, Avatar per lectors
   - HomeView: BookCover pel llibre en lectura
   - ProfileView, Header: Avatar
   - BookForm: BookCover (o equivalent) per la previsualització
   - ReaderCard si s’usa: Avatar i BookCover

4. **Skeleton (AC3):** Per ara es pot ometre o fer mínim (p. ex. un div amb animate-pulse quan loading); la prioritat són els placeholders per dades faltants/errors. Es pot deixar per un canvi posterior si el temps és limitat.
