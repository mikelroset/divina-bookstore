import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { Avatar } from "../common/Avatar";
import { ROUTES } from "../../utils/constants";
import { useTheme } from "../../context/ThemeContext";

const THEME_OPTIONS = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
];

export const Header = ({ user }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  return (
    <header className="bg-[var(--color-surface)]/80 backdrop-blur-sm border-b border-[var(--color-border)] sticky top-0 z-10 transition-colors duration-150">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          aria-label={t("header.ariaGoHome")}
        >
          <img src="/logo.svg" alt={t("header.logoAlt")} className="w-8 h-8" />
          <h1 className="text-2xl font-serif text-[var(--color-text-primary)]">
            DivinaBookStore
          </h1>
        </Link>
        <div className="flex items-center gap-3">
          <div
            className="flex rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-0.5"
            role="group"
            aria-label={t("header.ariaThemeSelector")}
          >
            {THEME_OPTIONS.map(({ value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                title={t(`header.theme${value.charAt(0).toUpperCase() + value.slice(1)}`)}
                aria-pressed={theme === value}
                className={`p-2 rounded-md transition-colors ${
                  theme === value
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden />
              </button>
            ))}
          </div>
          {user && (
            <Link
              to={ROUTES.PROFILE}
              className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity"
              aria-label={t("header.ariaGoProfile")}
            >
              <Avatar
                src={user.photoURL}
                alt={user.displayName ? t("common.avatarOf", { name: user.displayName }) : t("common.avatarUnavailable")}
                displayName={user.displayName}
                className="w-10 h-10 rounded-full border-2 border-[var(--color-primary)]"
              />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
