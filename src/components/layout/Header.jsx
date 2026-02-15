// ============================================
// FILE: src/components/layout/Header.jsx
// ============================================
import React from "react";

export const Header = ({ user }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-primary-500 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-serif text-slate-800">
            DivinaBookStore
          </h1>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-10 h-10 rounded-full border-2 border-primary-500"
            />
          </div>
        )}
      </div>
    </header>
  );
};
