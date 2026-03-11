# Tasks: Ressenyes

## 1. Infraestructura

- [x] 1.1 Afegir ROUTES.REVIEWS i enllaç "Ressenyes" a BottomNav
- [x] 1.2 Crear reviewService (Firestore: col·lecció reviews, subcol·lecció likes; CRUD, paginació, like toggle amb transacció)
- [x] 1.3 Crear ReviewsView amb ruta a App.jsx

## 2. Llistat i paginació

- [x] 2.1 Mostrar llistat de ressenyes (títol, autor, membre, data, likes, botó like)
- [x] 2.2 Implementar paginació (10 per pàgina)
- [x] 2.3 Truncar resum a 250 caràcters amb "Llegir més" / desplegable

## 3. Cerca i filtres

- [x] 3.1 Camp de cerca (títol, autor, membre)
- [x] 3.2 Filtres per títol, autor, membre, data
- [x] 3.3 Missatge "No s'han trobat ressenyes amb aquests criteris" i botó netejar filtres

## 4. Likes

- [x] 4.1 Botó like amb estat Liked / no Liked
- [x] 4.2 Toggle like amb transacció Firestore (prevé duplicats)
- [x] 4.3 Debounce del botó per evitar spam

## 5. Publicació

- [x] 5.1 Formulari per publicar ressenya (només llibres completats)
- [x] 5.2 Validació: llibre completat, text obligatori
- [x] 5.3 Guardar a Firestore i mostrar al llistat (ordenat per data desc)

## 6. Edge cases i polish

- [x] 6.1 Mostrar "Membre eliminat" quan autor no té displayName
- [x] 6.2 Estats de loading i error visuals
- [x] 6.3 Accessibilitat: focus, aria-labels, ordre tabulació
