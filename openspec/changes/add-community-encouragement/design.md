## Context

- L’app ja té una col·lecció Firestore `community` amb un document per usuari (`community/{userId}`) que guarda `displayName`, `photoURL`, `currentBook`, `updatedAt`. La vista Comunitat llegeix tots els lectors amb `currentBook` i exclou l’usuari actual.
- La pantalla d’Inici (`HomeView`) mostra estadístiques, progrés global i el llibre "Llegint ara"; no hi ha cap subsistema de notificacions ni "inbox".
- No hi ha servei ni model per a dades que relacionin dos usuaris (enviador → receptor).

## Goals / Non-Goals

**Goals:**

- Persistir encoratjaments a Firestore (qui envia, a qui, quan).
- Afegir acció "Encoratja" (o similar) des de la vista Comunitat sobre cada lector/llibre.
- Mostrar a Inici els encoratjaments rebuts amb el text "[Sender] t'anima a seguir llegint".

**Non-Goals:**

- Notificacions push, email o in-app beyond la pantalla d’Inici.
- Límits de quota (p. ex. màxim encoratjaments per dia); es pot afegir més endavant.
- Marcar encoratjaments com a "llegits" (opcional futur); per ara només es mostren.

## Decisions

### Decision 1: Col·lecció Firestore `encouragements`

- **Què:** Una col·lecció de primer nivell `encouragements`. Cada document representa un encoratjament amb: `fromUserId`, `fromUserName`, `toUserId`, `createdAt`. Opcional: `bookTitle` o `bookId` per context.
- **Per què:** Consultar l’inbox del receptor és directe: `where('toUserId', '==', currentUser.uid)` + `orderBy('createdAt', 'desc')`. No cal escanejar subcol·leccions d’altres usuaris.
- **Alternativa considerada:** Subcol·lecció `users/{toUserId}/encouragements`. Descartada perquè l’escriptor seria el receptor; l’enviador hauria d’escriure al document d’un altre usuari, cosa que complica les regles de seguretat i el model mental.

### Decision 2: Nou servei `encouragementService.js`

- **Què:** Crear `encouragementService` amb `sendEncouragement(fromUserId, fromUserName, toUserId)` i `getEncouragementsForUser(userId)`.
- **Per què:** Separar responsabilitats respecte de `communityService` (que gestiona "qui llegeix què"). Els encoratjaments són una relació usuari→usuari.
- **Alternativa:** Ampliar `communityService`. Descartada per mantenir el domini comunitat vs encoratjaments clar.

### Decision 3: UI a Comunitat: botó o acció sobre la targeta del lector

- **Què:** Afegir un botó visible (p. ex. "Encoratja" o icona) a cada `ReaderCard` (o equivalent a `CommunityView`) que cridi `encouragementService.sendEncouragement(currentUser.uid, currentUser.displayName, reader.uid)`.
- **Per què:** Acció explícita i fàcil d’entendre; evita enviar encoratjaments per error amb un sol clic.
- **Alternativa:** Clic sobre la portada del llibre. Descartada per no confondre "veure detall" amb "enviar encoratjament"; el botó és més clar.

### Decision 4: Inici: secció "Encoratjaments rebuts" amb llista

- **Què:** A `HomeView`, una secció nova (banner o llista) que carregui `getEncouragementsForUser(user.uid)` i mostri cada item com a "[fromUserName] t'anima a seguir llegint" (i opcionalment el títol del llibre si es guarda).
- **Per què:** La proposal exigeix que el receptor ho vegi a la pantalla d’Inici; una secció dedicada és simple i escalable si més endavant s’afegeixen més camps o accions.

## Risks / Trade-offs

- **Risc:** Usuaris que envien molts encoratjaments (spam). **Mitigació:** Per ara sense límit; si es detecta abús, afegir quota o cooldown en un canvi posterior.
- **Trade-off:** No es persisteix quin llibre concret s’ha encoratjat (només "a qui"). Si es vol mostrar "t’anima a seguir llegint [Títol del llibre]", cal afegir `bookTitle` (o `bookId`) al document i passar-ho des de la UI en enviar.
- **Risc:** Regles de seguretat Firestore: només l’enviador ha de poder crear documents amb el seu `fromUserId`; només el receptor ha de poder llegir els que tenen el seu `toUserId`. Incloure això a les regles en desplegar.
