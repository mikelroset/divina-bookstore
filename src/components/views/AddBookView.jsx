import React from "react";
import { coverService } from "../../services/coverService";
import { descriptionService } from "../../services/descriptionService";
import { BOOK_GENRES } from "../../utils/constants";
import { computeETA, getWeeklyPagesRead } from "../../utils/readingInsights";
import { Box, PageTitle } from "../../design-system";
import { BookForm } from "../forms/BookForm";

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
          <PageTitle subtitle="Completa la informació del llibre">
            {editingBook ? "Editar Llibre" : "Afegir Nou Llibre"}
          </PageTitle>
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
        <Box padding="sm" className="text-sm">
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
              <WeeklyMiniChart data={getWeeklyPagesRead(editingBook.pageLog || [])} />
            </div>
          )}
        </Box>
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
