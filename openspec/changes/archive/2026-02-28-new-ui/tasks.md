# Tasks: New UI — Sistema de temes (Light / Dark / System)

## 1. Create theme tokens

- [x] 1.1 Crear fitxer `src/styles/theme.css` (o equivalent) amb variables CSS per light i dark theme: `--color-bg`, `--color-bg-secondary`, `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-primary`. Valors segons design.md.

## 2. Create ThemeProvider and useTheme

- [x] 2.1 Crear ThemeProvider (context React) que exposa `theme` (light | dark | system) i `setTheme`
- [x] 2.2 Aplicar `data-theme="light"` o `data-theme="dark"` al `<html>` segons el tema efectiu
- [x] 2.3 Quan `theme === 'system'`, detectar preferència via `window.matchMedia('(prefers-color-scheme: dark)')` i aplicar light o dark
- [x] 2.4 Escoltar canvis del sistema amb `matchMedia.addEventListener('change', ...)` per reaccionar quan el sistema canvia de tema

## 3. Add theme selector in header

- [x] 3.1 Afegir selector de tema al header amb opcions: Light | Dark | System
- [x] 3.2 En canviar opció: actualitzar ThemeProvider, guardar a `localStorage` (key `app-theme`), aplicar immediatament

## 4. Persist user preference

- [x] 4.1 En iniciar l'app: si existeix valor a `localStorage` key `app-theme` → aplicar-lo; si no → usar `system`
- [x] 4.2 En canviar tema des del selector: guardar el valor a `localStorage`

## 5. Refactor components to use tokens

- [x] 5.1 Layout principal: substituir colors hardcoded per `var(--color-*)`
- [x] 5.2 Header / Navigation: idem
- [x] 5.3 Botons (primary, secondary): idem; primary = color-primary + text blanc; secondary segons design
- [x] 5.4 Cards: idem (Box)
- [x] 5.5 Inputs: idem (TextInput, Select, tokens)
- [x] 5.6 Modals: idem (ConfirmModal)
- [x] 5.7 Alerts: usar colors definits (success, warning, error, info)
- [x] 5.8 Components principals refactoritzats; algunes vistes poden requerir follow-up

## 6. Verification

- [x] 6.1 Provar que el selector funciona, la preferència es guarda i el tema canvia instantàniament
- [x] 6.2 Provar mode "System": canviar tema del sistema mentre l'app està oberta i verificar que l'app reacciona
- [x] 6.3 Revisar en Light i Dark que no hi ha regressions visuals als components principals
