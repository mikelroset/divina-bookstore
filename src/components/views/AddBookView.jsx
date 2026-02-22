import React from "react";
import { coverService } from "../../services/coverService";
import { descriptionService } from "../../services/descriptionService";
import { BOOK_GENRES } from "../../utils/constants";
import { computeETA, getWeeklyProgress } from "../../utils/readingInsights";
import { BookForm } from "../forms/BookForm";

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

export const AddBookView = ({ onSave, onCancel, editingBook }) => {
  const handleSearchCover = async (title, author) => {
    let coverUrl = await coverService.searchCover(title, author);
    if (!coverUrl) {
      coverUrl = await coverService.searchCoverGoogle(title, author);
    }
    return coverUrl || null;
  };

  const handleSearchDescription = async (title, author) => {
    return await descriptionService.searchDescription(title, author);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-slate-800 mb-2">
            {editingBook ? "Editar Llibre" : "Afegir Nou Llibre"}
          </h2>
          <p className="text-slate-600">Completa la informació del llibre</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          type="button"
          aria-label="Tancar"
        >
          ✕
        </button>
      </div>

      {editingBook?.status === "reading" && editingBook?.pages > 0 && (
        <div className="bg-primary-50/80 rounded-xl p-4 border border-primary-200 text-sm">
          {(() => {
            const eta = computeETA(editingBook);
            if (eta) {
              return (
                <p className="text-primary-800">
                  Al teu ritme actual, acabaràs aquest llibre en {eta.daysLeft}{" "}
                  {eta.daysLeft === 1 ? "dia" : "dies"} (Data estimada: {eta.dateStr})
                </p>
              );
            }
            if (editingBook.pageLog?.length > 0) {
              return (
                <p className="text-slate-600 italic">
                  Llegeix unes quantes pàgines per calcular el teu ritme!
                </p>
              );
            }
            return null;
          })()}
          {(editingBook.pageLog?.length > 0 || editingBook.currentPage > 0) && (
            <div className="mt-3">
              <p className="text-xs text-slate-600 mb-1">Progrés última setmana</p>
              <WeeklyMiniChart data={getWeeklyProgress(editingBook.pageLog || [])} />
            </div>
          )}
        </div>
      )}
      {editingBook?.status === "reading" && (editingBook?.pages == null || editingBook?.pages === 0) && (
        <p className="text-amber-700 text-sm">
          Afegeix el número de pàgines per activar la predicció i el gràfic.
        </p>
      )}

      <BookForm
        key={editingBook?.id ?? "new"}
        initialData={editingBook}
        onSubmit={onSave}
        onCancel={onCancel}
        genreOptions={BOOK_GENRES}
        onSearchCover={handleSearchCover}
        onSearchDescription={handleSearchDescription}
      />
    </div>
  );
};
