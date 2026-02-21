# Divina Bookstore

Aplicació de biblioteca personal en català per gestionar la teva col·lecció de llibres, seguir el progrés de lectura i veure què llegeix la comunitat.

## Tecnologies

- **React 19** + **Vite 7** – interfície i build
- **Firebase** – autenticació (Google) i base de dades (Firestore)
- **Tailwind CSS** – estils
- **React Router** – navegació
- **Lucide React** – icones
- **Vitest** + **Testing Library** – tests

## Què fa l’aplicació

### Autenticació
- Inici de sessió amb **Google**. Sense compte no es pot accedir a la resta de l’app.

### Inici (Home)
- Resum de la biblioteca: llibres completats aquest mes, gènere preferit (segons llibres completats), total de llibres i completats.
- Barra de **progrés global de lectura** (percentatge de pàgines llegides dels llibres en estat “Llegint”).
- Secció **Llegint ara**: el llibre que tens amb estat “Llegint” i el progrés (pàgina actual / total).

### Biblioteca
- Llista de tots els teus llibres en targetes (portada, títol, autor, estat, etc.).
- **Cerca** per títol o autor.
- **Filtre per estat**: Tots, Desitjats, Pendents, Llegint, Completats.
- Accions per llibre: **editar** i **eliminar** (amb confirmació).

### Afegir / Editar llibre
- Formulari amb: títol, autor, gènere (select amb molts gèneres en català), estat (Pendent, Llegint, Completat, Desitjat), valoració, descripció, comentaris, portada, ISBN, pàgines, editorial, any, idioma, dates d’inici/fi, pàgina actual.
- **Cerca de portada**: botó per buscar la portada per títol i autor (servei de portades + Google).
- **Cerca de descripció**: omplir la descripció automàticament.
- Es pot afegir un llibre nou o editar-ne un existent (ruta `/add` i `/add/:id`).

### Comunitat
- Llista de **lectors de la comunitat** que tenen un llibre en lectura.
- Es mostra el llibre que estàs llegint tu i el que llegeix cada altre lector (portada, títol, autor, gènere, progrés, dies llegint).
- Les dades de “què llegeix ara” cada usuari es guarden a Firestore i es sincronitzen des del context de llibres.

### Perfil
- Dades de l’usuari (foto, nom, email).
- Resum: total de llibres i llibres completats.
- Botó **Tancar sessió**.

## Estats d’un llibre

| Valor     | Etiqueta   | Descripció                          |
|----------|------------|-------------------------------------|
| `wishlist` | Desitjat   | A la llista de desitjos             |
| `pending`  | Pendent   | Per llegir                          |
| `reading`  | Llegint   | En curs (compta per progrés i comunitat) |
| `completed`| Completat | Llegit (compta per estadístiques)  |

## Executar el projecte

1. **Instal·lar dependències**
   ```bash
   npm install
   ```

2. **Configurar Firebase**  
   Crea un projecte a [Firebase Console](https://console.firebase.google.com/) i configura Autenticació (Google) i Firestore. Afegeix les variables d’entorn en un fitxer `.env` a l’arrel (veure `.env.example` si existeix o la documentació de Vite per `VITE_*`).

   **Firestore – encoratjaments:** La col·lecció `encouragements` emmagatzema qui envia un encoratjament a qui. Regles recomanades a Firebase Console: (1) Crear: només si `request.auth.uid == request.resource.data.fromUserId`. (2) Llegir: només si `request.auth.uid == resource.data.toUserId`. Crea un índex compost: col·lecció `encouragements`, camps `toUserId` (Ascending) i `createdAt` (Descending).

3. **Arrencar en desenvolupament**
   ```bash
   npm run dev
   ```

4. **Build per producció**
   ```bash
   npm run build
   ```

5. **Tests**
   ```bash
   npm run test        # amb watch
   npm run test:run    # una sola execució
   ```

6. **Lint**
   ```bash
   npm run lint
   ```

## Estructura del projecte (resum)

- `src/App.jsx` – rutes, layout, modals, integració d’auth i llibres.
- `src/context/` – `AuthContext`, `BooksContext`.
- `src/components/views/` – `HomeView`, `LibraryView`, `CommunityView`, `AddBookView`, `ProfileView`.
- `src/components/forms/` – `BookForm` (formulari únic per afegir/editar).
- `src/components/common/` – `BookCard`, `StatCard`, `ProgressBar`, `ConfirmModal`, etc.
- `src/services/` – Firebase, `bookService`, `authService`, `communityService`, `encouragementService`, `coverService`, `descriptionService`.
- `src/utils/` – `constants.js` (estats, gèneres, rutes), `stats.js`, `helpers.js`, etc.
- `src/hooks/` – `useAuth`, `useBooks`, `useStats`, `useLibraryFilters`.
- `openspec/` – Spec-Driven Development (Open Spec): `specs/` (especificacions per capacitat), `changes/` (proposal, design, tasks per canvi).

## Spec-Driven Development (Open Spec)

Aquest projecte utilitza [Open Spec](https://openspec.dev/) per al flux SDD. A Cursor tens les comandes:

- **`/opsx:new <nom>`** – Crear un nou canvi (feature/fix).
- **`/opsx:ff`** – Generar proposal, specs, design i tasks (fast-forward).
- **`/opsx:apply`** – Implementar les tasques del canvi actual.
- **`/opsx:archive`** – Arxivar el canvi i actualitzar les specs.
- **`/opsx:onboard`** – Guia d’onboarding al flux.

Requisit: `npm install -g @fission-ai/openspec@latest`. Reinicia l’IDE perquè les comandes slash estiguin actives.
