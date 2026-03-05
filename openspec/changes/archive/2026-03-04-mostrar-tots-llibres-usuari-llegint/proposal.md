# Proposal: Feature – Mostrar tots els llibres que un usuari està llegint

## Description

L’objectiu és que a la pàgina de comunitat no només es mostri un llibre per usuari sinó **tots** els llibres que cada membre de la comunitat té en estat “Llegint / In progress”.

## User Story

Com a membre d’una comunitat de lectura, vull veure tots els llibres que cada persona està llegint dins la comunitat, per tal d’entendre millor els seus interessos, recomanar lectures i seguir l’activitat real de la comunitat.

## What

- A la pàgina de comunitat, per a cada usuari (membre) es mostra una **llista** amb tots els llibres que té amb estat “Llegint”.
- Cada llibre mostra com a mínim: títol, autor (si existeix), coberta (si existeix), progrés actual (pàgines o percentatge).
- Ordenació per activitat: el llibre amb activitat més recent primer; la resta en ordre descendent d’activitat (o alfabètic per títol si no hi ha camp d’activitat).
- Si un usuari no té cap llibre “Llegint”, el seu mòdul apareix amb estat buit: “Ara mateix no està llegint cap llibre.”
- Consistència: només es consideren “en lectura” els llibres amb estat “Llegint”; progrés incoherent (negatiu o > 100%) es mostra com “—” o 0 sense trencar la UI.
- Rendiment: la pàgina ha de carregar sense degradació perceptible amb fins a ~50 usuaris i fins a ~10 llibres en lectura per usuari.

## Referència

- [Notion – Feature: Mostrar tots els llibres que un usuari està llegint](https://www.notion.so/miquelroset/Feature-Mostrar-tots-els-llibres-que-un-usuari-est-llegint-31a1492a704280e988a3fa0a213d5d94)
