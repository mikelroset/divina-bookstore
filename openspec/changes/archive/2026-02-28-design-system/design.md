# Design: Design System

## Estructura

```
src/design-system/
  tokens.js        # Variables centralitzades (colors, spacing, radius)
  components/      # Components reutilitzables del DS
    TextInput.jsx
    Textarea.jsx
  README.md        # Documentació bàsica
```

Els botons existents (PrimaryButton, SecondaryButton, GhostButton) es mantenen a `src/components/common/Button.jsx` i es documenten al design system.

## Design Tokens

Exportar des de `tokens.js`:
- **Colors**: primary (del tailwind), background, text
- **Spacing**: sm, md, lg (alineats amb Tailwind)
- **Radius**: md (rounded-xl), lg (rounded-2xl)
- **Typography**: font-primary (Playfair Display), font-sans (default)

Els tokens es poden mapear a classes Tailwind per ús als components.

## TextInput

Component d'input de text amb:
- Estil consistent (border primary, focus ring)
- Suport per label, placeholder, error
- className per extensió

## Textarea

Igual que TextInput però per text multilínia.

## Documentació

README.md amb:
- Llistat de components i ús recomanat
- Tokens disponibles
- Exemple d'ús
