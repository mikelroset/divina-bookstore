import React, { useState, useEffect } from "react";
import { TrendingUp, Award, BookOpen, Heart, Flame } from "lucide-react";
import { StatCard } from "../common/StatCard";
import { ProgressBar } from "../common/ProgressBar";
import { encouragementService } from "../../services/encouragementService";
import { computeETA, getWeeklyProgress } from "../../utils/readingInsights";

function WeeklyMiniChart({ data }) {
  const withPage = data.filter((d) => d.page != null);
  const maxPage = Math.max(1, ...withPage.map((d) => d.page));
  return (
    <div className="flex items-end gap-1 h-14">
      {data.map((d) => (
        <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
          <div className="w-full h-8 flex items-end">
            <div
              className="w-full bg-primary-300 rounded-t"
              style={{
                height: d.page != null ? `${(d.page / maxPage) * 100}%` : "2px",
                minHeight: d.page != null ? "4px" : "2px",
              }}
            />
          </div>
          <span className="text-[10px] text-slate-500">
            {new Date(d.date + "T12:00:00").toLocaleDateString("ca-ES", { weekday: "short" }).slice(0, 2)}
          </span>
        </div>
      ))}
    </div>
  );
}

export const HomeView = ({ user, stats, books, annualGoal = 0, streak = 0 }) => {
  const readingBook = books.find((b) => b.status === "reading");
  const [encouragements, setEncouragements] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    encouragementService
      .getEncouragementsForUser(user.uid)
      .then(setEncouragements)
      .catch((err) => console.error("Error carregant encoratjaments:", err));
  }, [user?.uid]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-slate-800 mb-2">
          Benvingut/da!
        </h2>
        <p className="text-slate-600">
          Aquí tens un resum de la teva biblioteca
        </p>
      </div>

      {encouragements.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-lg font-serif text-slate-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary-600" />
            Encoratjaments
          </h3>
          <ul className="space-y-2">
            {encouragements.map((enc) => (
              <li
                key={enc.id}
                className="text-slate-700 py-2 border-b border-slate-100 last:border-0"
              >
                <span className="font-medium text-primary-700">
                  {enc.fromUserName ?? "Algú"}
                </span>{" "}
                t&apos;anima a seguir llegint
                {enc.bookTitle ? (
                  <> {enc.bookTitle}</>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {streak >= 0 && (
          <StatCard
            title="Ratxa"
            value={streak}
            subtitle={streak === 1 ? "dia consecutiu" : "dies consecutius"}
            color="primary"
            icon={Flame}
          />
        )}
        <StatCard
          title="Aquest Mes"
          value={stats.booksThisMonth}
          subtitle="Llibres completats"
          color="primary"
        />
        <StatCard
          title="Gènere Preferit"
          value={stats.favoriteGenre}
          subtitle="El teu favorit"
          color="slate"
        />
        <StatCard
          title="Total Llibres"
          value={stats.totalBooks}
          subtitle={`${stats.completedBooks} completats`}
          color="slate"
        />
      </div>

      {annualGoal > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-lg font-serif text-slate-800 mb-2">
            Objectiu anual
          </h3>
          <p className="text-sm text-slate-600 mb-2">
            {stats.completedBooks} / {annualGoal} llibres
          </p>
          <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-500 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round((stats.completedBooks / annualGoal) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
        <h3 className="text-lg font-serif text-slate-800 mb-4">
          Progrés Global de Lectura
        </h3>
        <ProgressBar percentage={stats.progressPercentage} />
      </div>

      {readingBook && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-lg font-serif text-slate-800 mb-4">
            Llegint Ara
          </h3>
          <div className="flex gap-4">
            <img
              src={readingBook.coverUrl}
              alt={readingBook.title}
              className="w-24 h-36 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h4 className="font-serif text-xl text-slate-800 mb-1">
                {readingBook.title}
              </h4>
              <p className="text-slate-600 text-sm mb-3">
                {readingBook.author}
              </p>
              {readingBook.currentPage != null && readingBook.pages > 0 && (
                <div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className="bg-slate-700 h-full rounded-full"
                      style={{
                        width: `${(readingBook.currentPage / readingBook.pages) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    {readingBook.currentPage} / {readingBook.pages} pàgines
                  </p>
                  {(() => {
                    const eta = computeETA(readingBook);
                    if (eta) {
                      return (
                        <p className="text-sm text-primary-700">
                          Al teu ritme actual, acabaràs aquest llibre en{" "}
                          {eta.daysLeft} {eta.daysLeft === 1 ? "dia" : "dies"} (Data
                          estimada: {eta.dateStr})
                        </p>
                      );
                    }
                    if (readingBook.pageLog && readingBook.pageLog.length > 0) {
                      return (
                        <p className="text-sm text-slate-600 italic">
                          Llegeix unes quantes pàgines per calcular el teu ritme!
                        </p>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
              {readingBook.pages == null || readingBook.pages === 0 ? (
                <p className="text-sm text-amber-700">
                  Afegeix el número de pàgines del llibre per veure progrés i
                  predicció.
                </p>
              ) : null}
            </div>
          </div>
          {readingBook.pages > 0 && (readingBook.pageLog?.length > 0 || readingBook.currentPage > 0) && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-600 mb-2">Progrés última setmana</p>
              <WeeklyMiniChart data={getWeeklyProgress(readingBook.pageLog || [])} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
