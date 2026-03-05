# Proposal: Notificació de llibre llegit als usuaris de la comunitat

## Why

Quan un membre d'una comunitat marca un llibre com a Completat, la resta de membres han de veure una notificació a la seva pàgina d'inici. Això celebra l'assoliment, genera conversa i incentiva la lectura.

## What

- **AC1:** Marcar el llibre com a Completat automàticament quan pàgines llegides >= pàgines totals (amb total informat).
- **AC2:** Crear notificació de llibre completat (títol, nom de qui ha completat, data).
- **AC3:** Mostrar la notificació a la Home dels altres membres de la comunitat (mateix estil visual que la resta de blocs).
- **AC4:** Botó "Tancar"; la notificació caduca 3 dies després (mateixa lògica que encoratjaments).
- **Edge cases:** No autocompletar sense pàgines totals; no marcar si progrés baixa; idempotència (no duplicar); no mostrar al qui ha completat.

## Fora d'abast

- Comentaris, likes, compartir a xarxes.
- Notificacions push o per email.

## Referència

- [Notion – Feature: Notificació de llibre llegit als usuaris de la comunitat](https://www.notion.so/miquelroset/Feature-Notificaci-de-llibre-llegit-als-usuaris-de-la-comunitat-31a1492a7042803184d2d0d583f20231)
