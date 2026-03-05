# Proposal: Fix – A l'inici no mostra tots els llibres en "Llegint"

## Description

A la pantalla d'inici, la secció "Llegint ara" només mostra un llibre quan l'usuari té diversos llibres en estat "Llegint". Ha de mostrar tots els llibres en lectura, amb les mateixes estadístiques i funcionalitat per a cada un.

## Problema

- **Actual:** `books.find((b) => b.status === "reading")` retorna només el primer llibre.
- **Esperat:** Mostrar la fitxa de tots els llibres en estat "Llegint", amb progrés, ETA, input per actualitzar pàgines i gràfic setmanal.

## Què es fa

- Canviar de `find` a `filter` per obtenir tots els llibres en lectura.
- Renderitzar una targeta per cada llibre (o bloc equivalent) amb la mateixa informació: portada, títol, autor, barra de progrés, dies estimats, input per actualitzar pàgines, gràfic setmanal.

## Referència

- [Notion – Feature: A l'inici no mostra tots els llibres en Llegint](https://www.notion.so/miquelroset/Feature-A-l-inici-no-mostra-tots-els-llibres-en-Llegint-31a1492a704280c68637d11b32a58917)
