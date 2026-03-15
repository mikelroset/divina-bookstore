import React from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { Home, Library, Users, Star, User } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const navKeys = [
  { to: ROUTES.HOME, Icon: Home, key: "nav.home" },
  { to: ROUTES.LIBRARY, Icon: Library, key: "nav.library" },
  { to: ROUTES.COMMUNITY, Icon: Users, key: "nav.community" },
  { to: ROUTES.REVIEWS, Icon: Star, key: "nav.reviews" },
  { to: ROUTES.PROFILE, Icon: User, key: "nav.profile" },
];

export const BottomNav = ({ encouragementCount = 0 }) => {
  const { t } = useTranslation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--color-surface)]/90 backdrop-blur-sm border-t border-[var(--color-border)] shadow-lg transition-colors duration-150">
      <div className="max-w-4xl mx-auto px-3 py-3 flex justify-around">
        {navKeys.map(({ to, Icon, key }) => {
          const showEncouragementBadge =
            to === ROUTES.HOME && encouragementCount > 0;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.HOME}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all relative ${
                  isActive
                    ? "text-[var(--color-primary)] bg-[var(--color-bg-secondary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)]/50"
                }`
              }
            >
              <span className="relative inline-block">
                <Icon className="w-6 h-6" />
                {showEncouragementBadge && (
                  <span
                    className="absolute -top-1.5 -right-2 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-xs font-bold"
                    aria-label={t("nav.ariaEncouragements", { count: encouragementCount })}
                  >
                    {encouragementCount > 99 ? "99+" : encouragementCount}
                  </span>
                )}
              </span>
              <span className="text-xs font-medium">{t(key)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
