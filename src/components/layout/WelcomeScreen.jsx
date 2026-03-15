import React from "react";
import { useTranslation } from "react-i18next";
import {
  BookOpen,
  Flame,
  Users,
  Search,
  ChevronDown,
  ChevronRight,
  Shield,
  Lock,
  Trash2,
  Award,
} from "lucide-react";
import { CATALOG, getLevelInfo, getPointsForLevel } from "../../utils/levelCatalog";

const FAQ_ITEMS = [
  {
    q: "Per què he de fer login?",
    a: "Per guardar la teva biblioteca, el progrés de lectura i la teva ratxa. Sense compte no podem desar res.",
  },
  {
    q: "Què passa amb les meves dades?",
    a: "Només fem servir el teu compte Google per identificar-te. No publiquem res sense el teu permís.",
  },
  {
    q: "Puc canviar d'usuari?",
    a: "Sí. A la pantalla de perfil pots tancar sessió i entrar amb un altre compte.",
  },
  {
    q: "Puc desactivar la part social?",
    a: "Sí. Pots desactivar l'opció d'aparèixer al rànquing i limitar el que comparteixes amb la comunitat.",
  },
];

const FEATURE_CARDS = [
  {
    icon: BookOpen,
    title: "Llegint",
    desc: "Marca progrés i estat del llibre.",
  },
  {
    icon: Flame,
    title: "Ratxa",
    desc: "Mantén l'hàbit amb una ratxa visual.",
  },
  {
    icon: Users,
    title: "Comunitat",
    desc: "Mira rànquings, tendències i llibres populars.",
  },
  {
    icon: Search,
    title: "Descobriment",
    desc: "Cerca i guarda llibres per més tard.",
  },
];

