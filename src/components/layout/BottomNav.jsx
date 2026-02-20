import React from "react";
import { Home, Library, Users, PlusCircle, User } from "lucide-react";
import { VIEW_IDS } from "../../utils/constants";

const navItems = [
  { id: VIEW_IDS.HOME, Icon: Home, label: "Inici" },
  { id: VIEW_IDS.LIBRARY, Icon: Library, label: "Biblioteca" },
  { id: VIEW_IDS.COMMUNITY, Icon: Users, label: "Comunitat" },
  { id: VIEW_IDS.ADD, Icon: PlusCircle, label: "Afegir" },
  { id: VIEW_IDS.PROFILE, Icon: User, label: "Perfil" },
];

export const BottomNav = ({ currentView, setCurrentView, setEditingBook }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-primary-500 shadow-lg">
      <div className="max-w-4xl mx-auto px-3 py-3 flex justify-around">
        {navItems.map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              setCurrentView(id);
              if (id !== VIEW_IDS.ADD) setEditingBook(null);
            }}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              currentView === id
                ? "text-primary-600 bg-primary-50"
                : "text-slate-600 hover:text-primary-600 hover:bg-primary-50/50"
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
