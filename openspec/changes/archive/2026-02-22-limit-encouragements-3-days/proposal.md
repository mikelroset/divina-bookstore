# Proposal: Limitar encoratjaments a 3 dies i vincular-los al llibre

## Why

Actualment els encoratjaments es persisteixen sense límit i sense vincle al llibre concret que es llegeix; el receptor veu "[Nom] t'anima a seguir llegint" sense saber per quin llibre. Es vol donar més context (nom + llibre), limitar la vida útil dels missatges a 3 dies i evitar spam: un mateix enviador no pot enviar un segon encoratjament a la mateixa persona pel mateix llibre fins que hagin passat 3 dies. La restricció és per parell **usuari receptor + llibre**: si el receptor llegeix dos llibres, es pot encoratjar una vegada per cada llibre (el mateix dia o en dies diferents), i cada relació receptor–llibre té el seu propi cooldown de 3 dies.

## What Changes

- **Retenció 3 dies:** Els encoratjaments només es mostren al receptor durant 3 dies; passats els 3 dies el missatge desapareix de la seva vista (Inici).
- **Cooldown per receptor + llibre:** Durant 3 dies, la persona que envia no pot tornar a enviar un encoratjament a la mateixa persona pel mateix llibre. Passats els 3 dies, pot tornar a enviar per aquell llibre (i en qualsevol moment pot enviar per un altre llibre que la mateixa persona estigui llegint).
- **Un encoratjament per llibre:** Si una persona llegeix més d’un llibre, es la pot encoratjar tantes vegades com llibres llegeixi, però només una vegada per cada llibre dins de la finestra de 3 dies. P. ex. el mateix dia es poden enviar dos encoratjaments (un per llibre A, un per llibre B), o un dia per un llibre i un altre dia per l’altre; la restricció és sempre per la relació usuari–llibre.
- **Missatge amb nom i llibre:** El text de l’encoratjament ha d’incloure el nom de qui envia i el llibre pel qual l’envia (p. ex. "[Nom] t'anima a seguir llegint [Títol del llibre]").

## Capabilities

### Modified Capabilities

- **encouragement-send:** Afegir bookId/bookTitle al document; abans d’enviar, comprovar que no existeix un encoratjament (mateix fromUserId, toUserId, bookId) amb createdAt dins dels últims 3 dies; desactivar o amagar el botó quan el cooldown estigui actiu; enviar des de la targeta que representa un lector+llibre concret.
- **encouragement-inbox:** Filtrar els encoratjaments rebuts per createdAt (només els dels últims 3 dies); mostrar el missatge amb nom del sender i títol del llibre.

## Impact

- **Model de dades:** Col·lecció `encouragements`: afegir camps `bookId` i `bookTitle` (o equivalent) a cada document; mantenir `fromUserId`, `fromUserName`, `toUserId`, `createdAt`.
- **encouragementService:** `sendEncouragement(..., bookId, bookTitle)`; nova funció o lògica per comprovar si es pot enviar (no hi ha encoratjament recent per fromUserId + toUserId + bookId en 3 dies); `getEncouragementsForUser(userId)` ha de filtrar per `createdAt` dins dels últims 3 dies i retornar dades amb bookTitle per al missatge.
- **CommunityView:** Passar el llibre de la targeta (reader.currentBook) al enviar; desactivar o amagar "Encoratja" quan el cooldown per (recipient, llibre) estigui actiu (consultant abans d’enviar o des del servei).
- **HomeView:** Mostrar cada encoratjament com "[fromUserName] t'anima a seguir llegint [bookTitle]" (només els que passin el filtre de 3 dies).
