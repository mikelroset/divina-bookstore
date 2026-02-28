# Proposal: Facilitar l'actualització de pàgines dels llibres en "Llegint"

## Why

L'objectiu és facilitar que l'usuari actualitzi ràpidament les pàgines llegides dels llibres que té en estat "Llegint", directament des de la pantalla d'inici, sense haver d'obrir el formulari complet d'edició.

## User story

Com a lector/a,
vull poder actualitzar les pàgines llegides dels llibres que estic llegint en pocs segons,
per tal de registrar el meu progrés sense fricció.

## What

- Al bloc "Llegint ara" de la pantalla d'inici, afegir per al llibre en lectura:
  - Un camp d'entrada amb el valor actual de pàgines llegides (pre-omplert).
  - Un botó per desar el nou valor.
- En desar, el valor queda guardat (persistència) i es reflecteix a l'instant en la UI.
- Validacions: entrada numèrica; no permetre valor menor que el progrés actual ni superior al total de pàgines (si existeix); entrada buida o no numèrica mostra error.
- A la versió escriptori, el layout del bloc ha de ser net sense espais buits visibles.

## Edge cases

- No hi ha llibres en "Llegint": el bloc no es mostra o es mostra un estat buit clar.
- Entrada buida o no numèrica: no desar, missatge d'error contextual.
- Valor menor que el progrés actual: no desar, indicar el motiu.
- Valor superior al total de pàgines (si existeix): no desar, indicar el límit.
- Total de pàgines desconegut: es permet desar.
- Doble clic / múltiples desaments: evitar duplicats, mantenir l'últim valor coherent.
- Error de xarxa o persistència: mostrar error i conservar el valor anterior a la UI.
