# Design: Creu tancament encoratjaments

## Problema actual

A `HomeView.jsx`, els encoratjaments es renderitzen com a llista (`ul`/`li`) i les creus de tancament es dibuixen en un segon `map` amb posicionament absolut i un `top` calculat:

```js
style={{ top: `calc(1.25rem + ${index} * 2rem)` }}
```

Aquest càlcul és aproximat i no s'adapta bé a la mida real dels elements (títol, padding, `space-y-2`, variabilitat del text), provocant desalineació.

## Solució

Posar el botó de tancament (X) **dins de cada `li`**, amb `flex items-center justify-between`, de manera que cada creu quedi naturalment alineada amb el text del seu encoratjament, sense posicionament absolut.

Estructura proposada per cada item:

```
<li className="flex items-center justify-between gap-2 py-2 ...">
  <span>text encoratjament</span>
  <button aria-label="Tancar">X</button>
</li>
```

## Coherència

El mateix patró s'aplica a la secció "Llibres llegits a la comunitat" (`bookCompletedNotifs`), que té el mateix bug. S'unifica la solució a ambdues llistes.
