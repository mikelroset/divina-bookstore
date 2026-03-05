# Tasks: Notificació de llibre llegit als usuaris de la comunitat

## 1. Auto-completar llibre

- [x] 1.1 A `handleUpdateCurrentPageFromHome`: si newCurrentPage >= totalPages i totalPages > 0 i prev < new, afegir `status: "completed"` al update.
- [x] 1.2 A `AddBookRoute handleSave`: mateixa lògica per formulari (edició i nou llibre).

## 2. Servei de notificacions

- [x] 2.1 Crear `src/services/bookCompletedNotificationService.js`: `createNotification` (createBookCompletedNotification) amb idempotència.
- [x] 2.2 `getBookCompletedNotifications(userId, userCommunityIds)`: retorna notificacions no caducades (3 dies), no pròpies, no tancades.
- [x] 2.3 `dismissBookCompletedNotification(userId, notificationId)`: marca com tancada per l'usuari.

## 3. Crear notificació en completar

- [x] 3.1 Després d'actualitzar el llibre a completed, crear una notificació per cada comunitat (cridat des d'App, amb userCommunityIds).

## 4. Bloc Home

- [x] 4.1 Passar `userCommunityIds` a HomeView (des d'App).
- [x] 4.2 Crear bloc "Llibres llegits a la comunitat" a HomeView: carregar notificacions, mostrar llista amb mateix estil que Encoratjaments, botó Tancar.
- [x] 4.3 Al tancar, cridar `dismissBookCompletedNotification` i actualitzar l'estat local.

## 5. Firestore rules (opcional doc)

- [ ] 5.1 Documentar regles recomanades per `bookCompletedNotifications` i `users/{uid}/prefs/dismissedBookNotifications`. Implementació depèn de l'entorn de deploy.

## 6. Verificació

- [x] 6.1 Completar un llibre des de Home i des del formulari; verificar que es crea notificació i es mostra als altres membres.
- [x] 6.2 Verificar que el qui ha completat no veu la notificació.
- [x] 6.3 Verificar Tancar i caducitat 3 dies.
