# Design: Mostrar email (no uid) als membres de la comunitat

## Context

- La llista de membres de la comunitat es construeix amb `getCommunityMembers(communityId)`, que retorna documents de `communities/{id}/members/{userId}` amb `userId`, `role`, `displayName` (opcional), `photoURL` (opcional).
- A la UI (`CommunityView`) es mostra `m.displayName || m.userId`; si `displayName` no existeix, es veu l’uid.
- Els membres es creen/actualitzen amb `setCommunityMember(communityId, userId, role, profile)`; el `profile` pot portar `displayName` i `photoURL`, però no s’emmagatzema l’email.

## Decisió

- **Camp `email` al document del membre:** Afegir un camp opcional `email` als documents de `communities/{communityId}/members/{userId}`. Sempre que en afegir o actualitzar un membre es tingui l’email (perfil de l’usuari, invitació acceptada, etc.), passar-lo al `profile` i desar-lo.
- **Origen de l’email:** (1) En unir-se a una comunitat oberta: `currentUser.email`. (2) En acceptar una invitació: `userEmail` de qui accepta. (3) En crear una comunitat: `currentUser.email` de l’owner. (4) En assegurar l’usuari a la comunitat per defecte: cal que qui cridi `ensureUserInDefaultCommunity` passi el perfil amb email (p. ex. des d’`useUserPrefs` si rep el `currentUser` o un perfil).
- **UI:** Mostrar `m.email || m.displayName || m.userId` per a la línia del membre, de manera que es prioritzi el correu quan estigui disponible. Els membres antics sense `email` desat continuaran mostrant uid fins que es torni a desar el membre amb email (o es faci una migració).

## Canvis de codi

1. **communityManagementService:**  
   - A `setCommunityMember`, afegir `email` al `profile` i desar-lo al document (opcional).  
   - A `getCommunityMembers`, incloure `email` a l’objecte retornat.

2. **CommunityView:**  
   - A la llista de membres, mostrar `m.email || m.displayName || m.userId`.  
   - En cridar `joinOpenCommunity`, passar `email: currentUser.email` dins del `profile`.  
   - En cridar `createCommunity`, passar `email: currentUser.email` dins de `ownerProfile`.

3. **acceptInvite:**  
   - En cridar `setCommunityMember` després d’acceptar, passar `email: userEmail` (normalitzat) al `profile`.

4. **useUserPrefs + ensureUserInDefaultCommunity:**  
   - Fer que `useUserPrefs` accepti un segon paràmetre opcional `profile` (o `currentUser`) i, en cridar `ensureUserInDefaultCommunity(userId, profile)`, passar-hi `email`, `displayName` i `photoURL` quan existeixin.  
   - A `App.jsx`, passar el `user` (o `{ email, displayName, photoURL }`) a `useUserPrefs(user?.uid, user)`.
