# Proposal: Gestió de comunitat

## Why

L'objectiu és que l'aplicació passi de ser d'una sola comunitat a un model **multicomunitat**, de manera que:

- Cada usuari pugui pertànyer a una o més comunitats.
- Les estadístiques, rànquings i experiència social es contextualitzin segons la comunitat seleccionada.
- Es mantinguin intactes les dades i estadístiques personals de cada usuari, independentment de les comunitats.

## Objectius

- Permetre crear, gestionar i, si cal, dissoldre comunitats.
- Definir un model de rols i permisos clar per escalar la moderació.
- Introduir un flux d'invitacions (i opcionalment sol·licituds d'accés) per a comunitats privades.

## Fora d'abast (primera iteració)

- Xat dins la comunitat.
- Subcomunitats o canals.
- Moderació avançada (reporting, filtres automàtics, etc.).

## What

- **Migració inicial (AC1):** Comunitat per defecte "Homenatge a la Divina" (privada); tots els usuaris registrats n'formen part; usuari `6g9VBE4EagT5yk8PuSZRHZGwAuH2` com a Owner/Administrador; sense regressió en dades personals.
- **Múltiples comunitats (AC2):** Selector de comunitat a la pantalla de comunitat; comunitat activa; estadístiques i context segons la comunitat seleccionada.
- **Creació (AC3), rols (AC4), membres i invitacions (AC5), dissolució (AC6), UX (AC7):** segons criteris d'acceptació i decisions de disseny del Notion.

Implementació en fases: primera fase cobreix AC1 i suport mínim per a AC2 (model de dades, comunitat per defecte, selector amb una comunitat).
