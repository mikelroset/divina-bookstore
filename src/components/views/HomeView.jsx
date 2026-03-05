import React, { useState, useEffect } from "react";
import { TrendingUp, Award, BookOpen, Heart, Flame, Calendar, Tag, Target, BarChart2, BookMarked } from "lucide-react";
import { BookCover } from "../common/BookCover";
import { StatCard } from "../common/StatCard";
import { ProgressBar } from "../common/ProgressBar";
import { encouragementService } from "../../services/encouragementService";
import { computeETA, getWeeklyPagesRead } from "../../utils/readingInsights";

function WeeklyMiniChart({ data }) {
  const maxPages = Math.max(1, ...data.map((d) => d.pagesRead ?? 0));
  const hasData = data.some((d) => (d.pagesRead ?? 0) > 0);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d) => {
        const pagesRead = d.pagesRead ?? 0;
        const heightPct = maxPages > 0 ? (pagesRead / maxPages) * 100 : 0;
        return (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-0.5">
            <div className="w-full h-9 flex flex-col justify-end items-center gap-0.5">
              {hasData && (
                <span className="text-[10px] font-medium text-slate-700 leading-none">
                  {pagesRead}
                </span>
              )}
              <div className="w-full h-6 flex items-end">
                <div
                  className="w-full bg-primary-300 rounded-t"
                  style={{
                    height: heightPct > 0 ? `${Math.max(heightPct, 8)}%` : "2px",
                    minHeight: heightPct > 0 ? "4px" : "2px",
                  }}
                />
              </div>
            </div>
            <span className="text-[10px] text-slate-500">
              {new Date(d.date + "T12:00:00").toLocaleDateString("ca-ES", { weekday: "short" }).slice(0, 2)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export const HomeView = ({ user, stats, books, annualGoal = 0, streak = 0, onUpdateCurrentPage }) => {
  const readingBook = books.find((b) => b.status === "reading");
  const [encouragements, setEncouragements] = useState([]);
  const [currentPageInput, setCurrentPageInput] = useState("");
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (readingBook) {
      const val = readingBook.currentPage ?? 0;
      setCurrentPageInput(String(val));
      setSaveError(null);
    }
  }, [readingBook?.id, readingBook?.currentPage]);

  useEffect(() => {
    if (!user?.uid) return;
    encouragementService
      .getEncouragementsForUser(user.uid)
      .then(setEncouragements)
      .catch((err) => console.error("Error carregant encoratjaments:", err));
  }, [user?.uid]);

  const handleSaveCurrentPage = async () => {
    if (!readingBook || !onUpdateCurrentPage) return;
    const trimmed = currentPageInput.trim();
    if (trimmed === "") {
      setSaveError("Introdueix un número de pàgines.");
      return;
    }
    const parsed = parseInt(trimmed, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setSaveError("El valor ha de ser un número igual o superior a 0.");
      return;
    }
    const current = readingBook.currentPage ?? 0;
    if (parsed < current) {
      setSaveError("El valor no pot ser menor que el progrés actual.");
      return;
    }
    const totalPages = readingBook.pages;
    if (totalPages != null && totalPages > 0 && parsed > totalPages) {
      setSaveError(`El valor no pot ser major que el total de pàgines (${totalPages}).`);
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      await onUpdateCurrentPage(readingBook.id, parsed);
    } catch (err) {
      setSaveError("Error al desar. Torna-ho a intentar.");
    } finally {
      setSaving(false);
    }
  };

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
          title="Aquest mes"
          value={stats.booksThisMonth}
          subtitle="Llibres completats"
          color="primary"
          icon={Calendar}
        />
        <StatCard
          title="Gènere preferit"
          value={stats.favoriteGenre}
          subtitle="El teu favorit"
          color="primary"
          icon={Tag}
        />
        <StatCard
          title="Total llibres"
          value={stats.totalBooks}
          subtitle={`${stats.completedBooks} completats`}
          color="primary"
          icon={BookOpen}
        />
      </div>

      {annualGoal > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-3">
            <Target className="w-6 h-6 text-primary-600" />
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
        <h3 className="text-sm font-medium text-slate-600 mb-4 flex items-center gap-3">
          <BarChart2 className="w-6 h-6 text-primary-600" />
          Progrés global de lectura
        </h3>
        <ProgressBar percentage={stats.progressPercentage} />
      </div>

      {readingBook && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-sm font-medium text-slate-600 mb-4 flex items-center gap-3">
            <BookMarked className="w-6 h-6 text-primary-600" />
            Llegint ara
          </h3>
          <div className="flex gap-4">
            <BookCover
              src={readingBook.coverUrl}
              alt={readingBook.title ? `Portada de ${readingBook.title}` : "Portada no disponible"}
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
              {onUpdateCurrentPage && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label className="text-sm text-slate-600 sr-only" htmlFor="home-current-page">
                    Pàgines llegides
                  </label>
                  <input
                    id="home-current-page"
                    type="number"
                    min={0}
                    max={readingBook.pages > 0 ? readingBook.pages : undefined}
                    value={currentPageInput}
                    onChange={(e) => {
                      setCurrentPageInput(e.target.value);
                      setSaveError(null);
                    }}
                    disabled={saving}
                    className="w-20 px-2 py-1.5 text-sm border border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-200 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={handleSaveCurrentPage}
                    disabled={saving}
                    className="px-3 py-1.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    {saving ? "Desant…" : "Actualitza progrés"}
                  </button>
                  {saveError && (
                    <p className="text-sm text-red-600 w-full" role="alert">
                      {saveError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          {readingBook.pages > 0 && (readingBook.pageLog?.length > 0 || readingBook.currentPage > 0) && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-600 mb-2">Progrés última setmana</p>
              <WeeklyMiniChart data={getWeeklyPagesRead(readingBook.pageLog || [])} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
