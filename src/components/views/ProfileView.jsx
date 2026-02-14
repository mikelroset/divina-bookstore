import React from "react";

export const ProfileView = ({ user, onLogout, stats }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-slate-800 mb-2">
          El Meu Perfil
        </h2>
        <p className="text-slate-600">Informació del teu compte</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-20 h-20 rounded-full border-4 border-amber-300 shadow-lg"
          />
          <div>
            <h3 className="text-2xl font-serif text-slate-800">
              {user.displayName}
            </h3>
            <p className="text-slate-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-slate-600 mb-1">Total de Llibres</p>
            <p className="text-3xl font-serif text-slate-800">
              {stats.totalBooks}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-sm text-slate-600 mb-1">Llibres Completats</p>
            <p className="text-3xl font-serif text-slate-800">
              {stats.completedBooks}
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          Tancar Sessió
        </button>
      </div>
    </div>
  );
};
