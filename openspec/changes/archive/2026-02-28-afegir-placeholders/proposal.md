# Proposal: Feature – Afegir placeholders

## Description

L’objectiu és afegir placeholders per les portades dels llibres i per l’avatar de l’usuari quan no consten, per millorar l’experiència visual i evitar buits o blocs trencats.

## User Story

Com a usuari que navega per la comunitat, vull veure placeholders consistents quan falti la portada d’un llibre o l’avatar d’un usuari, per tal de mantenir una experiència visual cuidada i entenedora, fins i tot amb dades incompletes.

## What

- **Placeholder de portada:** quan un llibre no té portada (URL nul·la, error de càrrega o asset no existent), mostrar un placeholder amb la mateixa mida i ratio que una portada real; no desplaçar el layout; colors neutres coherents amb la marca.
- **Placeholder d’avatar:** quan un usuari no té avatar (o falla la càrrega), mostrar placeholder amb la mateixa mida; incloure inicials si hi ha nom d’usuari; icona genèrica si no n’hi ha.
- **Fallback i accessibilitat:** gestionar errors d’imatge amb fallback a placeholder; `alt` apropiat (“Portada de {títol}” o “Portada no disponible”; “Avatar de {nom}” o “Avatar no disponible”).
- **No regressió visual:** mantenir alineacions, espaiats i mides de targetes.

## Referència

- [Notion – Feature: Afegir placeholders](https://www.notion.so/miquelroset/Feature-Afegir-placeholders-31a1492a704280f18a1cdd1ef544c000)
