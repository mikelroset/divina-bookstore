import React from "react";
import { Clock } from "lucide-react";
import { getDaysReading, calculateProgress } from "../../utils/helpers";

export const ReaderCard = ({ reader }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-primary-500 shadow-lg hover:shadow-xl transition-all">
      <div className="flex items-center gap-3 mb-4">
        <img
          src={reader.photoURL}
          alt={reader.displayName}
          className="w-12 h-12 rounded-full border-2 border-primary-500"
        />
        <div>
          <h4 className="font-medium text-slate-800">{reader.displayName}</h4>
          <p className="text-xs text-slate-500">està llegint</p>
        </div>
      </div>

      <div className="flex gap-3">
        <img
          src={reader.currentBook.coverUrl}
          alt={reader.currentBook.title}
          className="w-20 h-28 object-cover rounded-lg shadow-md"
        />
        <div className="flex-1">
          <h5 className="font-serif text-lg text-slate-800 mb-1 line-clamp-2">
            {reader.currentBook.title}
          </h5>
          <p className="text-sm text-slate-600 mb-2">
            {reader.currentBook.author}
          </p>
          <span className="inline-block px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-700 mb-2">
            {reader.currentBook.genre}
          </span>

          {/* Progress Bar */}
          <div className="mt-2">
            <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
              <div
                className="bg-slate-600 h-full rounded-full transition-all"
                style={{
                  width: `${calculateProgress(
                    reader.currentBook.currentPage,
                    reader.currentBook.pages,
                  )}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>
                {reader.currentBook.currentPage} / {reader.currentBook.pages}
              </span>
              <span>
                {calculateProgress(
                  reader.currentBook.currentPage,
                  reader.currentBook.pages,
                )}
                %
              </span>
            </div>
            {reader.currentBook.startDate && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                {/* <Clock className="w-3 h-3" /> */}
                ⏱️ {getDaysReading(reader.currentBook.startDate)} dies
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
