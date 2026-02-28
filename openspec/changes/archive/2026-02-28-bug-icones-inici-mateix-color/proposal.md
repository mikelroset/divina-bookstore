# Proposal: Bug – Icones de l'inici del mateix color

## Why

Les icones dels blocs de la pantalla d'inici no són del mateix color: les de "Gènere preferit" i "Total llibres" es mostren en negre (slate), mentre que la resta (p. ex. Ratxa) fan servir el verd de la marca (primary). Això trenca la consistència visual acordada als blocs d'inici.

**Impacte:** Baix. Només afecta la coherència visual a la pàgina d'inici.

## What

- Unificar el color de totes les icones dels blocs de la pantalla d'inici al verd primary (el mateix que el bloc Ratxa).
- Blocs afectats: Gènere preferit, Total llibres (actualment amb `color="slate"`; han de passar a `color="primary"`).

## Resultat esperat

- Totes les icones dels blocs de la pàgina d'inici (Ratxa, Aquest mes, Gènere preferit, Total llibres, etc.) han de ser del mateix color verd (primary).

## Entorn

- Plataforma: Web
- URL: https://divina-bookstore.vercel.app/
