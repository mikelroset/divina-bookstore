# Design System - Divina Bookstore

Sistema de disseny centralitzat per mantenir consistència visual i facilitar el manteniment.

## Estructura

```
src/design-system/
  tokens.js       # Variables de disseny (colors, spacing, radius)
  components/     # Components reutilitzables
    TextInput.jsx
    Textarea.jsx
  README.md       # Aquesta documentació
```

Els **botons** estan a `src/components/common/Button.jsx` (PrimaryButton, SecondaryButton, GhostButton).

## Design Tokens

Importar: `import { TOKENS } from '../design-system/tokens';`

| Token | Valors | Tailwind |
|-------|--------|----------|
| **Colors primary** | 50-900 | `primary-500`, `primary-600`, etc. |
| **Spacing** | sm, md, lg | `p-2`, `p-4`, `p-6` |
| **Border radius** | md, lg, xl | `rounded-lg`, `rounded-xl`, `rounded-2xl` |
| **Input base** | — | Classe combinada per inputs |

## Components

### PrimaryButton, SecondaryButton, GhostButton

**Ubicació:** `src/components/common/Button.jsx`

| Variant | Ús |
|---------|-----|
| **PrimaryButton** | Acció principal (Afegir, Guardar, Acceptar) |
| **SecondaryButton** | Acció alternativa (Cancel·lar) |
| **GhostButton** | Accions menors (enllaços sense fons) |

**Props:** `children`, `icon`, `size` (sm/md/lg), `to`, `href`, `disabled`, `className`

**Exemple:**
```jsx
<PrimaryButton icon={Plus} to="/add">Afegir llibre</PrimaryButton>
<SecondaryButton onClick={onCancel}>Cancel·lar</SecondaryButton>
```

### TextInput

**Ubicació:** `src/design-system/components/TextInput.jsx`

Camp d'entrada d'una línia.

**Props:** `label`, `id`, `error`, `placeholder`, `disabled`, `value`, `onChange`, etc.

**Exemple:**
```jsx
<TextInput
  label="Títol *"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  error={errors.title}
  placeholder="Títol del llibre"
/>
```

### Textarea

**Ubicació:** `src/design-system/components/Textarea.jsx`

Camp de text multilínia.

**Props:** `label`, `id`, `error`, `rows`, `placeholder`, `disabled`, `value`, `onChange`, etc.

**Exemple:**
```jsx
<Textarea
  label="Descripció"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows={4}
  placeholder="Sinopsi del llibre..."
/>
```

## Regles d'ús

1. **Nous components:** utilitzar sempre components del design system quan existeixin.
2. **Tokens:** colors i espaiats han de venir de `tokens.js` o Tailwind config.
3. **Refactorització:** actualitzar progressivament components antics per utilitzar TextInput, Textarea i Button.