export const WelcomeScreen = ({ onLogin, loginError }) => {
  const { t } = useTranslation();
  const [faqOpen, setFaqOpen] = React.useState(null);
  const [levelsOpen, setLevelsOpen] = React.useState(false);

  const getLevelDisplayName = (info) => {
    if (!info) return "";
    if (info.isLegend) return t("levels.legend");
    return `${t(`levels.roles.${info.roleIndex}`)} — ${t(`levels.minerals.${info.mineralIndex}`)}`;
  };

  const handleClick = () => {
    if (onLogin) {
      onLogin();
    } else {
      console.error("❌ onLogin no està definit!");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] transition-colors duration-150">
      <div className="min-h-screen flex flex-col lg:flex-row lg:min-h-0">
        {/* Columna esquerra: CTA */}
        <div className="flex flex-col justify-center p-6 lg:p-12 lg:w-[420px] lg:shrink-0">
          <div className="text-center lg:text-left">
            <img
              src="/logo.svg"
              alt="Logo DivinaBookStore"
              className="w-16 h-16 mx-auto lg:mx-0 mb-4"
            />
            <h1 className="text-3xl lg:text-4xl font-serif text-[var(--color-text-primary)] mb-2">
              DivinaBookStore
            </h1>
            <p className="text-[var(--color-text-secondary)] mb-6">
              La teva biblioteca personal
            </p>

            <button
              onClick={handleClick}
              className="w-full max-w-sm mx-auto lg:mx-0 flex items-center justify-center gap-3 bg-[var(--color-surface)] hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-[var(--color-primary)] font-medium"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continua amb Google</span>
            </button>

            <p className="mt-3 text-sm text-[var(--color-text-secondary)] max-w-sm mx-auto lg:mx-0">
              Per guardar la teva biblioteca i la teva ratxa
            </p>

            {loginError && (
              <p
                role="alert"
                className="mt-3 text-sm text-red-600 font-medium max-w-sm mx-auto lg:mx-0"
              >
                {loginError}
              </p>
            )}
          </div>
        </div>

        {/* Columna dreta: Blocs informatius */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 space-y-6">
          {/* Bloc 1 — Value proposition */}
          <section>
            <h2 className="text-2xl font-serif text-[var(--color-text-primary)] mb-2">
              Organitza la teva lectura i gaudeix més dels llibres
            </h2>
            <p className="text-[var(--color-text-secondary)]">
              Segueix el progrés, mantén la ratxa i descobreix què llegeix la comunitat.
            </p>
          </section>

          {/* Bloc 2 — Com funciona */}
          <section className="bg-[var(--color-surface)]/70 backdrop-blur-sm rounded-xl p-5 border border-[var(--color-border)]">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">Com funciona</h3>
            <ol className="space-y-2 text-[var(--color-text-secondary)]">
              <li className="flex gap-2">
                <span className="font-medium text-[var(--color-primary)]">1.</span>
                Entra amb Google.
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-[var(--color-primary)]">2.</span>
                Afegeix llibres a "Vull llegir", "Llegint" i "Llegit".
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-[var(--color-primary)]">3.</span>
                Fes seguiment del progrés i la teva ratxa.
              </li>
            </ol>
          </section>

          {/* Bloc 3 — Features */}
          <section>
            <h3 className="font-semibold text-slate-800 mb-3">Què hi pots fer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {FEATURE_CARDS.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-primary-200 flex gap-3"
                >
                  <Icon className="w-6 h-6 text-primary-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">{title}</p>
                    <p className="text-sm text-slate-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bloc — Sistema de nivells (desplegable) */}
          <section className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setLevelsOpen(!levelsOpen)}
              className="w-full flex items-center justify-between gap-2 p-4 text-left text-slate-800 font-semibold hover:bg-primary-50/50 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary-600" />
                Sistema de nivells
              </span>
              {levelsOpen ? (
                <ChevronDown className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" />
              )}
            </button>
            {levelsOpen && (
              <div className="px-4 pb-4 pt-0 max-h-64 overflow-y-auto">
                <p className="text-xs text-slate-600 mb-2">
                  Guanya punts llegint; cada ~171 punts pugen de rang. El nivell 71 és <span className="font-medium text-amber-500">Llegenda Divina</span>.
                </p>
                <ul className="space-y-1 text-sm">
                  {CATALOG.map((entry) => (
                    <li key={entry.level} className="flex justify-between gap-2 py-1 border-b border-slate-100 last:border-0">
                      <span className={getLevelInfo(entry.level).colorClass}>
                        {getLevelDisplayName(getLevelInfo(entry.level))}
                      </span>
                      <span className="text-slate-500 shrink-0">
                        {getPointsForLevel(entry.level)} punts
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Bloc 4 — Confiança */}
          <section className="bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-primary-200">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-600" />
              Confiança i privacitat
            </h3>
            <ul className="space-y-2 text-slate-700 text-sm">
              <li className="flex gap-2">
                <Lock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                Només fem servir el teu compte Google per identificar-te.
              </li>
              <li className="flex gap-2">
                <Lock className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                No publiquem res sense el teu permís.
              </li>
              <li className="flex gap-2">
                <Trash2 className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                Pots esborrar el compte quan vulguis.
              </li>
            </ul>
          </section>

          {/* Bloc 5 — FAQ */}
          <section>
            <h3 className="font-semibold text-slate-800 mb-3">Preguntes freqüents</h3>
            <div className="space-y-2">
              {FAQ_ITEMS.map(({ q, a }, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-sm rounded-xl border border-primary-200 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between gap-2 p-4 text-left text-slate-800 font-medium hover:bg-primary-50/50 transition-colors"
                  >
                    {q}
                    {faqOpen === i ? (
                      <ChevronDown className="w-4 h-4 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    )}
                  </button>
                  {faqOpen === i && (
                    <div className="px-4 pb-4 pt-0 text-slate-600 text-sm">
                      {a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <p className="text-xs text-slate-500 pt-4">
            Cal un compte Google per entrar. Si no en tens, pots crear-ne un a{" "}
            <a
              href="https://accounts.google.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline hover:text-primary-700"
            >
              accounts.google.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
