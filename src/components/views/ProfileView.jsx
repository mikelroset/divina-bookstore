import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../common/Avatar";
import { useSuperadmin } from "../../hooks/useSuperadmin";
import { useGamification } from "../../hooks/useGamification";
import { ROUTES } from "../../utils/constants";

export const ProfileView = ({ user, onLogout, stats, annualGoal = 0, setAnnualGoal }) => {
  const navigate = useNavigate();
  const { isSuperadmin, loading } = useSuperadmin(user?.uid);
  const { totalPoints, level, levelDisplayName, levelColorClass, toNextLevel, toNextLevelProgressPct, nextLevelDisplayName, showInLeaderboard, setShowInLeaderboard, loading: gamificationLoading } = useGamification(user?.uid);
  const completed = stats?.completedBooks ?? 0;
  const goal = Math.max(0, parseInt(annualGoal, 10) || 0);
  const progressPct = goal > 0 ? Math.min(100, Math.round((completed / goal) * 100)) : 0;

  const [inputStr, setInputStr] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputStr(goal > 0 ? String(goal) : "");
    }
  }, [goal, isFocused]);

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
          <Avatar
            src={user.photoURL}
            alt={user.displayName ? `Avatar de ${user.displayName}` : "Avatar no disponible"}
            displayName={user.displayName}
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
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-500">
            <p className="text-sm text-slate-600 mb-1">Llibres Completats</p>
            <p className="text-3xl font-serif text-slate-800">
              {stats.completedBooks}
            </p>
          </div>
        </div>

        {!gamificationLoading && (
          <div className="mb-6 space-y-4">
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-500">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-slate-600">Punts totals</p>
                <p className="text-2xl font-serif text-primary-800">{totalPoints}</p>
              </div>
              <p className={`text-sm mb-2 font-medium ${levelColorClass}`}>
                {levelDisplayName}
              </p>
              {toNextLevel > 0 && nextLevelDisplayName && (
                <div className="space-y-1">
                  <p className="text-xs text-slate-600">
                    Progrés cap a {nextLevelDisplayName}: {toNextLevelProgressPct}%
                  </p>
                  <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, Math.max(0, toNextLevelProgressPct))}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showInLeaderboard}
                onChange={(e) => setShowInLeaderboard(e.target.checked)}
                className="rounded border-primary-500 text-primary-600 focus:ring-primary-200"
              />
              <span className="text-sm text-slate-700">Aparèixer al rànquing</span>
            </label>
          </div>
        )}

        {setAnnualGoal && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Objectiu de llibres aquest any
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={inputStr}
              onChange={(e) => setInputStr(e.target.value.replace(/\D/g, ""))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                const num = Math.max(0, parseInt(inputStr, 10) || 0);
                setAnnualGoal(num);
                setInputStr(num > 0 ? String(num) : "");
              }}
              placeholder="0"
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

        {!loading && isSuperadmin && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ADMIN_COMMUNITIES)}
              className="w-full bg-primary-100 hover:bg-primary-200 text-primary-800 py-3 rounded-xl font-medium border border-primary-500 transition-all"
            >
              Gestió de comunitats
            </button>
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
