import React from "react";

export const ProfileView = ({ user, onLogout, stats, annualGoal = 0, setAnnualGoal }) => {
  const completed = stats?.completedBooks ?? 0;
  const goal = Math.max(0, parseInt(annualGoal, 10) || 0);
  const progressPct = goal > 0 ? Math.min(100, Math.round((completed / goal) * 100)) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-slate-800 mb-2">
          El Meu Perfil
        </h2>
        <p className="text-slate-600">Informació del teu compte</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-20 h-20 rounded-full border-4 border-primary-500 shadow-lg"
          />
          <div>
            <h3 className="text-2xl font-serif text-slate-800">
              {user.displayName}
            </h3>
            <p className="text-slate-600">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-500">
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

        {setAnnualGoal && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Objectiu de llibres aquest any
            </label>
            <input
              type="number"
              min={0}
              value={goal}
              onChange={(e) => setAnnualGoal(e.target.value)}
              className="w-full rounded-xl border border-primary-500 px-4 py-2 text-slate-800"
            />
          </div>
        )}

        {goal > 0 && (
          <div className="mb-6">
            <p className="text-sm text-slate-600 mb-2">
              Progrés anual: {completed} / {goal} llibres
            </p>
            <div className="bg-slate-100 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary-500 h-full rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

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
