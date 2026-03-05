# Tasks: Bug – Mala visualització en mòbil (formulari invitació)

## 1. Evitar scroll horitzontal a l’app

- [x] 1.1 Afegir `overflow-x-hidden` al contenidor principal del contingut a `App.jsx` (el div que embolcalla les rutes, p. ex. el que té `max-w-4xl mx-auto px-6 py-8`) per evitar scroll horitzontal global.

## 2. InviteAcceptView responsive

- [x] 2.1 Assegurar que el contenidor de la vista (i la card) no desbordin en mòbil: contenidor amb `w-full max-w-md mx-auto px-4` i contingut amb `min-w-0` on cal (flex children). Card amb `overflow-hidden` o sense min-width que superi el pare.
- [x] 2.2 Botons Acceptar/Rebutjar: permetre wrap si cal (`flex-wrap`) i assegurar que no tenen amplada mínima excessiva.

## 3. CommunityView – formulari d’invitació

- [x] 3.1 Al bloc “Invitar per correu” (input email + botó Convidar), fer que l’input pugui encongir-se en pantalles estretes: canviar `min-w-[180px]` a `min-w-0` i assegurar que el contenidor flex no desborda (p. ex. `min-w-0` al wrapper si cal).

## 4. Verificació

- [x] 4.1 Revisar en viewport estret (320–375px) que no hi ha scroll horitzontal a /community/invite/:id ni a la secció Comunitat amb el formulari d’invitació.
