# Proposal: Bug – Nom incorrecte dels usuaris a la comunitat "Homenatge a la Divina"

## Why

A la pàgina de comunitat (secció Comunitat), en lloc dels correus electrònics dels usuaris es mostren els **identificadors (uid)** de Firebase. Això dificulta identificar qui és qui i no és el comportament esperat.

**Impacte:** Mitjà. Afecta la usabilitat i la claredat de la llista de membres.

## What

- La llista de membres de la comunitat ha de mostrar els **correus electrònics** dels usuaris (o un identificador llegible com el correu), no els `uid`.
- Mantenir el rol (Propietari / Participant) al costat del correu.

## Resultat esperat

- **Actual:** 6g9VBE4EagT5yk8PuSZRHZGwAuH2 (Propietari), FOCftv6RaEZEFzk0hbpO59w87VG3 (Participant), etc.
- **Esperat:** mikelroset@gmail.com (Propietari), isaacroset@gmail.com (Participant), kyra24584@gmail.com (Participant), etc.

## Passos per reproduir

1. Iniciar sessió.
2. Formar part de la comunitat "Homenatge a la Divina".
3. Anar a la secció Comunitat.

## Entorn

- URL: https://divina-bookstore.vercel.app/community
- Plataforma: Web. Navegador / OS: qualsevol.

## Referència

- [Notion – Bug: Nom incorrecte dels usuaris a la comunitat](https://www.notion.so/miquelroset/Bug-Nom-incorrecte-dels-usuaris-a-la-comunitat-de-Homenatge-a-la-Divina-3191492a70428017af02e957c5b3ea3f)
