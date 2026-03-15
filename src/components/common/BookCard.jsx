import React from "react";
import { Trash2 } from "lucide-react";
import { BookCover } from "./BookCover";
import { Box, BookTitle, StarRating } from "../../design-system";
import { STATUS_LABELS, STATUS_COLORS } from "../../utils/constants";

export const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <Box padding="sm" className="flex flex-col h-full hover:shadow-xl transition-all duration-300 group">
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="relative mb-3">
          <BookCover
          src={book.coverUrl}
          alt={book.title ? `Portada de ${book.title}` : "Portada no disponible"}
        />
        <span
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[book.status]}`}
        >
          {STATUS_LABELS[book.status]}
        </span>
        </div>
      <BookTitle className="mb-1">{book.title}</BookTitle>
      <p className="text-[var(--color-text-secondary)] text-sm mb-2">{book.author}</p>
      <StarRating value={book.rating ?? 0} size="sm" className="mb-3" />
      </div>
      <div className="flex gap-2 mt-auto pt-3">
        <button
          onClick={() => onEdit(book)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--color-primary-soft)] hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] rounded-lg transition-colors"
        >
          <span className="text-sm">Editar</span>
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          aria-label="Eliminar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Box>
  );
};
