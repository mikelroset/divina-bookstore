# Tasks: Multi-idioma

## 1. Infraestructura i18n

- [x] 1.1 Afegir dependències: i18next, react-i18next
- [x] 1.2 Crear `src/i18n/index.js` amb config (fallbackLng: "ca", supportedLngs: ["ca","es","en"])
- [x] 1.3 Crear fitxers `src/i18n/locales/ca.json`, `es.json`, `en.json` amb estructura de claus

## 2. Persistència i selector

- [x] 2.1 Afegir camp `locale` a userPrefsService (lectura/escritura Firestore)
- [x] 2.2 Afegir `locale` i `setLocale` a useUserPrefs
- [x] 2.3 Crear selector d'idioma al ProfileView (Select o radio buttons: Català, Castellà, Anglès)
- [x] 2.4 En canviar idioma: cridar `i18n.changeLanguage(locale)` i `setUserPrefs({ locale })`

## 3. Inicialització i detecte

- [x] 3.1 Envoltar l'app amb `I18nextProvider` a main.jsx
- [x] 3.2 Inicialitzar idioma: si usuari autenticat amb locale a prefs → usar-lo; si no → detectar navegador (ca/es/en) o fallback ca
- [x] 3.3 Usuaris no autenticats: usar `navigator.language`; si no suportat → ca

## 4. Traduccions UI

- [x] 4.1 Traduir Header i BottomNav (navegació)
- [x] 4.2 Traduir ProfileView
- [x] 4.3 Traduir HomeView
- [ ] 4.4 Traduir LibraryView, AddBookView, BookForm
- [ ] 4.5 Traduir CommunityView, ReviewsView, AdminCommunitiesView
- [ ] 4.6 Traduir WelcomeScreen, ConfirmModal, ToastContext (missatges)
- [ ] 4.7 Traduir components comuns: StatCard, ReadingBookBlock, etc.

## 5. Verificació

- [x] 5.1 Provar canvi d'idioma al perfil: UI s'actualitza immediatament
- [x] 5.2 Provar persistència: canviar idioma, tancar sessió, tornar a entrar → idioma guardat
- [x] 5.3 Provar usuari no autenticat: idioma segons navegador; fallback a ca si no suportat
