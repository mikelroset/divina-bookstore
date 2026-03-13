# Proposal: Bug - Progrés total de lectura no funciona amb més d'un llibre en "llegint"

## Why

Quan un membre està llegint més d'un llibre a l'hora, el progrés total de lectura es mostra a 0% a la pantalla d'inici. L'usuari no pot veure correctament què ha avançat en conjunt dels seus llibres en curs.

## What

El progrés total ha de calcular-se sumant:
- **Pàgines totals**: suma de les pàgines de tots els llibres amb estat "llegint"
- **Pàgines llegides**: suma de les pàgines actuals (`currentPage`) de tots els llibres amb estat "llegint"
- **Percentatge**: (pàgines llegides / pàgines totals) × 100

Això permet reflectir el progrés real quan l'usuari té diversos llibres oberts simultàniament.

## Impacte

Alt: afecta la visibilitat del progrés i la motivació de l'usuari.

## Referència

- [Notion – Bug: Progrés total de lectura no funciona amb més d'un llibre en "llegint"](https://www.notion.so/miquelroset/Bug-Progr-s-total-de-lectura-no-funciona-amb-m-s-d-un-llibre-en-llegint-3221492a704280f4aa6ccb31bbbb9aa0)
