# Proposal: Enviar correu si no existeix l'usuari

## Why

Quan un usuari convida algú per correu a una comunitat, si el sistema no troba cap compte amb aquell email, cal enviar automàticament un correu d'invitació perquè la persona pugui crear-se un compte i acceptar la invitació. Això redueix la fricció i permet incorporar nous membres sense que hagin de tenir compte prèvi.

**User story:** Com a membre o administrador d’una comunitat, vull convidar algú per correu encara que no tingui compte, per tal d’incorporar noves persones sense fricció.

## What

- **Detecció d’usuari inexistent:** Si l’email introduït no té compte registrat, el sistema inicia el flux d’invitació per email (la comprovació ha de fer-se al backend per no revelar si l’email existeix).
- **Enviament de correu d’invitació:** El sistema envia un correu amb el nom de la comunitat, una crida a l’acció clara i un enllaç únic amb token i caducitat. Màxim un correu per invitació dins del període d’idempotència.
- **UI neutral (AC3):** Missatge del tipus “Hem enviat la invitació si aquest correu és vàlid.” sense revelar si l’email existeix o no.
- **Idempotència (AC4):** Mateix email + mateixa comunitat en un període curt (p. ex. 10 min): no reenviar segon correu; retornar el mateix missatge d’èxit.
- **Token d’invitació (AC5):** Enllaç amb token no endevinable, associat a (email, comunitat, estat), amb caducitat (p. ex. 7 dies). Token invàlid/caducat → pantalla d’error amb “Tornar a demanar invitació”.
- **Acceptació (AC6):** En acceptar, només es permet si l’email del compte coincideix amb l’email del token. Si no té compte, guiar cap al registre (preomplir email).
- **Traçabilitat (AC7):** Registre d’esdeveniments (invitació creada, correu enviat, acceptada, error); sense token en clar als logs.

L’enviament real del correu requereix un backend (Cloud Function o extensió Firebase) per seguretat i per no exposar claus. Una primera fase implementa tot el que es pot al client i a Firestore (missatge neutral, idempotència, token, verificació d’email en acceptar); una segona fase afegeix la funció que envia el correu.

## Referència

- [Notion – Feature: Enviar correu si no existeix l’usuari](https://www.notion.so/miquelroset/Feature-Enviar-correu-si-no-existeix-l-usuari-3161492a70428073bd00da5696b8e208)
