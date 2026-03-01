# Design: Filtrar lectors i estadístiques per membres de la comunitat activa

## Context

- La col·lecció `community` (Firestore) és global: un document per usuari amb el seu `currentBook` i dades de perfil. No té cap camp `communityId`.
- Les comunitats i els seus membres estan a `communities/{communityId}/members/{userId}` (role, status active).
- La pantalla de comunitat obté els “lectors” via `communityService.getCommunityReaders()` i calcula estadístiques a partir d’aquest llistat.

## Decisió

- **Filtrar per membres actius de la comunitat activa:**  
  `getCommunityReaders` ha de rebre `activeCommunityId`. Si es passa:
  1. Obtenir la llista d’IDs de membres actius de la comunitat (`getCommunityMembers(activeCommunityId)` → `members[].userId`).
  2. Obtenir tots els lectors de la col·lecció `community` (com ara).
  3. Retornar només els lectors el `uid` dels quals està dins del conjunt de membres actius.

- **API:**  
  `getCommunityReaders(activeCommunityId)`. Si `activeCommunityId` és null o undefined, es pot retornar array buit o mantenir el comportament actual; el més coherent és retornar buit si no hi ha comunitat seleccionada.

- **Caller:**  
  `CommunityView` ja té `activeCommunityId`; passar-lo a `communityService.getCommunityReaders(activeCommunityId)` i utilitzar el resultat filtrat per al llistat i per a les estadístiques.

## Flux

1. L’usuari té `activeCommunityId` (prefs).
2. CommunityView crida `getCommunityReaders(activeCommunityId)`.
3. El servei obté membres de la comunitat i lectors globals; retorna la intersecció.
4. La UI mostra només aquests lectors i les estadístiques es calculen sobre aquest conjunt.
