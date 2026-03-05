# Design: Rol Superadmin i gestió de comunitats

## 1. Persistència del rol Superadmin

- **Firestore:** Document `config/superadmins` amb `{ uids: string[] }`.
- **Valor inicial:** `{ uids: ["6g9VBE4EagT5yk8PuSZRHZGwAuH2"] }`.
- **Servei:** `superadminService.isSuperadmin(userId)` llegeix el document i retorna si `userId` és a la llista.
- **Cache:** El client pot cachejar el resultat durant la sessió; revalidar abans d'accions sensibles (opcional).
- **Regles Firestore:** Cal permetre lectura del document a usuaris autenticats (per comprovar si són superadmin). Les operacions de gestió (crear comunitat, etc.) es faran des del client; les regles actuals de communities podrien necessitar actualització per permetre creació per superadmins (fora del scope d'aquest canvi si les regles ja ho permeten).

## 2. Ruta i vista de gestió

- **Ruta:** `/profile/admin-communities` (o `/admin/communities`).
- **Guard:** Abans d'entrar, verificar `isSuperadmin(currentUser.uid)`. Si no, redirigir a `/profile` o mostrar 403.
- **Vista:** `AdminCommunitiesView` amb subvistes o seccions: llistat, crear, editar comunitat, gestió de membres.

## 3. Perfil – entry point

- A `ProfileView`, si `isSuperadmin(user.uid)`, mostrar enllaç/botó "Gestió de comunitats" que navega a `/profile/admin-communities`.
- Si no és superadmin, no es mostra res.

## 4. Llistat de comunitats (AC3)

- Query a `communities` (totes, no només les que l'usuari és membre).
- Camps per comunitat: id, name, status, memberCount (obtingut amb subquery a members o count).
- Cercador: filtrar per nom (client-side o Firestore segons volum).
- Paginació: limit 10, startAfter cursor.
- Estat buit: "Cap comunitat. Crear comunitat".

## 5. Crear comunitat (AC4)

- Modal o formulari: nom (obligatori), descripció, privacitat (open|private), imatge (opcional, fase posterior).
- Cridar `createCommunity(ownerUserId, ...)` – el superadmin es pot assignar com a owner o crear com a "sistema". Per simplicitat, el superadmin serà owner de les noves comunitats que crei.

## 6. Editar i desactivar (AC5)

- Editar: mateixos camps que crear. `updateCommunity(communityId, data)`.
- Desactivar/arxivar: canviar `status` a `archived` o `inactive`. Les comunitats amb status diferent de `active` no es mostren als usuaris normals a `getUserCommunities`; la gestió les mostra totes.

## 7. Gestió de membres (AC6)

- Llista de membres: `getCommunityMembers(communityId)` – retorna actius. Incloure també banned per mostrar-los amb opció desbloquejar.
- Afegir membre: per email, crear invitació o afegir directament si l'email existeix (via `setCommunityMember` si tenim userId). El flux d'invite existent pot ser reutilitzat.
- Eliminar: `setMemberStatus(communityId, userId, 'left')`.
- Bloquejar: `setMemberStatus(communityId, userId, 'banned')`.
- Canviar rol: `updateMemberRole(communityId, userId, role)`.

## 8. Seguretat (AC7)

- UI: només visible si superadmin.
- Deep link: abans de renderitzar la vista, verificar `isSuperadmin`. Si no, redirect a `/profile`.
- Accions: cada operació (create, update, setMemberStatus, etc.) es fa via serveis; si Fallstore retorna permis denegat, mostrar error.

## 9. Estats de càrrega i error (AC8)

- Loading: spinner o skeleton mentre carreguen dades.
- Error: missatge clar, botó "Reintentar".
- Per accions (crear, editar, etc.): loading al botó, error inline.
