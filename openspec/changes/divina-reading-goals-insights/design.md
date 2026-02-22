# Design: Reading Goals & Insights

## Context

- L'app té perfil d'usuari, vista d'Inici (Dashboard), vista de llibre en lectura amb "pàgina actual" i progrés.
- No hi ha objectiu anual ni predicció d'acabament ni streak ni gràfics de progrés setmanal.
- Les dades de progrés es deriven de les actualitzacions de "pàgina actual" (i opcionalment dates d'actualització) emmagatzemades amb els llibres.

## Goals / Non-Goals

**Goals:**

- Objectiu anual configurable des del perfil; barra de progrés visual (llibres completats / objectiu).
- Algoritme de ritme: mitjana de pàgines/dia dels darrers 7 dies; predicció "acabaràs en X dies (data DD/MM)" al llibre en lectura.
- Daily streak: dies consecutius amb almenys una actualització de "pàgina actual"; icona al Dashboard; reinici si passa un dia sense activitat.
- Mini-chart de pàgines llegides en l'última setmana dins de la fitxa del llibre.
- Edge cases: no dividir per zero; no mostrar data absurdament llunyana; empty state motivador; tractar progrés negatiu (re-lectura); demanar pàgines totals si són 0; opcionalment reinici d'objectiu i arxiu en canvi d'any.

**Non-Goals:**

- Historial il·limitat d'actualitzacions (suficient amb 7 dies per ritme i streak basat en activitat diària).
- Canvi d'any complet (arxiu 2025, reinici objectiu) es pot deixar per una iteració posterior.

## Decisions

### Decision 1: Font de dades per ritme i streak

- **Què:** Utilitzar les dades existents de llibres (pàgina actual, dates d'inici/actualització) i, si cal, timestamps d'actualització a Firestore o al client. El ritme es calcula amb les diferències de "pàgina actual" en els darrers 7 dies; el streak amb dies consecutius amb almenys una actualització.
- **Per què:** Reutilitzar el model actual sense introduir noves col·leccions per ara; si no hi ha històric granular, el streak pot basar-se en "dies amb almenys un llibre amb pàgina actual actualitzada" o en un registre lleuger d'activitat diària (segons el que existeixi).

### Decision 2: Divisor zero i progrés negatiu

- **Què:** Si la mitjana de pàgines/dia dels últims 7 dies és ≤ 0, no mostrar data de finalització; mostrar empty state: "Llegeix unes quantes pàgines per calcular el teu ritme!". Si l'usuari redueix la pàgina actual (re-lectura), ignorar valors negatius en el càlcul del ritme (mantenir mitjana prèvia o 0 fins a la següent actualització positiva).
- **Per què:** Evitar errors o dates absurdas (p. ex. "any 2099") i mantenir confiança en la UI.

### Decision 3: Llibres sense pàgines totals

- **Què:** Si un llibre està "Llegint" però té 0 pàgines totals, no activar la predicció d'acabament (ni el mini-chart si depèn de total); demanar o recordar a l'usuari que introdueixi les pàgines totals abans d'activar els insights.
- **Per què:** Evitar divisions per zero i visualitzacions sense sentit.

### Decision 4: Objectiu anual i reinici d'any

- **Què:** Emmagatzemar l'objectiu anual per usuari (perfil); opcionalment, a mitjanit del 31/12 reiniciar el comptador d'objectiu i arxivar l'historial anterior (implementació futura si es desitja).
- **Per què:** La proposta Notion menciona el canvi d'any; es pot implementar en una segona fase.
