# Design: Sistema de temes (Light / Dark / System)

## Context

- Framework: React (Vite). Estils actuals: Tailwind CSS i classes inline. Colors dominants: verd.
- Els colors estan hardcoded en diverses parts (background, text, cards, botons).
- Cal introduir variables CSS globals i un ThemeProvider per aplicar el tema.

## Arquitectura

### 1. Design tokens (variables CSS)

Fitxer: `src/styles/theme.css` (o equivalent).

**Light theme:**
- `--color-bg`: #FFFFFF
- `--color-bg-secondary`: #F5F7FA
- `--color-surface`: #FFFFFF
- `--color-border`: #E5E7EB
- `--color-text-primary`: #111827
- `--color-text-secondary`: #6B7280
- `--color-primary`: blau accent (ex. #0EA5E9)

**Dark theme:**
- `--color-bg`: #0F172A
- `--color-bg-secondary`: #1E293B
- `--color-surface`: #1E293B
- `--color-border`: #334155
- `--color-text-primary`: #F8FAFC
- `--color-text-secondary`: #94A3B8
- `--color-primary`: mateix blau o variant

**Alerts (igual en tots els temes):**
- success: #22C55E
- warning: #F59E0B
- error: #EF4444
- info: #0EA5E9

### 2. ThemeProvider i useTheme

- Context React que exposa `theme` (light | dark | system) i `setTheme`
- Quan `theme === 'system'`, detectar via `window.matchMedia('(prefers-color-scheme: dark)')` i aplicar light o dark en conseqüència
- Escoltar canvis del sistema amb `matchMedia.addEventListener('change', ...)`
- Aplicar `data-theme="light"` o `data-theme="dark"` al `<html>` o `<body>` per activar les variables CSS

### 3. Selector de tema al header

- Dropdown o botons: Light | Dark | System
- En canviar: actualitzar ThemeProvider, guardar a `localStorage` (key `app-theme`), aplicar immediatament

### 4. Persistència

- Key: `app-theme`
- Valor: `light` | `dark` | `system`
- En iniciar: si existeix valor → aplicar-lo; si no → usar `system`

### 5. Regles de disseny

- **Color distribution 60-30-10:** 60% backgrounds neutrals, 30% surfaces/cards, 10% accent (blau)
- **Spacing scale:** 4, 8, 16, 24, 32, 48, 64 px
- **Typography:** Title 24px, Section 18px, Body 16px, Caption 12px
- **Botons:** Primary: color-primary + text blanc; Secondary: background gris clar/fosc segons tema, text contrastant

### 6. Ordre de refactorització

1. Layout principal
2. Header / Navigation (incl. selector de tema)
3. Botons
4. Cards
5. Inputs
6. Modals
7. Alerts

### 7. Edge cases

- **Canvi de tema durant l'ús:** tots els components s'actualitzen immediatament, sense refrescar
- **Canvi del tema del sistema (mode system):** l'app reacciona automàticament
- **Components amb colors hardcoded:** cal assegurar que tots passen a tokens; suport dark mode
