# Design: Bug – Icones de l'inici del mateix color

## Decisió

- Els `StatCard` de la pàgina d'inici han d'utilitzar tots la prop `color="primary"` per a la icona, per mantenir la coherència amb el bloc Ratxa i la resta de blocs que ja fan servir primary.
- Canvi únic: a `HomeView.jsx`, als dos `StatCard` de "Gènere preferit" i "Total llibres", canviar `color="slate"` per `color="primary"`.
