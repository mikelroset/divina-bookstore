# Design System - Divina Bookstore

Sistema de disseny centralitzat per mantenir consistència visual i facilitar el manteniment.

## Estructura

```
src/design-system/
  tokens.js       # Variables de disseny (colors, spacing, radius, box)
  index.js        # Exports centrals
  components/
    Box.jsx       # Contenidors unificats
    Titles.jsx    # PageTitle, BoxTitle, BookTitle, SectionTitle
    TextInput.jsx
    Textarea.jsx
    Select.jsx    # Selector amb fletxa espaiada
    StarRating.jsx
    ProgressBar.jsx
    LikeButton.jsx
  README.md
```

Els **botons** estan a `src/components/common/Button.jsx`.

---

## Design Tokens

`import { TOKENS } from '../design-system/tokens';`

| Token | Ús |
|-------|-----|
| **colors** | primary, accent, slate |
| **spacing** | sm, md, lg, xl |
| **borderRadius** | md, lg, xl |
| **shadow** | sm, md, lg |
| **box** | base, soft, padding |
| **input** | base, error |

---

## Components

### Box

Contenidor unificat: border verd, fons blanc, ombra. Unifica les boxes del perfil i de la resta de l'app.

| Variant | Estil |
|---------|-------|
| `default` | bg-white/80, border-primary-500, shadow-lg |
| `soft` | bg-primary-50 (caixes del perfil) |

**Props:** `variant`, `padding` (sm/md/lg), `className`

```jsx
<Box>Contingut</Box>
<Box variant="soft" padding="md">Estadística</Box>
```

---

### Titles

| Component | Ús |
|-----------|-----|
| **PageTitle** | Títol de pàgina (h2, text-3xl font-serif) |
| **BoxTitle** | Títol amb icona de les boxes de l'inici |
| **BookTitle** | Títol dels llibres (h3) |
| **SectionTitle** | Subseccions (h3 uppercase tracking-wide) |

```jsx
<PageTitle>Benvingut/da!</PageTitle>
<BoxTitle icon={Heart}>Encoratjaments</BoxTitle>
<BookTitle>El Quixot</BookTitle>
<SectionTitle>Membres</SectionTitle>
```

---

### Select

Selector amb fletxa espaiada (pr-10) per no quedar enganxada a la dreta.

**Props:** `options` (array {value, label}) o `children` (option elements), `value`, `onChange`, `label`, `error`

```jsx
<Select options={[{value: 'a', label: 'Opció A'}]} value={v} onChange={e => setV(e.target.value)} />
<Select value={id} onChange={e => setId(e.target.value)}>
  {items.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
</Select>
```

---

### TextInput / Textarea

Camps d'entrada amb label, error, disabled.

---

### StarRating

Valoració d'1-5 estrelles. **Props:** `value`, `onChange` (opcional), `readOnly`, `size`

---

### ProgressBar

Barra de progrés unificada.

| Variant | Ús |
|---------|-----|
| **primary** | Bloc de progrés de lectura de l'inici (track slate-100, fill slate-700) |
| **secondary** | Llegint ara, punts totals al perfil (track slate-200, fill primary-500) |

**Props:** `value`, `max`, `variant`, `showLabel`, `height` (sm/md)

---

### LikeButton

Botó de like per ressenyes. **Props:** `liked`, `count`, `onClick`, `disabled`, `size`

---

### Card Biblioteca / Card Comunitat

- **BookCard** (`src/components/common/BookCard.jsx`): targeta de llibre a la biblioteca
- **ReaderCard** (`src/components/common/ReaderCard.jsx`): targeta de lector a la comunitat

Patró: `rounded-2xl border border-primary-500 bg-white/80 shadow-lg`

---

### Badge (amb popup)

**BadgeCard** i **BadgeGrid** (`src/components/common/BadgeGrid.jsx`). El popup (BadgeTooltip) es mostra en tap/hover.

---

### Buttons

**PrimaryButton**, **SecondaryButton**, **GhostButton** – sempre amb icona Lucide (no emoji).

```jsx
<PrimaryButton icon={Plus}>Afegir</PrimaryButton>
<PrimaryButton icon={Search} size="sm">Buscar portada</PrimaryButton>
```

---

### Gràfic progrés

WeeklyMiniChart a `ReadingBookBlock` – gràfic de barres setmanal. Estil: `bg-primary-300 rounded-t`.

---

## Regles d'ús

1. Utilitzar sempre components del design system quan existeixin.
2. Colors i espaiats: `tokens.js` o Tailwind config.
3. No emojis als botons: usar icona Lucide.
4. Refactorització progressiva: actualitzar components antics per utilitzar els nous.
