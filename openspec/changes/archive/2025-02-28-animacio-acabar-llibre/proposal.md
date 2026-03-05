# Proposal: Animació a l'acabar un llibre

## Why

Quan un usuari actualitza el progrés d'un llibre i el valor resultant és exactament igual al nombre total de pàgines, l'app ha de mostrar una animació de celebració (confeti) i un missatge temporal d'enhorabona, per reforçar la sensació d'èxit i tancar el cicle de lectura d'una manera memorable, sense interrompre el flux de l'usuari.

## User Story

Com a lector/a que fa seguiment del progrés, vull veure una celebració quan acabo un llibre, per tal de sentir reconeixement i motivació per continuar llegint.

## What

- **AC1:** La celebració es dispara quan el progrés arriba al 100% (currentPage === totalPages).
- **AC2:** No es dispara si el progrés final < total.
- **AC3:** No es dispara si el progrés supera el total.
- **AC4:** Missatge curt i positiu que desapareix automàticament; exemples rotats: "Enhorabona! Has acabat el llibre.", "Brutal! Llibre completat.", "Objectiu aconseguit. Ben fet!"
- **AC5:** La celebració no bloqueja la UI; l'usuari pot continuar interactuant.
- **AC6:** Només es mostra en la transició de <100% a 100%; no quan es torna a guardar el mateix valor.
- **Edge cases:** Total pages invàlid (null, 0, negatiu) → no celebrar; progrés > total → no celebrar; idempotència: màxim un cop per transició.

## Referència

- [Notion – Feature: Animació a l'acabar un llibre](https://www.notion.so/miquelroset/Feature-Animaci-a-l-acabar-un-llibre-31a1492a70428066a9ffc3ad2b1243a2)
