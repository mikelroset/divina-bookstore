# Proposal: Bug – Mala visualització en mòbil del formulari d'invitació a comunitat

## Why

En obrir una invitació per unir-se a una comunitat des del mòbil, el popup / modal d’acceptació queda desmaquetat i apareix un scroll horitzontal. Això dificulta l’acceptació d’invitacions des de mòbil i empitjora la primera impressió.

**Impacte:** Mitjà.

## What

- El modal (i les pantalles del flux d’acceptació d’invitació) han de ser responsive i adaptar-se a pantalles de mòbil.
- Sense scroll horitzontal: tot el contingut dins de l’amplada visible (viewport).
- Tant la pàgina d’acceptació d’invitació (`/community/invite/:inviteId`) com qualsevol secció relacionada (formulari d’invitar des de Comunitat) han de respectar l’amplada de la pantalla.

## Resultat esperat

- El modal i les pantalles del flux d’acceptació estan ben maquetats tant en mòbil com en desktop, sense scroll horitzontal.

## Passos per reproduir

1. Iniciar sessió. Crear una comunitat de prova. Enviar una invitació.
2. Des d’un mòbil, obrir el correu del convidat, clicar acceptar invitació.
3. Observar el modal/pantalles del flux.

## Referència

- [Notion – Bug: Mala visualització en mòbil del formulari d'invitació a comunitat](https://www.notion.so/miquelroset/Bug-Mala-visualitzaci-en-m-bil-del-formulari-d-invitaci-a-comunitat-3191492a704280439b34d46cb4700630)
