# Design: Notificació de llibre llegit als usuaris de la comunitat

## Context

L'app actualitza el progrés dels llibres des de Home (ReadingBookBlock) i des del formulari Add/Edit. Quan currentPage >= totalPages i totalPages > 0, cal:
1. Canviar status a "completed".
2. Crear notificació per a les comunitats on l'usuari és membre.
3. Mostrar la notificació a la Home dels altres membres.

## Decisions

1. **Auto-completar:** En `handleUpdateCurrentPageFromHome` i `AddBookRoute handleSave`, si `newCurrentPage >= totalPages` i `totalPages > 0` i `prevCurrentPage < newCurrentPage` (no disminueix), afegir `status: "completed"` a la dada que es guarda. El BookForm ja valida que currentPage no superi pages.

2. **Col·lecció Firestore:** `bookCompletedNotifications` amb documents:
   - `communityId`, `bookId`, `bookTitle`, `completedByUserId`, `completedByUserName`, `completedAt`
   - Idempotència: abans de crear, verificar que no existeixi una notificació amb mateix `(communityId, bookId)` recent (ex. 24h) per evitar duplicats per reintents.

3. **Per comunitat o per usuari:** Una notificació es crea **per comunitat**. L'usuari pot ser membre de diverses comunitats; es crea una notificació per cada comunitat on és membre (en el moment de completar).

4. **Dismissals:** Document `users/{uid}/prefs/settings` (o subdoc) amb `dismissedBookNotificationIds: string[]` (ids de notificacions tancades). Quan l'usuari prem "Tancar", afegir el id a aquest array. Alternativa: subcol·lecció `users/{uid}/notificationDismissals/{notificationId}` per no fer el doc prefs massa gran.

5. **Consulta:** Obtenir notificacions on `communityId in userCommunityIds`, `completedByUserId !== currentUser.uid`, `completedAt` dins dels últims 3 dies, i filtrar les que l'usuari ha tancat. Firestore: query per `communityId in [...]` (màxim 10 per query) o fer N queries i fusionar.

6. **Firestore "in" limit:** Firestore permet `where("communityId", "in", array)` amb màxim 10 valors. Si l'usuari té >10 comunitats, cal paginar o fer múltiples queries. Per MVP assumim usuari amb poques comunitats.
