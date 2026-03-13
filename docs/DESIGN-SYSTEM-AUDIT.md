# Auditoria Design System – Divina Bookstore

Revisió de la sincronització entre els components del design-system (`src/design-system/`) i els elements de l'aplicació.

---

## Resum executiu

| Component design-system | Ús actual | Sincronització |
|------------------------|-----------|----------------|
| **Box** | Parcial (només ProfileView) | ⚠️ Baixa |
| **Titles** (PageTitle, BoxTitle, etc.) | No s'usa | ❌ Inexistència |
| **TextInput** | No s'usa | ❌ Inexistència |
| **Textarea** | No s'usa | ❌ Inexistència |
| **Select** | Parcial (només LibraryView) | ⚠️ Baixa |
| **StarRating** | No s'usa | ❌ Inexistència |
| **ProgressBar** | Duplicat + barres inline | ⚠️ Fragmentat |
| **LikeButton** | No s'usa | ❌ Inexistència |
| **Buttons** (common/) | S'usen | ✅ Correcte |
| **TOKENS** | No s'usa | ❌ Inexistència |

---

## 1. Box

**Design system:** `Box` amb variants `default` (bg-white/80, border-primary-500, shadow-lg) i `soft` (bg-primary-50).

**Ús actual:**
- ✅ `ProfileView.jsx` – les 4 boxes internes (Total llibres, Llibres completats, Insígnies, Punts totals) fan servir `Box`
- ❌ Contenidor principal de ProfileView: `div` manual
- ❌ `HomeView.jsx` – 6+ divs amb `bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg`
- ❌ `CommunityView.jsx` – 6+ divs iguals
- ❌ `BookForm.jsx` – contenidor del formulari
- ❌ `BookCard.jsx`, `ReaderCard.jsx`, `ReadingBookCard.jsx` – cards amb estil duplicat
- ❌ `StatCard.jsx` – box de estadística

**Acció:** Substituir tots els `div` amb aquest patró per `<Box>` (o `Box variant="default"`).

---

## 2. Titles (PageTitle, BoxTitle, BookTitle, SectionTitle)

**Design system:** `PageTitle`, `BoxTitle`, `BookTitle`, `SectionTitle`.

**Ús actual:**
- ❌ Cap vista fa servir `PageTitle` – totes fan servir: `<h2 className="text-3xl font-serif text-slate-800 mb-2">`
  - HomeView, LibraryView, ProfileView, AddBookView, CommunityView, ReviewsView
- ❌ Cap vista fa servir `BoxTitle` – HomeView duplica l'estructura amb icona + text
- ❌ `BookCard.jsx` – usa `<h3 className="font-serif text-lg ...">` en lloc de `BookTitle`
- ❌ `SectionTitle` – no s'ha comprovat l'ús a CommunityView

**Acció:** Importar i usar `PageTitle`, `BoxTitle`, `BookTitle`, `SectionTitle` on correspongui.

---

## 3. TextInput / Textarea

**Design system:** `TextInput`, `Textarea` amb label, error, TOKENS.input.base.

**Ús actual:**
- ❌ Cap component fa servir aquests components
- `BookForm.jsx` – ~15 camps `input` i 2 `textarea` amb classes manuals
- Modal de ressenyes a `ReviewsView.jsx` – `textarea` manual
- Altres formularis amb inputs/textarea manuals

**Acció:** Migrar formularis (especialment BookForm) a `TextInput` i `Textarea`.

---

## 4. Select

**Design system:** `Select` amb options, fletxa espaiada (pr-10), label, error.

**Ús actual:**
- ✅ `LibraryView.jsx` – fa servir `Select` del design-system
- ❌ `CommunityView.jsx` – 2 `select` nius
- ❌ `BookForm.jsx` – 2 `select` (gènere, estat)
- ❌ `ReviewsView.jsx` – 1 `select` al modal de publicar
- ❌ `AdminCommunitiesView.jsx` – 3 `select`

**Acció:** Substituir tots els `select` per `Select` del design-system.

---

## 5. StarRating

**Design system:** `StarRating` amb value, onChange, readOnly, size.

**Ús actual:**
- ❌ `BookCard.jsx` – loop manual amb `<Star>` i lògica de rating
- ❌ `BookForm.jsx` – 5 botons amb `<Star>` i lògica manual
- ❌ Ressenyes – si hi ha valoració, també seria candidat a `StarRating`

**Acció:** Substituir per `<StarRating value={...} onChange={...} readOnly={false} />` al BookForm i `<StarRating value={...} readOnly />` a BookCard.

---

## 6. ProgressBar

**Problema crític:** Hi ha dos components `ProgressBar`:

