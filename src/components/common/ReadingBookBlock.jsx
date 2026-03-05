import React, { useState, useEffect } from "react";
import { BookMarked } from "lucide-react";
import { BookCover } from "./BookCover";
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

export function ReadingBookBlock({ book, onUpdateCurrentPage }) {
  const [currentPageInput, setCurrentPageInput] = useState("");
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const val = book.currentPage ?? 0;
    setCurrentPageInput(String(val));
    setSaveError(null);
  }, [book?.id, book?.currentPage]);

  const handleSave = async () => {
    if (!onUpdateCurrentPage) return;
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
    const current = book.currentPage ?? 0;
    if (parsed < current) {
      setSaveError("El valor no pot ser menor que el progrés actual.");
      return;
    }
    const totalPages = book.pages;
    if (totalPages != null && totalPages > 0 && parsed > totalPages) {
      setSaveError(`El valor no pot ser major que el total de pàgines (${totalPages}).`);
      return;
    }
    setSaveError(null);
    setSaving(true);
    try {
      await onUpdateCurrentPage(book.id, parsed);
    } catch (err) {
      setSaveError("Error al desar. Torna-ho a intentar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
    <div className="flex gap-4">
      <BookCover
        src={book.coverUrl}
        alt={book.title ? `Portada de ${book.title}` : "Portada no disponible"}
        className="w-24 h-36 object-cover rounded-lg shadow-md"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-xl text-slate-800 mb-1">{book.title}</h4>
        <p className="text-slate-600 text-sm mb-3">{book.author}</p>
        {book.currentPage != null && book.pages > 0 && (
          <div>
            <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
              <div
                className="bg-slate-700 h-full rounded-full"
                style={{
                  width: `${(book.currentPage / book.pages) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-slate-600 mb-2">
              {book.currentPage} / {book.pages} pàgines
            </p>
            {(() => {
              const eta = computeETA(book);
              if (eta) {
                return (
                  <p className="text-sm text-primary-700">
                    Al teu ritme actual, acabaràs aquest llibre en{" "}
                    {eta.daysLeft} {eta.daysLeft === 1 ? "dia" : "dies"} (Data
                    estimada: {eta.dateStr})
                  </p>
                );
              }
              if (book.pageLog && book.pageLog.length > 0) {
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
        {book.pages == null || book.pages === 0 ? (
          <p className="text-sm text-amber-700">
            Afegeix el número de pàgines del llibre per veure progrés i
            predicció.
          </p>
        ) : null}
        {onUpdateCurrentPage && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <label className="text-sm text-slate-600 sr-only" htmlFor={`home-current-page-${book.id}`}>
              Pàgines llegides
            </label>
            <input
              id={`home-current-page-${book.id}`}
              type="number"
              min={0}
              max={book.pages > 0 ? book.pages : undefined}
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
              onClick={handleSave}
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
      {book.pages > 0 && (book.pageLog?.length > 0 || book.currentPage > 0) && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-600 mb-2">Progrés última setmana</p>
          <WeeklyMiniChart data={getWeeklyPagesRead(book.pageLog || [])} />
        </div>
      )}
    </div>
  );
}
