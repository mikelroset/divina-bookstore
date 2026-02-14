import React from "react";
import { Star, Edit2, Trash2 } from "lucide-react";
import { STATUS_LABELS, STATUS_COLORS } from "../../utils/constants";

export const BookCard = ({ book, onEdit, onDelete }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="relative mb-3">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-48 object-cover rounded-xl shadow-md"
        />
        <span
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[book.status]}`}
        >
          {STATUS_LABELS[book.status]}
        </span>
      </div>
      <h3 className="font-serif text-lg text-slate-800 mb-1 line-clamp-2">
        {book.title}
      </h3>
      <p className="text-slate-600 text-sm mb-2">{book.author}</p>
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <span key={i}>⭐</span>
          // En el fitxer real seria: <Star className={`w-4 h-4 ${i < book.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(book)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg transition-colors"
        >
          <span className="text-sm">Editar</span>
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
