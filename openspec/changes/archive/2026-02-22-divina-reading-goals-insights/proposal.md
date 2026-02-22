# Proposal: Reading Goals & Insights

## Why

L'objectiu és que l'usuari senti progressió. Si saps que et queden 4 dies per acabar un llibre al ritme actual, és més probable que llegeixis una estona més cada nit per complir la "fita".

## User Story

Com a lector motivat de DivinaBookStore,
vull establir objectius de lectura anuals i rebre prediccions de finalització basades en el meu ritme actual,
per tal de mantenir el meu hàbit de lectura actiu i sentir una satisfacció visual en veure el meu progrés.

## What Changes

- **Objectiu anual:** L'usuari pot introduir un número de llibres objectiu per a l'any des del perfil; es mostra una barra de progrés (llibres finalitzats / objectiu).
- **Predicció de finalització (pace):** Càlcul del ritme mitjà (pàgines/dia) dels darrers 7 dies; a la pantalla del llibre en lectura es mostra "Al teu ritme actual, acabaràs aquest llibre en X dies (Data estimada: DD/MM)".
- **Daily streak:** Icona de "foc" al Dashboard; el streak augmenta cada dia que l'usuari actualitzi la "pàgina actual" en qualsevol llibre; un dia sense activitat reinicia el comptador.
- **Mini-chart de progrés:** Dins de la fitxa del llibre, un gràfic senzill de l'evolució de pàgines de l'última setmana.
- **Edge cases:** Tractament de divisió per zero i progrés negatiu (re-lectura); missatge motivador quan no hi ha dades; protecció per llibres sense pàgines totals; reinici d'objectiu anual i arxiu d'historial en canvi d'any (opcional).

## Capabilities

### New Capabilities

- **reading-goals-insights:** Objectiu anual, barra de progrés, ritme de lectura (7 dies), predicció d’acabament, streak diari, mini-chart setmanal; empty states i protecció davant d’inactivitat o dades invàlides.

## Impact

- **Perfil:** Camp per objectiu anual (número); barra de progrés (objectiu vs completats).
- **Dashboard / Inici:** Icona i valor de streak; possible resum d’objectiu.
- **Vista llibre (Llegint):** Text dinàmic d’ETA; mini-chart pàgines última setmana.
- **Dades:** Càlcul de ritme des d’actualitzacions de "pàgina actual" (i dates) dels últims 7 dies; streak basat en dies consecutius amb activitat.
- **Edge cases:** No mostrar data de finalització si mitjana ≤ 0; missatge "Llegeix unes quantes pàgines per calcular el teu ritme!"; ignorar progrés negatiu en el càlcul; demanar pàgines totals abans d’activar insights si el llibre en té 0.