| Font | API | Estil |
|------|-----|-------|
| `src/components/common/ProgressBar.jsx` | `percentage`, `showLabel`, `color` | Track primary-100, fill gradient primary |
| `src/design-system/components/ProgressBar.jsx` | `value`, `max`, `variant`, `showLabel`, `height` | primary = slate, secondary = verd |

**Ús actual:**
- `HomeView.jsx` – fa servir `common/ProgressBar` (progrés global de lectura)
- `ReadingBookBlock.jsx` – barra inline (no component)
- `ProfileView.jsx` – 2 barres inline (punts totals, progrés anual)
- `ReaderCard.jsx`, `ReadingBookCard.jsx` – barres inline (track slate-100, fill slate-600)
- `HomeView.jsx` – objectiu anual: barra inline

**Inconsistència de disseny:** El README diu variant `primary` = slate (fosc), `secondary` = verd. L'usuari ha indicat que vol unificar tot a verd. Cal:
1. Unificar a un sol `ProgressBar` del design-system
2. Fer que totes les barras facin servir variant `secondary` (verd) o afegir una variant única “verda”
3. Eliminar `common/ProgressBar.jsx` i migrar HomeView al design-system

---

## 7. LikeButton

**Design system:** `LikeButton` amb liked, count, onClick, disabled, size.

**Ús actual:**
- ❌ `ReviewsView.jsx` – botó custom amb Heart + span, estil duplicat de LikeButton
- `ReadingBookCard.jsx` – usa només icona Heart, possiblement diferent cas d'ús

**Acció:** Substituir el botó de like de ReviewsView per `<LikeButton liked={...} count={...} onClick={...} />`.

---

## 8. Buttons (PrimaryButton, SecondaryButton, GhostButton)

**Design system:** `src/components/common/Button.jsx` – PrimaryButton, SecondaryButton, GhostButton amb icona Lucide.

**Ús actual:**
- ✅ S'usen a LibraryView, AddBookView, etc.
- ⚠️ Hi ha molts `<button>` amb classes manualment definides (ReviewsView paginació, modals, etc.) que podrien ser SecondaryButton / GhostButton

**Acció:** Revisar botons genèrics i unificar amb els components de Button quan sigui possible.

---

## 9. TOKENS

**Design system:** `tokens.js` amb colors, spacing, borderRadius, input.base, input.error.

**Ús actual:**
- ❌ Cap component importa `TOKENS` excepte TextInput/Textarea del design-system
- Les classes es repeteixen directament (border-primary-500, px-4 py-2, rounded-xl, etc.)

**Acció:** Els components del design-system ja fan servir TOKENS on cal. La millora és indirecta: migrar més components al design-system per acostar-se als tokens.

---

## Plan d’acció recomanat

### Fase 1 – Impacte alt, poca fricció
1. **Unificar ProgressBar:** Eliminar `common/ProgressBar`, usar `design-system/ProgressBar` amb variant secundària (verd) a tots els llocs.
2. **Migrar Titles:** Introduir PageTitle i BoxTitle a totes les vistes principals.
3. **Migrar Select:** Substituir selects per `Select` a BookForm, CommunityView, ReviewsView, AdminCommunitiesView.
4. **Migrar StarRating:** BookCard i BookForm.

### Fase 2 – Migració de formularis
5. **Migrar TextInput/Textarea:** Començar pel BookForm (camps més sensibles a consistència).
6. **Migrar LikeButton:** ReviewsView.

### Fase 3 – Containers i estil global
7. **Migrar Box:** HomeView, CommunityView, BookForm, cards (BookCard, ReaderCard, ReadingBookCard, StatCard).
8. **Revisar botons:** Paginació, modals i altres botons genèrics.

---

## Fitxers per prioritzar

| Fitxer | Components a migrar |
|--------|---------------------|
| HomeView.jsx | Box, PageTitle, BoxTitle, ProgressBar (design-system) |
| LibraryView.jsx | PageTitle |
| ProfileView.jsx | PageTitle, Box (contenidor principal) |
| CommunityView.jsx | Box, PageTitle, SectionTitle, Select |
| BookForm.jsx | Box, TextInput, Textarea, Select, StarRating |
| BookCard.jsx | Box, BookTitle, StarRating |
| ReviewsView.jsx | PageTitle, Select, Textarea, LikeButton, Button |
| ReadingBookBlock.jsx | ProgressBar (design-system) |
| ReaderCard.jsx | Box, ProgressBar (design-system) |
| ReadingBookCard.jsx | Box, ProgressBar (design-system) |
| AdminCommunitiesView.jsx | Select |
| StatCard.jsx | Box |
