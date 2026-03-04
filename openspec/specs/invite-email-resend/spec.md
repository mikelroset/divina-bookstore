# invite-email-resend

Spec de referència per a l’enviament d’invitacions per correu amb Resend (API `/api/send-invite`). Documenta la limitació en mode de proves i els passos per habilitar l’enviament a qualsevol destinatari quan es tingui un domini propi.

## Context

- L’app envia correus d’invitació a comunitat quan l’email convidat **no** té compte, mitjançant l’API Vercel `/api/send-invite`, que usa **Resend**.
- Variables d’entorn rellevants a Vercel: `RESEND_API_KEY`, `FROM_EMAIL`, `INVITE_BASE_URL`, `FIREBASE_SERVICE_ACCOUNT_JSON` (veure README).

## Problema: mode de proves de Resend

En comptes sense domini verificat (o usant el remitent de prova `onboarding@resend.dev`), Resend només permet enviar correus **a la mateixa adreça** que el compte de Resend. Enviar a un altre destinatari retorna error tipus:

> You can only send testing emails to your own email address (…). To send emails to other recipients, please verify a domain at resend.com/domains, and change the `from` address to an email using this domain.

- **Síntoma a l’app:** POST a `/api/send-invite` retorna 500; als logs de Vercel (Logs / Functions → send-invite) apareix el missatge anterior.
- **Implicació:** Per provar el flux sense domini, cal convidar amb el **mateix email** del compte Resend; la resta de destinataris fallaran fins a verificar un domini.

## Per què no serveix el domini de Vercel

- **divina-bookstore.vercel.app** (o qualsevol `*.vercel.app`) és el domini on es desplega l’**app**. Serveix per a `INVITE_BASE_URL` (enllaços d’acceptació).
- El **remitent** del correu (`FROM_EMAIL`) el verifica Resend afegint registres DNS (SPF, DKIM, etc.) al domini de la part dreta de la @. El domini `vercel.app` és de Vercel; no es poden afegir-hi registres DNS propis. Per tant **no** es pot verificar `@divina-bookstore.vercel.app` (ni cap `@*.vercel.app`) a Resend per enviar correu.

Conclusió: per enviar a qualsevol destinatari cal un **domini propi** (que es pugui configurar al registrador DNS) i verificar-lo a Resend.

## Requisits (resum)

- En **mode de proves** (sense domini verificat), l’enviament d’invitacions per correu SHALL només ser possible cap al mateix email del compte Resend; qualsevol altre destinatari SHALL resultar en error 500 amb el missatge de Resend als logs.
- Per **producció** (enviar a qualsevol), el projecte SHALL fer servir un domini verificat a Resend i `FROM_EMAIL` amb un correu d’eixe domini.

## Passos quan es tingui el domini a comprar

Quan es decideixi quin domini comprar (p. ex. `divina-bookstore.com` o similar):

1. **Comprar/tenir el domini** i accés al DNS (registrador o proveïdor que permeti afegir registres TXT/CNAME que indiqui Resend).
2. **Verificar el domini a Resend:** [resend.com/domains](https://resend.com/domains) → Add Domain → introduir el domini → afegir els registres DNS que mostri Resend (SPF, DKIM, etc.) al registrador del domini → esperar que Resend marqui el domini com verificat.
3. **Actualitzar `FROM_EMAIL` a Vercel:** posar un remitent amb el domini verificat, p. ex. `Divina Bookstore <noreply@divina-bookstore.com>` (o el subdomini que s’hagi verificat). No cal canviar codi; només la variable d’entorn.
4. **Redeploy** del projecte a Vercel perquè la nova variable tingui efecte.

Després d’això, `/api/send-invite` hauria d’acceptar qualsevol destinatari (subjecte a límits i polítiques de Resend).

## Referències

- README: secció “Invitacions per correu – Fase 2”, opció A (Vercel) i paràgraf “Si /api/send-invite retorna 500”.
- Resend: [resend.com/domains](https://resend.com/domains) per verificar domini.
- Logs: Vercel → projecte → Logs o Functions → send-invite, per veure l’error real en cas de 500.
