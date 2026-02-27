# Design: Estandaritzar UI dels blocs de l'inici

## Context

- La pàgina d'Inici (HomeView) té diversos blocs: estadístiques (Ratxa, Aquest mes, Gènere preferit, Total llibres), Objectiu anual, Progrés global de lectura, Llegint ara. El bloc de Ratxa ja té icona (Flame) via StatCard.
- No tots els blocs tenen icona; la tipografia i capitalització dels títols poden variar.

## Decisions

1. **Icones:** Reutilitzar el component StatCard amb prop `icon` per a totes les estadístiques que encara no en tenen. Triar una icona adequada per a cada bloc (Aquest mes, Gènere preferit, Total llibres, Objectiu anual). Per als blocs que no són StatCard (Progrés global de lectura, Llegint ara, Objectiu anual com a secció), afegir una icona al costat del títol de la secció amb el mateix estil que la Ratxa.
2. **Tipografia i capitalització:** Unificar els títols: mateixa classe/estil, només primera lletra en majúscula (ex. "Total llibres", "Progrés global de lectura", "Llegint ara").
3. **Referència visual:** El bloc de Ratxa (StatCard amb icona Flame) és la referència; la resta ha de seguir el mateix patró (icona + títol amb tipografia unificada).
