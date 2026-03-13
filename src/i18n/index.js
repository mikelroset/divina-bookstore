import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ca from "./locales/ca.json";
import es from "./locales/es.json";
import en from "./locales/en.json";

const SUPPORTED_LANGS = ["ca", "es", "en"];
const DEFAULT_LANG = "ca";

export { SUPPORTED_LANGS, DEFAULT_LANG };

i18n.use(initReactI18next).init({
  resources: { ca, es, en },
  fallbackLng: DEFAULT_LANG,
  supportedLngs: SUPPORTED_LANGS,
  interpolation: { escapeValue: false },
});

export default i18n;
