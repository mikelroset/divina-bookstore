# Tasks: Bug – Persistir l’objectiu anual

## 1. UX del camp d’objectiu anual

- [x] 1.1 Canviar el camp d’objectiu anual al perfil perquè permeti escriure sense el zero inicial: usar valor de tipus string (o controlat amb valor buit) mentre l’usuari escriu, i convertir a número només en desar (onBlur i/o debounce).
- [x] 1.2 Desar l’objectiu a Firestore en perdre el focus (onBlur) i/o amb debounce en escriure, i assegurar que el valor desat es reflecteix a la UI (p. ex. normalitzar a número després de desar).

## 2. Persistència i càrrega

- [x] 2.1 Comprovar que, en obrir el perfil, el valor d’objectiu anual es llegeix des de `users/{uid}/prefs` i es mostra al camp (no quedar sempre 0 si hi ha valor desat).
- [x] 2.2 Després de desar, en refrescar la pàgina o tancar sessió i tornar a entrar, el valor d’objectiu ha de continuar visible al perfil.

## 3. Verificació

- [x] 3.1 Reproduir els passos del bug report: login → Perfil → introduir 10 → comprovar que es desa i que no es mostra "010"; refrescar i comprovar que es manté 10.
