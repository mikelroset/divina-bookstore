# Tasks: Enviar correu si no existeix l'usuari (Fase 1)

## 1. Model d'invitació: token i idempotència

- [x] 1.1 Afegir a la invitació (Firestore): `inviteToken` (string únic, p. ex. crypto.randomUUID() o base64url) i `lastEmailSentAt` (timestamp opcional). En `createOrResendInvite`, generar i desar el token si és una invitació nova; si la invitació ja existeix i és pending, mantenir el mateix token i no reenviar si `lastEmailSentAt` és dins dels últims 10 min (retornar èxit sense modificar lastEmailSentAt per ara; el backend farà l'enviament).
- [x] 1.2 Validar email al client (no buit, format vàlid); si no és vàlid, no cridar el servei i mostrar "Introdueix un correu vàlid."

## 2. UI: missatge neutral (AC3)

- [x] 2.1 Després de convidar amb èxit, mostrar missatge neutral: "Hem enviat la invitació si aquest correu és vàlid." (en lloc de qualsevol missatge que reveli si l'email existeix).
- [x] 2.2 En cas d'error de xarxa o de Firestore, mostrar un missatge d'error genèric; no revelar detalls que indiquin existència d'email.

## 3. Idempotència 10 min (AC4)

- [x] 3.1 En `createOrResendInvite`: si ja existeix un document pending per (communityId, email) i té `lastEmailSentAt` amb menys de 10 minuts, no actualitzar el document (o actualitzar només updatedAt) i retornar èxit. El client rep el mateix resultat i mostra el missatge neutral.

## 4. Acceptació amb verificació d'email (AC6)

- [x] 4.1 En `acceptInvite(inviteId, userId, profile)`: abans d'afegir l'usuari a la comunitat, obtenir l'email de l'usuari (el caller ha de passar-lo, p. ex. `currentUser.email`). Comparar amb `invite.email`; si no coincideix, llançar error "Aquest enllaç és per a un altre correu." i no modificar la invitació ni la comunitat.
- [x] 4.2 A la UI d'acceptació d'invitacions (CommunityView), en cridar `acceptInvite`, passar l'email de l'usuari loguejat; si el servei retorna l'error d'email no coincident, mostrar el missatge a l'usuari.

## 5. Ruta i enllaç d'invitació (AC5 parcial)

- [x] 5.1 Suportar ruta d'acceptació per enllaç (p. ex. `/community/invite/:inviteId` amb query `token=...`) que: (a) si no hi ha sessió, redirigeixi a login/registre (podem preomplir email des de la invitació si es pot llegir sense auth); (b) si hi ha sessió, validi token i email i cridi acceptInvite. Si el token és invàlid o la invitació caducada, mostrar pantalla d'error amb "Tornar a demanar invitació".
- [x] 5.2 Construir enllaç d'invitació (per quan el backend enviï el correu): base URL + ruta + inviteId + token. Documentar al README o al design que el correu ha d’incloure aquest enllaç.

## 6. Verificació

- [ ] 6.1 Comprovar que en convidar es mostra el missatge neutral i que no es revela si l'email existeix.
- [ ] 6.2 Comprovar que acceptar amb un altre email mostra l'error i no afegeix a la comunitat.
