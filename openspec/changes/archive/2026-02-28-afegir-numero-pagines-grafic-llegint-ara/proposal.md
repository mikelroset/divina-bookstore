# Proposal: Afegir número de pàgines al gràfic de "Llegint ara"

## Why

L'objectiu és mostrar el nombre de pàgines llegides dins el gràfic de "Llegint ara", perquè la persona usuària entengui millor el progrés real i el ritme de lectura d'un cop d'ull. Actualment el gràfic només reflecteix el progrés (o un valor agregat) sense explicitar el volum de lectura en pàgines.

- Millora la comprensió del gràfic sense haver d'anar a detalls.
- Dona més context per a comparacions entre dies.
- Reforça la sensació de progrés (motivació).

## User story

Com a persona que està llegint un llibre,
vull veure quantes pàgines he llegit (per dia) al gràfic de "Llegint ara",
per tal d'entendre el meu ritme i el meu progrés de forma ràpida i clara.

## What

- El gràfic setmanal (mini-chart) del bloc "Llegint ara" ha de mostrar el **nombre de pàgines llegides per dia** (no només l'alçada proporcional).
- Cada barra ha de tenir una etiqueta visible amb el valor numèric (enter) de pàgines llegides aquell dia.
- Si hi ha diverses entrades el mateix dia, es mostra la suma de pàgines llegides aquell dia.
- Valors negatius (progrés inconsistent) es tracten com 0. Valors 0 es poden mostrar o omitir segons llegibilitat.
- Sense dades: estat buit coherent, sense etiquetes de pàgines.
- Format: número curt (ex. "12" o "12 pàg."), UI en català.
