# Tasks: Bug – Comunitat mostra estadístiques d’usuaris que no formen part de la comunitat seleccionada

## 1. Filtrar lectors per membres de la comunitat activa

- [x] 1.1 A `communityService.getCommunityReaders`, acceptar paràmetre `activeCommunityId`. Si és null/undefined, retornar array buit.
- [x] 1.2 Obtenir els membres actius de la comunitat (cridar `getCommunityMembers(activeCommunityId)` des de `communityManagementService`) i construir el conjunt d’IDs (userId).
- [x] 1.3 Obtenir tots els lectors de la col·lecció `community` (comportament actual) i filtrar per `reader.uid` dins del conjunt de membres; retornar només aquests.

## 2. Utilitzar comunitat activa a la vista

- [x] 2.1 A `CommunityView`, passar `activeCommunityId` a `communityService.getCommunityReaders(activeCommunityId)` en l’efecte que carrega els lectors, i incloure `activeCommunityId` a les dependències.
- [x] 2.2 Assegurar que les estadístiques (nombre de lectors, gèneres, etc.) es calculen ja sobre el llistat filtrat retornat pel servei (no cal canviar la lògica si la font de dades és `communityReaders`).

## 3. Verificació

- [ ] 3.1 Revisar: en una comunitat on només ets tu com a membre, només es veu la teva activitat i les estadístiques reflecteixen 1 lector.
- [ ] 3.2 Revisar: en canviar de comunitat, el llistat i les estadístiques s’actualitzen segons els membres d’aquella comunitat.
