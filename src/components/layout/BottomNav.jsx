import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Library, Users, Star, User } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const navItems = [
  { to: ROUTES.HOME, Icon: Home, label: "Inici" },
  { to: ROUTES.LIBRARY, Icon: Library, label: "Biblioteca" },
  { to: ROUTES.COMMUNITY, Icon: Users, label: "Comunitat" },
  { to: ROUTES.REVIEWS, Icon: Star, label: "Ressenyes" },
  { to: ROUTES.PROFILE, Icon: User, label: "Perfil" },
];

export const BottomNav = ({ encouragementCount = 0 }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-primary-500 shadow-lg">
      <div className="max-w-4xl mx-auto px-3 py-3 flex justify-around">
        {navItems.map(({ to, Icon, label }) => {
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
                    ? "text-primary-600 bg-primary-50"
                    : "text-slate-600 hover:text-primary-600 hover:bg-primary-50/50"
                }`
              }
            >
              <span className="relative inline-block">
                <Icon className="w-6 h-6" />
                {showEncouragementBadge && (
                  <span
                    className="absolute -top-1.5 -right-2 min-w-[1.25rem] h-5 px-1 flex items-center justify-center rounded-full bg-primary-500 text-white text-xs font-bold"
                    aria-label={`${encouragementCount} encoratjaments`}
                  >
                    {encouragementCount > 99 ? "99+" : encouragementCount}
                  </span>
                )}
              </span>
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
