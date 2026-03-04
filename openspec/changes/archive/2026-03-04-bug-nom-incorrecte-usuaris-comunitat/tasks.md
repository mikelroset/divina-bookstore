# Tasks: Bug – Nom incorrecte dels usuaris a la comunitat (mostrar email, no uid)

## 1. Emmagatzemar i retornar email als membres

- [x] 1.1 A `setCommunityMember` (communityManagementService), acceptar `email` opcional dins de `profile` i desar-lo al document de Firestore (camp `email`).
- [x] 1.2 A `getCommunityMembers`, incloure el camp `email` a l’objecte retornat per cada membre.

## 2. Passar email en crear/afegir membres

- [x] 2.1 A `CommunityView`, en cridar `joinOpenCommunity`, afegir `email: currentUser.email ?? undefined` al objecte `profile` que es passa.
- [x] 2.2 A `CommunityView`, en cridar `createCommunity`, afegir `email: currentUser.email ?? undefined` a l’`ownerProfile`.
- [x] 2.3 A `acceptInvite` (communityManagementService), en cridar `setCommunityMember`, passar `email: normalizedUserEmail` (o el userEmail normalitzat) dins del `profile`.

## 3. useUserPrefs i comunitat per defecte

- [x] 3.1 Modificar `useUserPrefs(userId, profile)` per acceptar un segon paràmetre opcional `profile` (objecte amb `email`, `displayName`, `photoURL`).
- [x] 3.2 En cridar `ensureUserInDefaultCommunity(userId)` des de `useUserPrefs`, passar el segon argument `profile` quan existeixi (per desar l’email del usuari actual a la comunitat per defecte).
- [x] 3.3 A `App.jsx`, passar el usuari actual a useUserPrefs: `useUserPrefs(user?.uid, user)` (o `user ? { email: user.email, displayName: user.displayName, photoURL: user.photoURL } : undefined`).

## 4. UI: mostrar email als membres

- [x] 4.1 A `CommunityView`, a la llista de membres (on ara es mostra `m.displayName || m.userId`), canviar a `m.email || m.displayName || m.userId` per mostrar el correu quan estigui disponible.

## 5. Verificació

- [x] 5.1 Revisar que, per a nous membres (unir-se, acceptar invitació, crear comunitat) i per a l’usuari a la comunitat per defecte (amb profile passat des d’App), es desi l’email i es mostri a la llista.
- [x] 5.2 Revisar que els membres antics sense camp `email` continuïn mostrant uid (o displayName si hi és) fins que es disposi d’una actualització amb email.
