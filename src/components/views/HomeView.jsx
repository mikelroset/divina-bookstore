import React, { useState, useEffect } from "react";
import { TrendingUp, Award, BookOpen, Heart } from "lucide-react";
import { StatCard } from "../common/StatCard";
import { ProgressBar } from "../common/ProgressBar";
import { encouragementService } from "../../services/encouragementService";

export const HomeView = ({ user, stats, books }) => {
  const readingBook = books.find((b) => b.status === "reading");
  const [encouragements, setEncouragements] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    encouragementService
      .getEncouragementsForUser(user.uid)
      .then(setEncouragements)
      .catch((err) => console.error("Error carregant encoratjaments:", err));
  }, [user?.uid]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif text-slate-800 mb-2">
          Benvingut/da!
        </h2>
        <p className="text-slate-600">
          Aquí tens un resum de la teva biblioteca
        </p>
      </div>

      {encouragements.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-lg font-serif text-slate-800 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary-600" />
            Encoratjaments
          </h3>
          <ul className="space-y-2">
            {encouragements.map((enc) => (
              <li
                key={enc.id}
                className="text-slate-700 py-2 border-b border-slate-100 last:border-0"
              >
                <span className="font-medium text-primary-700">
                  {enc.fromUserName ?? "Algú"}
                </span>{" "}
                t&apos;anima a seguir llegint
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Aquest Mes"
          value={stats.booksThisMonth}
          subtitle="Llibres completats"
          color="primary"
        />
        <StatCard
          title="Gènere Preferit"
          value={stats.favoriteGenre}
          subtitle="El teu favorit"
          color="slate"
        />
        <StatCard
          title="Total Llibres"
          value={stats.totalBooks}
          subtitle={`${stats.completedBooks} completats`}
          color="slate"
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
        <h3 className="text-lg font-serif text-slate-800 mb-4">
          Progrés Global de Lectura
        </h3>
        <ProgressBar percentage={stats.progressPercentage} />
      </div>

      {readingBook && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-lg font-serif text-slate-800 mb-4">
            Llegint Ara
          </h3>
          <div className="flex gap-4">
            <img
              src={readingBook.coverUrl}
              alt={readingBook.title}
              className="w-24 h-36 object-cover rounded-lg shadow-md"
            />
            <div className="flex-1">
              <h4 className="font-serif text-xl text-slate-800 mb-1">
                {readingBook.title}
              </h4>
              <p className="text-slate-600 text-sm mb-3">
                {readingBook.author}
              </p>
              {readingBook.currentPage && readingBook.pages && (
                <div>
                  <div className="bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                    <div
                      className="bg-slate-700 h-full rounded-full"
                      style={{
                        width: `${(readingBook.currentPage / readingBook.pages) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-600">
                    {readingBook.currentPage} / {readingBook.pages} pàgines
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
