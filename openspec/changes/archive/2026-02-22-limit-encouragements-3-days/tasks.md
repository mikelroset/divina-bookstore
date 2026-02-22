# Tasks: Limitar encoratjaments a 3 dies i vincular-los al llibre

## 1. Model i servei d’encoratjaments

- [x] 1.1 Afegir camps `bookId` i `bookTitle` al document Firestore en `sendEncouragement`. Actualitzar la signatura a `sendEncouragement(fromUserId, fromUserName, toUserId, bookId, bookTitle)` (bookTitle opcional, fallback "" o "Llibre").
- [x] 1.2 A `getEncouragementsForUser(userId)`, després d’obtenir els documents, filtrar en client els que tinguin `createdAt` dins dels últims 3 dies (createdAt >= now - 3*24*60*60*1000 ms, o equivalent amb Timestamp) abans de retornar.
- [x] 1.3 Afegir funció (al servei o utilitat) `canSendEncouragement(fromUserId, toUserId, bookId)` que comprovi si existeix algun encoratjament amb aquest fromUserId, toUserId, bookId i createdAt dins dels últims 3 dies; retornar false si n’hi ha, true si no. Implementar amb query Firestore (where fromUserId, toUserId, bookId, createdAt >= threshold) o obtenint enviaments de l’enviador i filtrant en client.
- [x] 1.4 Actualitzar regles Firestore: permetre que l’enviador pugui llegir documents on `fromUserId == request.auth.uid` (per a la consulta de cooldown), a més de les regles existents de crear i que el receptor llegeixi per toUserId. Documentar al README si cal.

## 2. Índex Firestore (si s’usa query per cooldown)

- [x] 2.1 Si la comprovació de cooldown es fa amb query (where fromUserId, toUserId, bookId, createdAt), crear l’índex compost necessari a la consola Firebase o afegir-lo a firestore.indexes.json. Si la comprovació es fa filtrant en client després d’una query per fromUserId, assegurar que l’índex toUserId + createdAt segueix sent vàlid per getEncouragementsForUser.

## 3. Vista Comunitat

- [x] 3.1 A CommunityView, en cridar `sendEncouragement`, passar `reader.currentBook.id` (o identificador estable del llibre) i `reader.currentBook.title` com a bookId i bookTitle. Garantir que només es crida quan reader.currentBook existeix (la targeta ja es mostra per lectors amb llibre).
- [x] 3.2 Abans de mostrar l’estat del botó "Encoratja", cridar `canSendEncouragement(currentUser.uid, reader.uid, reader.currentBook?.id)`. Si retorna false, desactivar el botó o mostrar text tipus "Enviat" / "Disponible en X dies" (opcional) per a aquella targeta (lector+llibre).
- [x] 3.3 Mantenir l’estat local `sentToUids` si es desitja feedback immediat "Enviat ✓"; si el cooldown es basa en dades de Firestore, considerar marcar com a "no enviable" per (reader.uid, reader.currentBook?.id) quan canSend retorni false.

## 4. Vista Inici (inbox)

- [x] 4.1 A HomeView, al mostrar cada encoratjament, utilitzar el format "[fromUserName] t'anima a seguir llegint [bookTitle]". Si bookTitle és absent (documents antics), fallback: "[fromUserName] t'anima a seguir llegint".
- [x] 4.2 Confirmar que getEncouragementsForUser ja filtra per 3 dies (tasca 1.2) i que la llista i el badge (useEncouragementCount) reflecteixen només els encoratjaments dels últims 3 dies.

## 5. Verificació

- [x] 5.1 Provar enviar un encoratjament per un lector+llibre: el missatge a Inici ha de mostrar nom i llibre; el botó a Comunitat ha de quedar desactivat per aquella targeta fins a 3 dies (o simular passat el temps).
- [x] 5.2 Provar que un mateix enviador pot enviar a la mateixa persona per un altre llibre (si el receptor té més d’un llibre en lectura) i que passats 3 dies es pot tornar a enviar per el mateix llibre.
