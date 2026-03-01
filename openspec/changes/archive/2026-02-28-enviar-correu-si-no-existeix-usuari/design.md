# Design: Enviar correu si no existeix l’usuari

## Context

- Les invitacions es guarden a `communityInvites` amb id `{communityId}_{email}`, camps: communityId, email, invitedByUserId, status, expiresAt, createdAt, updatedAt.
- Actualment no s’envia cap correu; l’usuari convidat ha d’estar ja registrat i rebrà la invitació només si inicia sessió i veu les invitacions pendents per email.
- Per no revelar si un email existeix, la comprovació i l’enviament han de fer-se al backend.

## Fase 1 (aquest canvi): Client + Firestore

- **AC3 Missatge neutral:** Després de cridar “Convidar”, mostrar sempre el mateix missatge d’èxit: “Hem enviat la invitació si aquest correu és vàlid.” (no revelar si l’email existeix ni si s’ha enviat correu).
- **AC4 Idempotència:** A la invitació, desar `lastEmailSentAt` (timestamp). En crear/re-enviar, si ja existeix una invitació pending amb `lastEmailSentAt` dins dels últims 10 minuts, no tornar a “enviar” (el backend, quan existegi, no enviarà segon correu) i retornar èxit. El client pot mostrar el mateix missatge neutral.
- **AC5 Token:** Generar un token únic (p. ex. `crypto.randomUUID()` o bytes aleatoris en base64url) i desar-lo a la invitació (`inviteToken`). L’enllaç d’invitació serà de la forma `/community/accept-invite?inviteId=...&token=...` (el token es valida al backend o, per acceptar, al client es compara amb el que hi ha a Firestore). Caducitat: ja tenim `expiresAt` a la invitació; el token és vàlid si la invitació és pending i `expiresAt > now`.
- **AC6 Acceptació amb verificació d’email:** En `acceptInvite(inviteId, userId, profile)`, abans d’afegir a la comunitat, obtenir l’email de l’usuari (Firebase Auth `currentUser.email`). Obtenir la invitació i comprovar que `invite.email === userEmail`. Si no coincideix, llançar error “Aquest enllaç és per a un altre correu.” i no afegir a la comunitat.
- **Ruta d’acceptació per enllaç:** Suportar ruta `/community/accept-invite?inviteId=...&token=...` (o similar) que, si l’usuari no està loguejat, el porti a login/registre (preomplint l’email de la invitació si és possible); un cop loguejat, cridar `acceptInvite` amb verificació d’email.
- **AC7 Traçabilitat:** Opcional en Fase 1: esdeveniments a consola o a una col·lecció `inviteEvents` (invitation_created, invitation_accepted, etc.) sense emmagatzemar el token en clar.

## Fase 2 (següent): Enviament de correu (backend)

- **Cloud Function (onCreate o callable):** En crear/actualitzar un document a `communityInvites` amb status pending, comprovar (server-side) si existeix usuari amb aquest email (Firebase Admin Auth). Si no existeix (o en qualsevol cas, segons producte), enviar correu amb enllaç d’invitació (template amb nom comunitat, CTA, enllaç amb token). Registrar `lastEmailSentAt` i no reenviar si < 10 min (idempotència).
- **Rate limiting:** A la funció, limitar nombre d’invitacions per usuari/IP per finestra de temps; retornar èxit neutral si s’ha superat el límit.
- **Seguretat:** No escriure el token en clar als logs; no revelar si l’email existeix a la API pública.

## Model de dades (Fase 1)

- **communityInvites/{inviteId}:**
  - Afegir: `inviteToken` (string, únic per invitació), `lastEmailSentAt` (timestamp opcional, per idempotència 10 min).
  - Mantenir: communityId, email, invitedByUserId, status, expiresAt, createdAt, updatedAt.

## Edge cases

- **Email invàlid o buit:** Validar al client; no crear invitació; mostrar “Introdueix un correu vàlid.”
- **Token caducat/invàlid:** A la pantalla d’acceptació, si la invitació no és vàlida o ha caducat, mostrar error i “Tornar a demanar invitació”.
- **Acceptació amb altre email:** Bloquejar i mostrar “Aquest enllaç és per a un altre correu.”
