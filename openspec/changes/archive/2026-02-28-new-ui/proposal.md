# Proposal: New UI — Sistema de temes (Light / Dark / System)

## Why

L'app actual utilitza un estil dominat pel color verd i colors hardcoded, amb poca flexibilitat per adaptar-se a les preferències de l'usuari (dark mode, preferència del sistema). Es vol modernitzar el look & feel, millorar la llegibilitat i permetre mode dark perquè l'experiència sigui més agradable i accessible.

**Impacte:** Alt — afecta tota la interfície.

## What

Implementar un nou sistema de temes visuals que substitueixi l'estil actual:

- **Light theme** i **Dark theme** amb design tokens coherents
- **System mode**: l'app segueix automàticament la preferència del sistema operatiu (`prefers-color-scheme`)
- **Selector de tema** al header perquè l'usuari triï (Light / Dark / System)
- **Persistència** de la preferència en `localStorage` (key `app-theme`)
- **Refactorització** de tots els components per utilitzar design tokens en lloc de colors hardcoded

## Resultat esperat

- Existeixen light theme i dark theme
- El selector de tema funciona i la preferència es guarda
- L'app segueix el tema del sistema quan s'escull "System"
- Tots els components utilitzen design tokens; no hi ha colors hardcoded
- El canvi de tema és instantani sense refrescar la pàgina

## Referència

- [Notion – New UI](https://www.notion.so/miquelroset/New-UI-3211492a70428029983dcb3517656ba4)
