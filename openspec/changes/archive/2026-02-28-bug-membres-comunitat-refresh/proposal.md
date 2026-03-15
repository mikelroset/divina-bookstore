# Proposal: Bug – Membres visibles d'una comunitat

## Problema

Quan un usuari canvia d'una comunitat a una altra, la llista de membres no es refresca correctament. Es mostren membres de la comunitat anterior juntament amb els de la nova.

## Abast

- Assegurar que la llista de membres sempre correspon a la comunitat activa.
- Resetejar l'estat (membres, lectors, leaderboard) en canviar de comunitat.
- Evitar dades solapades en canvis ràpids.
- Mostrar estat buit quan una comunitat no té membres.

## Referència

- [Notion – Bug: Membres visibles d'una comunitat](https://www.notion.so/miquelroset/Bug-Memebres-visibles-d-una-comunitat-3241492a7042801280d8d68906915769)
