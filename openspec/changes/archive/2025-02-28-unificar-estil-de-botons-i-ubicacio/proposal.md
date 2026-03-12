# Proposal: Unificar estil de botons i ubicació

## Why

Millorar la consistència visual de l'aplicació, especialment pel que fa a botons i accions principals. Actualment existeixen diverses inconsistències:
- El color verd dels botons no és sempre el mateix (primary-500 vs primary-600)
- Alguns botons tenen estils diferents (rounded-xl vs rounded-lg, padding variable)
- Els botons d'acció principals de Biblioteca, Comunitat i Ressenyes no coincideixen ni en ubicació ni en estil visual

Això genera una experiència menys previsible i menys professional. Unificar el sistema de botons fa l'experiència més consistent i més fàcil d'utilitzar.

## What

1. **Definir un estil únic de botó primari**: mateix color verd, estil, padding i radius.
2. **Unificar ubicació del botó principal**: a Biblioteca, Comunitat i Ressenyes, el botó d'acció ha de tenir la mateixa ubicació (cap a la dreta del títol de la secció).
3. **Crear variants de botons reutilitzables**: PrimaryButton, SecondaryButton, GhostButton.
4. **Reutilització en tota l'app**: actualitzar els botons existents per utilitzar aquests components.

## Referència

- [Notion – Feature: Unificar estil de botons i ubicació](https://www.notion.so/miquelroset/Feature-Unificar-estil-de-botons-i-ubicaci-31d1492a70428068a566e3bc14d8d2e6)
