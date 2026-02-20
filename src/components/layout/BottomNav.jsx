import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Library, Users, PlusCircle, User } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const navItems = [
  { to: ROUTES.HOME, Icon: Home, label: "Inici" },
  { to: ROUTES.LIBRARY, Icon: Library, label: "Biblioteca" },
  { to: ROUTES.COMMUNITY, Icon: Users, label: "Comunitat" },
  { to: ROUTES.ADD, Icon: PlusCircle, label: "Afegir" },
  { to: ROUTES.PROFILE, Icon: User, label: "Perfil" },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-primary-500 shadow-lg">
      <div className="max-w-4xl mx-auto px-3 py-3 flex justify-around">
        {navItems.map(({ to, Icon, label }) => {
          const addIsActive =
            to === ROUTES.ADD
              ? (_, location) =>
                  location.pathname === ROUTES.ADD ||
                  location.pathname.startsWith(`${ROUTES.ADD}/`)
              : undefined;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === ROUTES.HOME}
              isActive={addIsActive}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "text-primary-600 bg-primary-50"
                    : "text-slate-600 hover:text-primary-600 hover:bg-primary-50/50"
                }`
              }
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
