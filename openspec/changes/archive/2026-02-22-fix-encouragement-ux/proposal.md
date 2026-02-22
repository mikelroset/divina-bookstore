# Proposal: Fix encouragement UX (feedback + visibilitat per al receptor)

## Why

Dos problemes d’experiència amb la funció d’encoratjaments:

1. **Qui envia**: En clicar "Encoratja", si l’enviament té èxit no hi ha feedback clar: el botó torna a "Encoratja" i l’usuari no sap si s’ha enviat. Si falla, sí que es mostra "Error. Torna-ho a intentar", però l’èxit queda invisible.
2. **Qui rep**: Els encoratjaments es mostren només a la pantalla d’Inici, en una secció que només apareix quan hi ha encoratjaments. El receptor no té cap indicador a la navegació que li digui "tens encoratjaments"; ha d’anar a Inici i mirar. No té manera d’adonar-se fàcilment que algú li ha enviat un encoratjament.

## What Changes

- **Enviador (Comunitat)**: Després d’enviar un encoratjament amb èxit, el botó ha de mostrar clarament que s’ha enviat (p. ex. "Enviat ✓") i quedar desactivat per a aquell lector per evitar doble enviament i donar feedback visual.
- **Receptor (qualsevol pantalla)**: La navegació ha d’indicar quan l’usuari té encoratjaments rebuts (p. ex. badge o comptador a l’enllaç "Inici") perquè el receptor sàpiga que ha d’anar a Inici per veure-los.

## Capabilities

### Modified Capabilities

- **encouragement-send** (Comunitat): afegir estat d’èxit i feedback al botó (Enviat ✓, desactivar).
- **encouragement-inbox** (Inici): la informació que "tens encoratjaments" ha de ser visible des de la navegació (badge a Inici), no només dins de la pantalla d’Inici.

## Impact

- **CommunityView**: estat `sentToUids` (o equivalent) per marcar a qui s’ha enviat; botó mostra "Enviat ✓" i queda desactivat per a aquests lectors.
- **BottomNav**: rebre el comptador d’encoratjaments (o un booleà "té encoratjaments") i mostrar un indicador visual (badge/comptador) a l’enllaç "Inici" quan n’hi ha.
- **App**: obtenir el comptador d’encoratjaments de l’usuari actual (hook o càrrega a App) i passar-lo a BottomNav.
