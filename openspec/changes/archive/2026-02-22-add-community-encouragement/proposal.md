## Why

La comunitat de lectors guanya valor si els usuaris poden interactuar entre ells. Poder enviar un "encoratjament" a algú que està llegint un llibre afavoreix la connexió i la motivació sense necessitat de xat o comentaris complexos.

## What Changes

- A la vista **Comunitat**: es pot clicar sobre el llibre (o la targeta) d’un altre lector per enviar-li un encoratjament.
- El **receptor** veu a la pantalla d’**Inici** un missatge del tipus: "[Nom de qui l’ha enviat] t’anima a seguir llegint".
- Es persisteixen els encoratjaments enviats/rebuts (per poder mostrar-los i, si cal, marcar-los com a llegits).

## Capabilities

### New Capabilities

- `encouragement-send`: Enviar un encoratjament des de la vista Comunitat (acció sobre el llibre d’un altre lector; identificar receptor i llibre; persistir qui envia, a qui i quan).
- `encouragement-inbox`: Mostrar a la pantalla d’Inici els encoratjaments rebuts per l’usuari (missatge "[Sender] t'anima a seguir llegint"; origen de dades persistit).

### Modified Capabilities

- (cap: no es modifiquen requisits d’auth-session ni d’altres specs existents)

## Impact

- **Vista Comunitat** (`CommunityView`, `ReaderCard` o equivalent): nou gest/acció "Encoratja" (o similar) sobre cada lector/llibre; crida a servei per enviar encoratjament.
- **Pantalla d’Inici** (`HomeView`): nova secció o banner per als encoratjaments rebuts (llegir de persistència, mostrar text amb nom del sender).
- **Backend / persistència**: nou model i API per a encoratjaments (p. ex. Firestore: col·lecció o subcol·lecció; camps: fromUserId, fromUserName, toUserId, bookId/bookRef, createdAt). Possible `encouragementService` o ampliació de `communityService`.
- **Context o hooks**: si cal, estat o hook per a "encoratjaments rebuts" a Inici.
