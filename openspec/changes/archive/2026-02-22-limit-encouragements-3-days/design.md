# Design: Limitar encoratjaments a 3 dies i vincular-los al llibre

## Context

- La col·lecció Firestore `encouragements` té documents amb `fromUserId`, `fromUserName`, `toUserId`, `createdAt`. No hi ha camp de llibre.
- La vista Comunitat mostra una targeta per lector amb `reader.currentBook` (un llibre en lectura per lector); el botó "Encoratja" és per targeta (lector + llibre).
- Inici mostra encoratjaments amb "[fromUserName] t'anima a seguir llegint" sense llibre.
- L’índex compost existent és `toUserId` (ASC) + `createdAt` (DESC).

## Goals / Non-Goals

**Goals:**

- Persistir bookId i bookTitle (o títol) a cada encoratjament.
- Mostrar als receptors només encoratjaments amb menys de 3 dies; el missatge inclou nom + llibre.
- Impedir enviar un segon encoratjament (mateix enviador → mateix receptor → mateix llibre) dins dels 3 dies; passats els 3 dies es pot tornar a enviar per aquell llibre.
- Si el receptor té més d’un llibre en lectura (quan el model ho permeti), un enviador pot enviar un encoratjament per cada llibre, amb cooldown independent per cada parell (receptor, llibre).

**Non-Goals:**

- Eliminar físicament documents de Firestore als 3 dies (opcional futur); per ara filtrar en lectura és suficient.
- Canviar el model de "un llibre en lectura" a "varis llibres" a la comunitat; el canvi es limita a vincular cada encoratjament a un llibre i aplicar el límit per llibre.

## Decisions

### Decision 1: Camps nous al document d’encoratjament

- **Què:** Afegir `bookId` (string, opcional per compatibilitat) i `bookTitle` (string, per mostrar al missatge) a cada document de `encouragements`. En crear, passar-los des de la targeta (reader.currentBook.id, reader.currentBook.title).
- **Per què:** bookId permet identificar la relació (receptor + llibre) per al cooldown; bookTitle permet mostrar el missatge sense fer una consulta extra.
- **Alternativa:** Només bookId i resoldre el títol des de la biblioteca del receptor. Descartada per no dependre d’altres col·leccions i perquè el títol pot canviar; guardar una còpia al moment d’enviar és simple.

### Decision 2: Càlcul dels 3 dies

- **Què:** Considerar "dins dels 3 dies" com: `createdAt >= (ara - 3 dies)` en mil·lisegons o equivalent (p. ex. Timestamp >= now - 3*24*60*60*1000, o utilitzar una funció de data que resti 3 dies).
- **Per què:** Definició clara i fàcil de filtrar en consultes o en memòria després de llegir.
- **Detall:** A Firestore, filtrar per `createdAt >= X` on X és un Timestamp de fa 3 dies requereix llegir o bé amb query (si l’índex ho permet) o bé filtrar en client després de `getEncouragementsForUser` si la query actual és per toUserId + orderBy createdAt. La query actual retorna tots els del receptor; filtrar al client per `createdAt >= (now - 3 days)` és acceptable i evita nous índexs si cal.

### Decision 3: Comprovar cooldown abans d’enviar

- **Què:** Abans de cridar `addDoc`, el client (o el servei) consulta si existeix algun document a `encouragements` amb `fromUserId == currentUser.uid`, `toUserId == reader.uid`, `bookId == reader.currentBook.id` (o equivalent) i `createdAt` dins dels últims 3 dies. Si n’hi ha, no es permet enviar i la UI desactiva o amaga el botó (o mostra "Disponible en X dies").
- **Per què:** La restricció és per (enviador, receptor, llibre); la consulta ha de reflectir això. Fer-ho al client amb una funció tipus `canSendEncouragement(fromUserId, toUserId, bookId)` que cridi una query o un mètode del servei que retorni booleà.
- **Índex:** Si es fa una query Firestore amb where on fromUserId, toUserId, bookId i createdAt, caldrà un índex compost (fromUserId, toUserId, bookId, createdAt). Alternativa: obtenir els encoratjaments enviats per l’usuari actual (where fromUserId == currentUser.uid) i filtrar en client per toUserId, bookId i createdAt; això pot ser acceptable si el nombre d’enviaments per usuari no és molt gran.

### Decision 4: Filtrar inbox per 3 dies

- **Què:** A `getEncouragementsForUser`, després d’obtenir els documents (toUserId == userId, orderBy createdAt desc), filtrar en JavaScript els que tinguin `createdAt >= (now - 3 days)` abans de retornar.
- **Per què:** No cal esborrar documents; el receptor només veu els recents. Si més endavant es vol netejar Firestore, es pot afegir un job; per ara filtrar en lectura és suficient.
- **Alternativa:** Query amb where createdAt >= threshold. Requereix índex i que Firestore accepti comparació amb Timestamp; la query actual ja fa orderBy createdAt, afegir un where podria requerir un nou índex. Filtrar al client després de llegir és més simple.

### Decision 5: Text del missatge a Inici

- **Què:** Cada ítem a la llista d’encoratjaments: "[fromUserName] t'anima a seguir llegint [bookTitle]". Si bookTitle falta (documents antics), fallback: "[fromUserName] t'anima a seguir llegint".
- **Per què:** El receptor sap qui envia i per quin llibre; coherent amb la proposta.

### Decision 6: UI Comunitat – botó per llibre (targeta)

- **Què:** Cada targeta de lector representa un (lector, llibre). El botó "Encoratja" envia per aquest lector i aquest llibre. Si el cooldown (3 dies) per (currentUser, reader, book) està actiu, el botó es desactiva o es mostra un text tipus "Enviat" / "Disponible en X dies" segons el disseny.
- **Per què:** La restricció és per llibre; la UI ja és "una targeta per lector amb un llibre", així que un botó per targeta és correcte. Si en el futur un lector pot tenir diversos llibres en lectura, serien diverses targetes (o diversos botons per llibre) amb cooldown independent per cada un.

## Risks / Trade-offs

- **Trade-off:** Filtrar per 3 dies al client implica que es llegeixen tots els encoratjaments del receptor i es descarten els vells; si el nombre creix molt, es podria afegir query amb where createdAt >= threshold i un índex adequat.
- **Risc:** Documents antics sense bookId/bookTitle: la UI ha de tolerar valors absents (fallback de text).
- **Regles Firestore:** Les regles actuals permeten crear amb fromUserId; cal assegurar que el nou camp bookId/bookTitle es pugui escriure (no restriccions extra). La lectura per comprovar cooldown des del client: l’enviador ha de poder llegir els seus propis enviaments (where fromUserId == request.auth.uid); si ara mateix només el receptor pot llegir (toUserId == request.auth.uid), caldrà ampliar les regles per permetre que l’enviador llegeixi documents on fromUserId == request.auth.uid (per a la consulta de cooldown), o implementar el check d’una altra manera (p. ex. funció Cloud que comprovi i retorni booleà).
