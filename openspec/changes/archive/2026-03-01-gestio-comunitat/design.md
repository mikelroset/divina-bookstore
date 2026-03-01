# Design: Gestió de comunitat

## Model de dades (Firestore)

- **users/{userId}** (o prefs): `activeCommunityId` (string, nullable).
- **communities/{communityId}**: name, description, visibility (open | private), ownerUserId, status (active | dissolved), timestamps.
- **communities/{communityId}/members/{userId}**: role (owner | admin | participant), status (active | banned | left), joinedAt, updatedAt.
- **communityInvites** (global): communityId, email, invitedByUserId, status (pending | accepted | rejected | expired | revoked), timestamps, expiresAt.

## Migració inicial (AC1)

- **Comunitat per defecte:** ID constant (p. ex. `default` o UUID). Crear document a `communities/{defaultId}` amb nom "Homenatge a la Divina", visibility private, ownerUserId `6g9VBE4EagT5yk8PuSZRHZGwAuH2`, status active.
- **Usuaris existents:** Migració "lazy": en carregar l'app, si l'usuari no té `activeCommunityId` o no és membre de cap comunitat, afegir-lo a la comunitat per defecte (members/{userId} amb role participant) i establir activeCommunityId. Així no cal enumerar tots els usuaris a Firestore.
- **Compatibilitat:** La col·lecció actual `community/{userId}` (estat de lectura) es pot mantenir o migrar a un model per comunitat; en fase 1 es pot deixar global i filtrar per comunitat activa més endavant.

## Selector de comunitat (AC2, mínim)

- A la pantalla de comunitat, mostrar un selector (dropdown) amb les comunitats de les quals l'usuari és membre (obtingudes per collection group query o denormalitzant a l'usuari).
- Comunitat activa: llegir/desar a prefs (activeCommunityId). En canviar, refrescar dades de la comunitat.

## Rols i permisos (AC4)

- Owner: tot (config, dissoldre, transferir).
- Administrador: convidar, banejar, promocionar a admin.
- Participant: veure, abandonar.
- Regles: no deixar comunitat sense Owner; bans i canvis de rol atòmics (transaccions).

## Invitacions (AC5)

- Màxim 1 invitació pendent per (communityId, email). Caducitat (p. ex. 14 o 30 dies). Reenviar = actualitzar la mateixa invitació.

## Edge cases

- Concurrència: operacions de rol/ban atòmiques; en conflicte, error + refrescar.
- Dissolució: si la comunitat activa és dissolta, reassignar a la per defecte o estat buit.
- Usuari banejat: treure del selector; si era activa, mateix fallback que dissolució.
