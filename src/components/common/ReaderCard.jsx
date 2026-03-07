import React from "react";
import { getDaysReading, calculateProgress } from "../../utils/helpers";
import { Avatar } from "./Avatar";
import { BookCover } from "./BookCover";

export const ReaderCard = ({ reader }) => {
  if (!reader?.currentBook) return null;

  const book = reader.currentBook;
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-primary-500 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-4">
        <Avatar
          src={reader.photoURL}
          alt={reader.displayName ? `Avatar de ${reader.displayName}` : "Avatar no disponible"}
          displayName={reader.displayName}
          className="w-12 h-12 rounded-full border-2 border-primary-500"
        />
        <div>
          <h4 className="font-medium text-slate-800">{reader.displayName}</h4>
          <p className="text-xs text-slate-500">està llegint</p>
        </div>
      </div>

      <div className="flex gap-3">
        <BookCover
          src={book.coverUrl}
          alt={book.title ? `Portada de ${book.title}` : "Portada no disponible"}
          className="w-20 h-28 object-cover rounded-lg shadow-md"
        />
        <div className="flex-1">
          <h5 className="font-serif text-lg text-slate-800 mb-1 line-clamp-2">
            {book.title ?? ""}
          </h5>
          <p className="text-sm text-slate-600 mb-2">
            {book.author ?? ""}
          </p>
          {book.genre && (
            <span className="inline-block px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-700 mb-2">
              {book.genre}
            </span>
          )}

          {/* Progress Bar */}
          <div className="mt-2">
            <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
              <div
                className="bg-slate-600 h-full rounded-full transition-all"
                style={{
                  width: `${calculateProgress(book.currentPage, book.pages)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>
                {book.currentPage ?? 0} / {book.pages ?? 0}
              </span>
              <span>
                {calculateProgress(book.currentPage, book.pages)}%
              </span>
            </div>
            {book.startDate && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                ⏱️ {getDaysReading(book.startDate)} dies
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
