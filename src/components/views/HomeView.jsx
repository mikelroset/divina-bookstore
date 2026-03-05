import React, { useState, useEffect } from "react";
import { TrendingUp, Award, BookOpen, Heart, Flame, Calendar, Tag, Target, BarChart2, BookMarked } from "lucide-react";
import { StatCard } from "../common/StatCard";
import { ProgressBar } from "../common/ProgressBar";
import { ReadingBookBlock } from "../common/ReadingBookBlock";
import { encouragementService } from "../../services/encouragementService";

export const HomeView = ({ user, stats, books, annualGoal = 0, streak = 0, onUpdateCurrentPage }) => {
  const readingBooks = books.filter((b) => b.status === "reading");
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
                {enc.bookTitle ? (
                  <> {enc.bookTitle}</>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {streak >= 0 && (
          <StatCard
            title="Ratxa"
            value={streak}
            subtitle={streak === 1 ? "dia consecutiu" : "dies consecutius"}
            color="primary"
            icon={Flame}
          />
        )}
        <StatCard
          title="Aquest mes"
          value={stats.booksThisMonth}
          subtitle="Llibres completats"
          color="primary"
          icon={Calendar}
        />
        <StatCard
          title="Gènere preferit"
          value={stats.favoriteGenre}
          subtitle="El teu favorit"
          color="primary"
          icon={Tag}
        />
        <StatCard
          title="Total llibres"
          value={stats.totalBooks}
          subtitle={`${stats.completedBooks} completats`}
          color="primary"
          icon={BookOpen}
        />
      </div>

      {annualGoal > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-sm font-medium text-slate-600 mb-2 flex items-center gap-3">
            <Target className="w-6 h-6 text-primary-600" />
            Objectiu anual
          </h3>
          <p className="text-sm text-slate-600 mb-2">
            {stats.completedBooks} / {annualGoal} llibres
          </p>
          <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary-500 h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round((stats.completedBooks / annualGoal) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
        <h3 className="text-sm font-medium text-slate-600 mb-4 flex items-center gap-3">
          <BarChart2 className="w-6 h-6 text-primary-600" />
          Progrés global de lectura
        </h3>
        <ProgressBar percentage={stats.progressPercentage} />
      </div>

      {readingBooks.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-primary-500 shadow-lg">
          <h3 className="text-sm font-medium text-slate-600 mb-4 flex items-center gap-3">
            <BookMarked className="w-6 h-6 text-primary-600" />
            Llegint ara
          </h3>
          <div className="space-y-6">
            {readingBooks.map((book, index) => (
              <div key={book.id} className={index > 0 ? "pt-6 border-t border-slate-200" : undefined}>
                <ReadingBookBlock
                  book={book}
                  onUpdateCurrentPage={onUpdateCurrentPage}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
