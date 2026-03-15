# theme

## Purpose

Sistema de temes visuals (Light / Dark / System) per modernitzar la UI, millorar la llegibilitat i permetre mode dark.

## Requirements

### Requirement: Theme tokens and variables

The app SHALL define design tokens as CSS custom properties (variables) for light and dark themes.

- **Light theme:** `--color-bg`, `--color-bg-secondary`, `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-secondary`, `--color-primary`
- **Dark theme:** Same variable names with dark-mode appropriate values
- Alerts (success, warning, error, info) SHALL use consistent colors across themes
- Components SHALL use `var(--variable-name)` instead of hardcoded color values; no component SHALL use raw hex or named colors (e.g. `#00FF00`, `green`)

### Requirement: Theme provider and state

The app SHALL provide a ThemeProvider and `useTheme()` hook that:

- Expose `theme` (`light` | `dark` | `system`) and `setTheme`
- Apply the correct theme by setting `data-theme="light"` or `data-theme="dark"` on `<html>` or `<body>`
- When `theme === 'system'`, detect system preference via `window.matchMedia('(prefers-color-scheme: dark)')` and apply light or dark accordingly
- Listen for system preference changes with `matchMedia.addEventListener('change', ...)` so that when the user selects "System" and the OS theme changes, the app updates automatically

### Requirement: Theme selector in header

The header SHALL include a theme selector allowing the user to choose:

- Light
- Dark
- System

When the user selects an option, the theme SHALL update immediately and the preference SHALL be persisted.

### Requirement: Persist user theme preference

The selected theme preference SHALL be persisted in `localStorage` under key `app-theme` with value `light` | `dark` | `system`.

- On app init: if a saved value exists, apply it; otherwise use `system`

### Requirement: Instant theme change

When the user changes the theme (or when the system theme changes while "System" is selected), all components SHALL update immediately without requiring a page refresh.
