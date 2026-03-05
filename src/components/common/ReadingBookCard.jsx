import React from "react";
import { Clock, Heart } from "lucide-react";
import { BookCover } from "./BookCover";
import { Avatar } from "./Avatar";
import { getDaysReading, safeProgress } from "../../utils/helpers";

/**
 * Card independent per a un llibre en lectura.
 * Mostra lector (avatar, nom), "està llegint", portada, títol, autor, gènere, progrés i botó encoratjar.
 */
export function ReadingBookCard({
  reader,
  book,
  isCurrentUser = false,
  onEncourage,
  onBookClick,
  onReaderClick,
  isSent = false,
  isCooldown = false,
  isSending = false,
  sendError = false,
}) {
  const prog = safeProgress(book.currentPage, book.pages);

  return (
    <div
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-primary-500 shadow-lg hover:shadow-xl transition-all"
      role="article"
    >
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => onReaderClick?.(reader)}
          className="flex items-center gap-3 flex-1 min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-lg"
          aria-label={`Veure perfil de ${reader.displayName ?? reader.uid}`}
        >
          <Avatar
            src={reader.photoURL}
            alt={reader.displayName ? `Avatar de ${reader.displayName}` : "Avatar no disponible"}
            displayName={reader.displayName}
            className="w-12 h-12 rounded-full border-2 border-primary-500 flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-medium text-slate-800 truncate">
              {reader.displayName ?? reader.uid}
            </h4>
            <p className="text-xs text-slate-500">està llegint</p>
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={() => onBookClick?.(book)}
        className="w-full text-left block focus:outline-none focus:ring-2 focus:ring-primary-300 rounded-lg"
        aria-label={book.title ? `Veure detall de ${book.title}` : "Veure detall del llibre"}
      >
        <div className="flex gap-3">
          <BookCover
            src={book.coverUrl}
            alt={book.title ? `Portada de ${book.title}` : "Portada no disponible"}
            className="w-20 h-28 object-cover rounded-lg shadow-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h5 className="font-serif text-lg text-slate-800 mb-1 line-clamp-2">
              {book.title ?? "Sense títol"}
            </h5>
            {book.author && (
              <p className="text-sm text-slate-600 mb-1 line-clamp-1">{book.author}</p>
            )}
            {book.genre && (
              <span className="inline-block px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-700 mb-2">
                {book.genre}
              </span>
            )}
            <div className="mt-2">
              {prog != null ? (
                <>
                  <div className="flex justify-between text-sm text-slate-700 mb-1">
                    <span>
                      {book.currentPage ?? 0} / {book.pages ?? "—"} pàgines
                    </span>
                    <span>{prog}%</span>
                  </div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-slate-600 h-full rounded-full"
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                  {book.startDate && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getDaysReading(book.startDate)} dies
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs text-slate-500">—</p>
              )}
            </div>
          </div>
        </div>
      </button>

      {!isCurrentUser && onEncourage && (
        <button
          type="button"
          onClick={() => onEncourage(reader, book)}
          disabled={isSending || isSent || isCooldown}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-primary-100 hover:bg-primary-200 text-primary-800 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart className="w-4 h-4" />
          {isSent ? "Encoratjat ✓" : isCooldown ? "Encoratjat" : isSending ? "Enviant..." : sendError ? "Error. Torna-ho a intentar" : "Encoratja"}
        </button>
      )}
    </div>
  );
}
