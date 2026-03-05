# Tasks: Afegir placeholders

## 1. Component BookCover

- [x] 1.1 Crear `src/components/common/BookCover.jsx` que rep `src`, `alt`, `className` (opcional). Si `src` és buit/null/undefined, mostrar placeholder (div amb ratio de portada, fons slate-200, icona BookOpen o text "Portada"). Si `src` existeix, mostrar `<img>` amb `onError` que canvia a placeholder. Mantenir mida fixa per evitar layout shift.
- [x] 1.2 Assegurar `alt` apropiat: "Portada de {títol}" si hi ha títol, sinó "Portada no disponible".

## 2. Component Avatar

- [x] 2.1 Crear `src/components/common/Avatar.jsx` que rep `src`, `alt`, `displayName` (opcional), `className` (opcional, p. ex. per mida). Si `src` és buit o la imatge falla, mostrar placeholder circular amb inicials (primera lletra de displayName) o icona User; mateixa mida. Gestió d’`onError` per fallback.
- [x] 2.2 Assegurar `alt`: "Avatar de {nom}" o "Avatar no disponible".

## 3. Integrar BookCover

- [x] 3.1 BookCard: usar BookCover en lloc de `<img src={book.coverUrl}>`.
- [x] 3.2 HomeView (llibre en lectura): usar BookCover.
- [x] 3.3 CommunityView (llibres de l’usuari i de lectors): usar BookCover on es mostren portades.
- [x] 3.4 BookForm (previsualització de portada): usar BookCover o equivalent si la URL és buida o falla.

## 4. Integrar Avatar

- [x] 4.1 Header: usar Avatar per user.photoURL.
- [x] 4.2 ProfileView: usar Avatar per user.photoURL.
- [x] 4.3 CommunityView: usar Avatar per reader.photoURL (lectors) i per l’avatar del current user si es mostra.

## 5. Verificació

- [x] 5.1 Comprovar que no hi ha regressió visual (alineacions, espaiats, mides). Comprovar placeholders amb coverUrl buit i photoURL buit.
