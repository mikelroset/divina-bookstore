# Design: Multi-idioma

## Enfoque tècnic

- **Libreria**: react-i18next + i18next
- **Fitxers de traducció**: `src/i18n/locales/{ca,es,en}.json` amb claus per tots els textos de UI
- **Provider**: `I18nextProvider` (react-i18next) envoltant l'app a `main.jsx`
- **Idioma a prefs**: Nou camp `locale` a `users/{uid}/prefs/settings` (Firestore)
- **Detecte navegador**: `navigator.language` o `navigator.languages` per usuaris no autenticats

## Flux

1. **App init**: Carregar i18next amb fallbackLng: "ca"
2. **Usuari autenticat**: Si té `locale` a prefs → usar-lo; si no → detectar navegador → fallback ca
3. **Usuari no autenticat**: Detectar navegador; si no suportat (fr, de, etc.) → ca
4. **Canvi idioma**: Usuari selecciona al perfil → `i18n.changeLanguage(locale)` → `setUserPrefs({ locale })` → UI s'actualitza (react-i18next re-renderitza)
5. **Fallback traducció**: Si falta clau en locale seleccionat, i18next usa fallbackLng (ca)

## Components afectats

- Header, BottomNav
- HomeView, ProfileView, LibraryView, CommunityView, ReviewsView, AddBookView
- BookForm, ConfirmModal, StatCard, ReadingBookBlock, etc.
- ToastContext (missatges)
- WelcomeScreen

## Estructura de claus (exemple)

```
common.save, common.cancel, common.close
nav.home, nav.library, nav.community, nav.reviews, nav.profile
profile.title, profile.logout
home.welcome, home.streak
errors.saveBook
...
```
