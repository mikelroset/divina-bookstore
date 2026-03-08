# Proposal: Bug – Error en el rànquing (només es mostren els punts de l'usuari loguejat)

## Why

El rànquing a la pantalla de Comunitat només mostra els punts de l'usuari loguejat, en lloc dels punts de tots els membres de la comunitat seleccionada. Això trenca l'objectiu del rànquing comunitari i fa que la funcionalitat sigui pràcticament inútil.

**Impacte:** Alt. Afecta directament el valor de la gamificació i la motivació col·lectiva dins de la comunitat.

## What

- Corregir el bug perquè el rànquing mostri els punts de **tots** els membres actius de la comunitat seleccionada.
- La causa raonable: Firestore només permet llegir `users/{uid}/prefs/gamification` al propi usuari; el client no pot llegir les dades de gamificació dels altres membres.
- Solució: delegar el càlcul del rànquing a una Cloud Function que, amb privilegis d'admin, llegeixi les dades de gamificació de tots els membres i retorni el rànquing ordenat.

## Resultat esperat

- Iniciar sessió → Comunitat → es veuen els punts de tots els membres de la comunitat seleccionada, ordenats per punts (setmana/mes/total segons el filtre).
- Si l'usuari ha desactivat "Apareixer al rànquing", no apareix al llistat (showInLeaderboard === false).

## Entorn

- Plataforma: Web
- URL: https://divina-bookstore.vercel.app/community

## Referència

- [Notion – Bug Error en el rànquing](https://www.notion.so/miquelroset/Bug-Error-en-el-r-nquing-31d1492a704280c2bbabcf81beb99ff2)
