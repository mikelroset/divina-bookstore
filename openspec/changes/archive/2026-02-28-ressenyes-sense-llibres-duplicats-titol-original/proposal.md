# Proposal: Ressenyes sense llibres duplicats (títol original)

## Why

L'objectiu és evitar duplicitats de llibres en el sistema de ressenyes i assegurar que totes les ressenyes d'un mateix llibre es mostrin agrupades.

Actualment, diferents usuaris podrien crear ressenyes del mateix llibre utilitzant:
- traduccions del títol (ex. "The Little Prince" vs "El Petit Príncep")
- petites variacions en el nom (ex. "Harry Potter & the Philosopher's Stone" vs "Harry Potter and the Philosopher's Stone")
- errors tipogràfics

Això provoca que el mateix llibre aparegui múltiples vegades al sistema i que les ressenyes quedin fragmentades.

## What

- Cada llibre ha de tenir un **títol original obligatori** (ex. títol en l'idioma original de publicació).
- El sistema utilitza **títol original + autor** (normalitzats) per identificar de forma unívoca el llibre.
- Quan un usuari crea una ressenya:
  1. El sistema comprova si ja existeix un llibre al catàleg amb el mateix títol original i autor (comparació normalitzada).
  2. Si existeix: la nova ressenya s'associa al llibre existent.
  3. Si no existeix: es crea una nova entrada al catàleg.
- D'aquesta manera, totes les ressenyes d'un mateix llibre queden agrupades sota un únic llibre.

## Referència

- [Notion – Ressenyes sense llibres duplicats](https://www.notion.so/miquelroset/Ressenyes-sense-llibres-duplicats-t-tol-original-3211492a7042804688dce1cdf103ab4c)
