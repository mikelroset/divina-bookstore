import React from "react";
import { BookMarked, Users, Clock } from "lucide-react";
import { COMMUNITY_READERS } from "../../utils/constants";
import { getDaysReading, calculateProgress } from "../../utils/helpers";

export const CommunityView = ({ currentUser, userBooks }) => {
  const currentUserReading = userBooks.find((b) => b.status === "reading");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-slate-800 mb-2">
          Comunitat de Lectors
        </h2>
        <p className="text-slate-600">
          Descobreix què està llegint la comunitat ara mateix
        </p>
      </div>

      {currentUserReading && (
        <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-amber-300 shadow-lg">
          <h3 className="text-sm font-medium text-amber-800 uppercase tracking-wide mb-4">
            Estàs llegint
          </h3>
          <div className="flex gap-4">
            <img
              src={currentUserReading.coverUrl}
              alt={currentUserReading.title}
              className="w-28 h-40 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h4 className="font-serif text-2xl text-slate-800 mb-1">
                {currentUserReading.title}
              </h4>
              <p className="text-slate-600 mb-1">{currentUserReading.author}</p>
              <span className="inline-block px-3 py-1 bg-white/80 rounded-full text-xs font-medium text-slate-700 mb-3">
                {currentUserReading.genre}
              </span>
              {currentUserReading.currentPage && currentUserReading.pages && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-slate-700 mb-2">
                    <span>{currentUserReading.currentPage} pàgines</span>
                    <span>
                      {calculateProgress(
                        currentUserReading.currentPage,
                        currentUserReading.pages,
                      )}
                      %
                    </span>
                  </div>
                  <div className="bg-white/60 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all"
                      style={{
                        width: `${calculateProgress(currentUserReading.currentPage, currentUserReading.pages)}%`,
                      }}
                    />
                  </div>
                  {currentUserReading.startDate && (
                    <p className="text-xs text-slate-600 mt-2">
                      Fa {getDaysReading(currentUserReading.startDate)} dies
                      llegint
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-serif text-slate-800 mb-4">
          Altres lectors ara mateix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMUNITY_READERS.map((reader) => (
            <div
              key={reader.uid}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-amber-200 shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={reader.photoURL}
                  alt={reader.displayName}
                  className="w-12 h-12 rounded-full border-2 border-amber-300"
                />
                <div>
                  <h4 className="font-medium text-slate-800">
                    {reader.displayName}
                  </h4>
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
                  <div className="mt-2">
                    <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
                      <div
                        className="bg-slate-600 h-full rounded-full"
                        style={{
                          width: `${calculateProgress(reader.currentBook.currentPage, reader.currentBook.pages)}%`,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>
                        {reader.currentBook.currentPage} /{" "}
                        {reader.currentBook.pages}
                      </span>
                      <span>
                        {calculateProgress(
                          reader.currentBook.currentPage,
                          reader.currentBook.pages,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 shadow-lg">
        <h3 className="text-lg font-serif text-slate-800 mb-4">
          Estadístiques de la Comunitat
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-3xl font-serif text-slate-800">
              {COMMUNITY_READERS.length + 1}
            </p>
            <p className="text-sm text-slate-600">Lectors actius</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-serif text-slate-800">
              {COMMUNITY_READERS.length + 1}
            </p>
            <p className="text-sm text-slate-600">Llibres en curs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-serif text-slate-800">65%</p>
            <p className="text-sm text-slate-600">Progrés mitjà</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-serif text-slate-800">4</p>
            <p className="text-sm text-slate-600">Gèneres diversos</p>
          </div>
        </div>
      </div>
    </div>
  );
};
