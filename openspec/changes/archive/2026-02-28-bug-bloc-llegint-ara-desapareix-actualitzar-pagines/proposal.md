# Proposal: Bug – Quan s'actualitza el número de pàgines el bloc "Llegint ara" desapareix

## Why

Quan l'usuari actualitza el número de pàgines (total de pàgines) d'un llibre que té en estat "Llegint" des del formulari d'edició, el bloc "Llegint ara" desapareix de la pantalla d'inici. Això té impacte alt: es perd la visibilitat del progrés i pot semblar que el llibre s'ha eliminat o que s'ha perdut l'estat de lectura.

## What

El bloc "Llegint ara" ha de romandre visible després de guardar el canvi de pàgines. El llibre ha de continuar apareixent com a "llegint ara" i el total de pàgines actualitzat s'ha de veure correctament sense reiniciar l'estat.

Causa probable: en desar des del formulari d'edició, el payload enviat a `updateBook` pot no incloure tots els camps del llibre (p. ex. `status` o dades que no estan al formulari). Si el servei o el context reemplacen l'objecte sencer amb el retorn, es podrien perdre camps i el llibre deixaria de tenir `status === "reading"`, amb la qual cosa el bloc deixaria de mostrar-se.

## Resultat esperat

- Després d'editar el total de pàgines d'un llibre en "Llegint" i guardar, en tornar a la pantalla d'inici el bloc "Llegint ara" es manté visible.
- El llibre continua amb estat "llegint" i el total de pàgines actualitzat es reflecteix correctament.
