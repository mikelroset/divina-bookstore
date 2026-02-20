import React from "react";
import { coverService } from "../../services/coverService";
import { descriptionService } from "../../services/descriptionService";
import { BOOK_GENRES } from "../../utils/constants";
import { BookForm } from "../forms/BookForm";

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
