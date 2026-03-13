# Proposal: Comprovació d'ISBN per evitar duplicitat

## Why

Actualment un usuari pot afegir el mateix llibre múltiples vegades a la seva biblioteca si introdueix les dades manualment, cosa que genera:
- duplicats dins la biblioteca
- confusió en el seguiment de lectura
- estadístiques incorrectes

## What

Implementar una validació basada en ISBN per evitar duplicats:
- El camp ISBN serà obligatori quan es crea un llibre
- Abans de desar, el sistema comprovarà si l'usuari ja té un llibre amb el mateix ISBN (normalitzat)
- Si existeix, no es crearà el llibre i es mostrarà un missatge d'error traduït
- La validació és per usuari: diversos usuaris poden tenir el mateix llibre; un usuari només pot tenir una entrada per ISBN

## Referència

- [Notion – Feature: Comprovació d'ISBN per evitar duplicitat](https://www.notion.so/miquelroset/Feature-Comprobaci-d-ISBN-per-evitar-duplicitat-31a1492a704280d0b177c1e2ed14b298)
