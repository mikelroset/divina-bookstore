# Design: Responsive del flux d'invitació a comunitat (mòbil)

## Context

- La pantalla d’acceptació d’invitació és **InviteAcceptView** (ruta `/community/invite/:inviteId`): full page amb una card centrada (`max-w-md mx-auto px-4 py-12`). No és un modal HTML sinó una vista completa; en mòbil el “modal” que es veu desmaquetat és aquesta card / el layout general.
- El layout principal de l’app és `<div className="max-w-4xl mx-auto px-6 py-8">` dins d’un contenidor amb `min-h-screen`. Si algun fill té amplada fixa o no fa wrap, pot provocar scroll horitzontal.
- A **CommunityView**, la secció “Invitar per correu” (formulari email + Convidar) usa `flex flex-wrap` amb un input `min-w-[180px]`; en pantalles molt estretes pot contribuir a desbordament.

## Decisió

1. **Contenidor principal (App):** Afegir `overflow-x-hidden` al wrapper del contingut (el `div` que conté les rutes) per evitar que qualsevol desbordament generi scroll horitzontal a tota la app.
2. **InviteAcceptView:**
   - Garantir que el contenidor principal i la card no desbordin: `w-full max-w-md` amb `box-border` i padding que no sumi més que el 100% (px-4 és segur; evitar valors grans).
   - Les files de botons (Acceptar / Rebutjar) que ja fan `flex gap-3 justify-center` poden fer `flex-wrap` per si el text és molt llarg.
   - Assegurar que no hi ha elements amb `min-width` excessiu o amplada fixa que superin el viewport en mòbil.
3. **CommunityView – formulari d’invitació:** Canviar l’input de `min-w-[180px]` a `min-w-0` (o un valor més baix) dins del flex perquè pugui encongir-se en pantalles estretes; mantenir `flex-1` i que el contenidor pare tingui `min-w-0` si cal.

## Verificació

- Provar en viewport estret (ex. 320px o 375px) que no apareix scroll horitzontal a la pàgina d’acceptació ni a la secció d’invitar de Comunitat.
