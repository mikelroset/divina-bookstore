# Proposal: Bug – Comunitat mostra estadístiques d’usuaris que no formen part de la comunitat seleccionada

## Why

Quan l’usuari selecciona una comunitat (especialment una on només és ell mateix com a membre), la pantalla de comunitat mostra l’activitat i estadístiques de **tots** els usuaris de l’app, no només dels membres d’aquella comunitat. Això trenca l’expectativa de “comunitat” i exposa informació que no hauria de ser visible.

**Impacte:** Mitjà. Afecta la privacitat i la coherència de les dades mostrades segons la comunitat seleccionada.

## What

- Filtrar el llistat de “lectors de la comunitat” i totes les estadístiques derivades perquè **només** es mostrin usuaris que són **membres actius** de la comunitat activa (`activeCommunityId`).
- La font de dades de “qui llegeix què” segueix sent la col·lecció global `community` (estat de lectura per usuari). La filtració es fa per intersecció amb els membres de la comunitat obtinguts de `communities/{communityId}/members` (status actiu).

## Resultat esperat

- En triar una comunitat on només hi ets tu: només es veu el teu llibre/activitat i les estadístiques reflecteixen només tu (1 lector actiu, etc.).
- En triar una comunitat amb més membres: només es veuen els membres d’aquella comunitat i les estadístiques són coherents amb aquest conjunt.

## Entorn

- Plataforma: Web
- URL: https://divina-bookstore.vercel.app/community

## Referència

- [Notion – Bug Comunitat mostra estadístiques d’usuaris que no formen part de la comunitat seleccionada](https://www.notion.so/miquelroset/Bug-Comunitat-mostra-estad-stiques-d-usuaris-que-no-formen-part-de-la-comunitat-seleccionada-3161492a704280829e74d485e5e73080)
