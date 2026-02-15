import React from "react";
import { Home, Library, Users, PlusCircle, User } from "lucide-react";

export const BottomNav = ({ currentView, setCurrentView, setEditingBook }) => {
  const navItems = [
    { id: "home", icon: "Home", label: "Inici" },
    { id: "library", icon: "Library", label: "Biblioteca" },
    { id: "community", icon: "Users", label: "Comunitat" },
    { id: "add", icon: "PlusCircle", label: "Afegir" },
    { id: "profile", icon: "User", label: "Perfil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-primary-500 shadow-lg">
      <div className="max-w-4xl mx-auto px-3 py-3 flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentView(item.id);
              if (item.id !== "add") setEditingBook(null);
            }}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              currentView === item.id
                ? "text-primary-600 bg-primary-50"
                : "text-slate-600 hover:text-primary-600 hover:bg-primary-50/50"
            }`}
          >
            {/* Aquí aniria <item.icon className="w-6 h-6" /> */}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
