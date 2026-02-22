# Design: Fix encouragement UX

## Context

- La feature d’encoratjaments ja existeix: botó "Encoratja" a `CommunityView`, secció "Encoratjaments" a `HomeView` amb `getEncouragementsForUser(user.uid)`.
- El botó d’enviar no dona feedback d’èxit; la secció d’Inici només es veu quan l’usuari entra a Inici i té encoratjaments, sense cap avís a la nav.

## Goals / Non-Goals

**Goals:**

- Feedback clar a l’enviador: estat "Enviat ✓" i desactivar el botó per a qui ja ha rebut l’encoratjament en aquesta sessió.
- Indicador a la navegació (BottomNav) quan l’usuari té encoratjaments rebuts, perquè el receptor sàpiga on mirar.

**Non-Goals:**

- Notificacions push o email.
- Marcar encoratjaments com a "llegits" o amagar el badge després de visitar Inici (el badge reflecteix el comptador actual).

## Decisions

### Decision 1: Estat d’èxit al botó (Comunitat)

- **Què:** Mantenir un estat local `sentToUids` (array d’UIDs) a `CommunityView`. En èxit de `sendEncouragement`, afegir `reader.uid` a aquest estat. El botó per a un lector amb `uid` a `sentToUids` mostra "Enviat ✓" i queda desactivat.
- **Per què:** Feedback immediat sense dependre de persistència addicional; evita doble clic i deixa clar que l’acció s’ha completat.
- **Alternativa:** No desactivar i permetre múltiples enviaments. Descartada perquè el producte vol feedback clar i evitar confusió.

### Decision 2: Badge a "Inici" a la BottomNav

- **Què:** A la barra de navegació inferior, l’enllaç "Inici" mostra un indicador (badge amb comptador o punt) quan l’usuari té almenys un encoratjament rebut. El comptador es calcula amb `getEncouragementsForUser(user.uid)` (o equivalent) des d’un punt comú (App o hook).
- **Per què:** El receptor pot estar a Biblioteca, Comunitat o Perfil; amb un badge a "Inici" sap que hi ha contingut nou sense haver d’entrar a Inici primer.
- **Alternativa:** Badge a l’Header. Descartada per mantenir la nav com a únic lloc de navegació principal i no duplicar lògica; BottomNav ja és el lloc natural per a indicadors de seccions.

### Decision 3: On es carrega el comptador d’encoratjaments

- **Què:** Carregar el comptador (o la llista i derivar la longitud) a `App` quan hi ha usuari autenticat, i passar `encouragementCount` (número) a `BottomNav` com a prop.
- **Per què:** BottomNav és presentacional; App ja agrupa dades (user, books, stats) i les passa als fills. Un hook `useEncouragementCount(user?.uid)` retornant `{ count }` a App i passant `count` a BottomNav manté la separació i reutilitza el servei existent.
- **Alternativa:** BottomNav crida directament `encouragementService.getEncouragementsForUser`. Funcional però acobla la nav al domini d’encoratjaments; preferim que App inyecti la dada.

### Decision 4: Aspecte del badge

- **Què:** Badge numèric (comptador) o punt/indicador quan `count > 0`. Estil coherent amb la nav (p. ex. cercle amb número petit sobre la icona "Inici", o "Inici (N)").
- **Per què:** El comptador dona més informació que un simple punt; si el nombre és gran es pot mostrar "N" o cap a un màxim (p. ex. "9+").
- **Detall:** Posicionament relatiu/absolut sobre la icona d’Inici, tipografia petita, color que contrasti (p. ex. primary o accent).

## Risks / Trade-offs

- **Trade-off:** El comptador es carrega a App; si l’usuari rep un encoratjament mentre té l’app oberta, no es veurà el badge fins a refrescar o reentrar, llevat que s’afegeixi realtime (Firestore snapshot). Per ara es considera acceptable; es pot afegir listener en un canvi futur.
- **Risc:** Duplicar càrrega d’encoratjaments (App per al comptador, HomeView per a la llista). Mitigació: es pot reutilitzar la mateixa crida o un hook compartit; si cal optimitzar, un context d’encoratjaments podria servir comptador i llista.
