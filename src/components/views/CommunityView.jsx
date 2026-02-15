import React, { useState, useEffect } from "react";
import { BookMarked, Users, Clock } from "lucide-react";
import { getDaysReading, calculateProgress } from "../../utils/helpers";
import { communityService } from "../../services/communityService";

export const CommunityView = ({ currentUser, userBooks }) => {
  const [communityReaders, setCommunityReaders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserReading = userBooks.find((b) => b.status === "reading");

  // Carregar lectors de la comunitat (tots, incloent el propi usuari)
  useEffect(() => {
    const loadCommunity = async () => {
      try {
        setLoading(true);
        const readers = await communityService.getCommunityReaders();
        // Mostrar TOTS els lectors (sense filtrar) - cada usuari apareix amb un indicador "(Tu)" si és ell
        setCommunityReaders(readers);
      } catch (error) {
        console.error("Error carregant comunitat:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [currentUser?.uid]);

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

      {/* Llibre actual de l'usuari */}
      {currentUserReading && (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-primary-500 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-5 h-5 text-primary-600" />
            <h3 className="text-sm font-medium text-primary-800 uppercase tracking-wide">
              Estàs llegint
            </h3>
          </div>
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
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all"
                      style={{
                        width: `${calculateProgress(currentUserReading.currentPage, currentUserReading.pages)}%`,
                      }}
                    />
                  </div>
                  {currentUserReading.startDate && (
                    <p className="text-xs text-slate-600 mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
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

      {/* Tots els lectors */}
      <div>
        <h3 className="text-xl font-serif text-slate-800 mb-4 flex items-center gap-2">
          <Users className="w-6 h-6 text-slate-700" />
          Tots els lectors ara mateix
        </h3>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
            <p className="text-slate-600 mt-4">Carregant comunitat...</p>
          </div>
        ) : communityReaders.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-primary-500 shadow-lg text-center">
            <Users className="w-16 h-16 mx-auto text-slate-300 mb-4" />
            <h4 className="text-lg font-serif text-slate-800 mb-2">
              Encara no hi ha lectors actius
            </h4>
            <p className="text-slate-600">
              Sigues el primer en compartir què estàs llegint!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {communityReaders.map((reader) => (
              <div
                key={reader.uid}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-5 border shadow-lg hover:shadow-xl transition-all ${
                  reader.uid === currentUser?.uid
                    ? "border-2 border-primary-500"
                    : "border-primary-500"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={reader.photoURL}
                    alt={reader.displayName}
                    className="w-12 h-12 rounded-full border-2 border-primary-500"
                  />
                  <div>
                    <h4 className="font-medium text-slate-800 flex items-center gap-2">
                      {reader.displayName}
                      {reader.uid === currentUser?.uid && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                          Tu
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500">està llegint</p>
                  </div>
                </div>

                {reader.currentBook && (
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
                        {reader.currentBook.startDate && (
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getDaysReading(reader.currentBook.startDate)} dies
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estadístiques */}
      {!loading && communityReaders.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-lg font-serif text-slate-800 mb-4">
            Estadístiques de la Comunitat
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-serif text-slate-800">
                {communityReaders.length}
              </p>
              <p className="text-sm text-slate-600">Lectors actius</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-slate-800">
                {communityReaders.length}
              </p>
              <p className="text-sm text-slate-600">Llibres en curs</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-slate-800">
                {Math.round(
                  communityReaders.reduce(
                    (sum, r) =>
                      sum +
                      calculateProgress(
                        r.currentBook?.currentPage,
                        r.currentBook?.pages,
                      ),
                    0,
                  ) / communityReaders.length,
                )}
                %
              </p>
              <p className="text-sm text-slate-600">Progrés mitjà</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-serif text-slate-800">
                {
                  new Set(
                    communityReaders
                      .map((r) => r.currentBook?.genre)
                      .filter(Boolean),
                  ).size
                }
              </p>
              <p className="text-sm text-slate-600">Gèneres diversos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
