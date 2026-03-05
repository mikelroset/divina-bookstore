# Proposal: Feature – Cards independents per llibres Llegint a comunitat

## Description

L'objectiu és que cada llibre sigui una card independent. Ara mateix s'engloba dins d'una mateix card de l'usuari; es vol que siguin cards independents on es vegi cada vegada l'usuari, "està llegint", gènere, portada, títol, autor, pàgines llegides / pàgines totals, % progrés, dies llegint i botó d'encoratjar.

## User Story

Com a membre d'una comunitat de lectura, vull veure cada llibre en lectura com una card independent (amb la persona que el llegeix), per tal d'explorar millor l'activitat de la comunitat, comparar lectures i interactuar (encoratjar) de forma més ràpida.

## What

- A la pàgina de comunitat, cada llibre en estat "Llegint / In progress" es representa com una card independent.
- Un mateix usuari pot tenir múltiples cards (una per cada llibre en lectura).
- Cada card mostra: usuari (nom i avatar), "està llegint", portada, títol, autor, gènere, progrés, dies llegint i botó encoratjar.
- Ordenació per activitat més recent (per llibre).
- Guardrails: progrés invàlid → "—"; gènere inexistent → ometre; encoratjar falla → missatge d'error i reintentar.
- Rendiment: fins a 50 usuaris, 10 llibres/usuari (fins a 500 cards), sense degradació perceptible; lazy-load d'imatges si aplica.

## Referència

- [Notion – Feature: Cards independents per llibres Llegint a comunitat](https://www.notion.so/miquelroset/Feature-Cards-independents-per-llibres-Llegint-a-comunitat-31a1492a70428094a99fc4ed5424b5b3)
