# Tasks: Gestió de comunitat

## Fase 1: Migració i model mínim (AC1 + AC2 mínim)

- [x] 1.1 Definir constant de comunitat per defecte (ID i nom "Homenatge a la Divina") i ownerUserId `6g9VBE4EagT5yk8PuSZRHZGwAuH2`.
- [x] 1.2 Crear servei o mòdul per a comunitats: crear/obtenir comunitat per defecte (crear document a `communities/{id}` si no existeix); afegir membre a `communities/{id}/members/{userId}` amb role (owner | participant).
- [x] 1.3 Afegir `activeCommunityId` a preferències usuari (prefs/settings). En carregar prefs, si no hi ha activeCommunityId, assignar la comunitat per defecte i assegurar que l'usuari és membre (lazy migration).
- [x] 1.4 Pantalla de comunitat: obtenir comunitats de l'usuari (per ara només la per defecte); mostrar selector si n'hi ha més d'una; filtrar/getCommunityReaders per comunitat activa quan el model ho suporti (en fase 1 pot quedar igual).
- [ ] 1.5 Verificació: usuari existent que obre l'app segueix veient les seves dades i la pantalla de comunitat sense errors; queda membre de la comunitat per defecte.

## Fase 2: Creació, rols, membres (AC3, AC4, AC5) — posterior

- [ ] 2.1 UI crear comunitat (nom, descripció, oberta/privada); crear document i afegir creador com a owner/admin.
- [ ] 2.2 Gestió de membres: llistat amb rol; convidar per email; banejar/expulsar; promocionar a admin (Owner/Admin).
- [ ] 2.3 Invitacions: col·lecció communityInvites; un pendent per (communityId, email); caducitat; acceptar/rebutjar; flux per email inexistent.

## Fase 3: Dissolució i UX (AC6, AC7) — posterior

- [ ] 3.1 Només Owner pot dissoldre; marcar status dissolved; fallback si comunitat activa dissolta.
- [ ] 3.2 Estat buit si usuari sense comunitats; buscar comunitats obertes; 5 més populars; crear comunitat.

## Verificació

- [ ] V1 Revisar que la migració lazy no trenca usuaris existents i que la comunitat per defecte existeix amb l'owner correcte.
