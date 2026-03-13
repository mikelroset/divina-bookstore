import React, { useState, useEffect, useCallback } from "react";
import { TrendingUp, Award, BookOpen, Heart, Flame, Calendar, Tag, Target, BarChart2, BookMarked, BookCheck, X } from "lucide-react";
import { PageTitle, BoxTitle, ProgressBar, Box } from "../../design-system";
import { StatCard } from "../common/StatCard";
import { ReadingBookBlock } from "../common/ReadingBookBlock";
import { encouragementService } from "../../services/encouragementService";
import {
  getBookCompletedNotifications,
  dismissBookCompletedNotification,
} from "../../services/bookCompletedNotificationService";

export const HomeView = ({ user, stats, books, annualGoal = 0, streak = 0, onUpdateCurrentPage, userCommunityIds = [] }) => {
  const readingBooks = books.filter((b) => b.status === "reading");
  const [encouragements, setEncouragements] = useState([]);
  const [bookCompletedNotifs, setBookCompletedNotifs] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
    encouragementService
      .getEncouragementsForUser(user.uid)
      .then(setEncouragements)
      .catch((err) => console.error("Error carregant encoratjaments:", err));
  }, [user?.uid]);

  const loadBookCompletedNotifs = useCallback(() => {
    if (!user?.uid || !userCommunityIds?.length) return;
    getBookCompletedNotifications(user.uid, userCommunityIds)
      .then(setBookCompletedNotifs)
      .catch((err) => console.error("Error carregant notificacions llibres llegits:", err));
  }, [user?.uid, userCommunityIds]);

  useEffect(() => {
    loadBookCompletedNotifs();
  }, [loadBookCompletedNotifs]);

  const handleDismissNotif = async (id) => {
    if (!user?.uid) return;
    try {
      await dismissBookCompletedNotification(user.uid, id);
      setBookCompletedNotifs((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error tancant notificació:", err);
    }
  };

  const handleDismissEncouragement = async (id) => {
    if (!user?.uid) return;
    try {
      await encouragementService.dismissEncouragement(user.uid, id);
      setEncouragements((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error tancant encoratjament:", err);
    }
  };

  return (
    <div className="space-y-6">
      <PageTitle subtitle="Aquí tens un resum de la teva biblioteca">
        Benvingut/da!
      </PageTitle>

      {bookCompletedNotifs.length > 0 && (
        <Box>
          <BoxTitle icon={BookCheck}>Llibres llegits a la comunitat</BoxTitle>
          <ul className="space-y-2 list-none pl-0">
            {bookCompletedNotifs.map((n) => (
              <li
                key={n.id}
                className="flex items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0"
              >
                <span className="text-slate-700 min-w-0">
                  <span className="font-medium text-primary-700">{n.completedByUserName ?? "Algú"}</span>
                  {" "}ha acabat{" "}
                  <span className="font-medium">{n.bookTitle ?? "un llibre"}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleDismissNotif(n.id)}
                  className="shrink-0 p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                  aria-label="Tancar"
                >
                  <X className="w-4 h-4 block" />
                </button>
              </li>
            ))}
          </ul>
        </Box>
      )}

      {encouragements.length > 0 && (
        <Box>
          <BoxTitle icon={Heart}>Encoratjaments</BoxTitle>
          <ul className="space-y-2 list-none pl-0">
            {encouragements.map((enc) => (
              <li
                key={enc.id}
                className="flex items-center justify-between gap-2 py-2 border-b border-slate-100 last:border-0"
              >
                <span className="text-slate-700 min-w-0">
                  <span className="font-medium text-primary-700">
                    {enc.fromUserName ?? "Algú"}
                  </span>{" "}
                  t&apos;anima a seguir llegint
                  {enc.bookTitle ? (
                    <> {enc.bookTitle}</>
                  ) : null}
                </span>
                <button
                  type="button"
                  onClick={() => handleDismissEncouragement(enc.id)}
                  className="shrink-0 p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                  aria-label="Tancar"
                >
                  <X className="w-4 h-4 block" />
                </button>
              </li>
            ))}
          </ul>
        </Box>
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
        <Box>
          <BoxTitle icon={Target}>Objectiu anual</BoxTitle>
          <ProgressBar
            value={Math.min(100, Math.round((stats.completedBooks / annualGoal) * 100))}
            max={100}
            variant="secondary"
            height="sm"
            className="mb-2"
          />
          <p className="text-sm text-slate-600">
            Progrés anual: {stats.completedBooks} / {annualGoal} llibres
          </p>
        </Box>
      )}

      <Box>
        <BoxTitle icon={BarChart2}>Progrés global de lectura</BoxTitle>
        <ProgressBar value={stats.progressPercentage} max={100} variant="secondary" showLabel />
      </Box>

      {readingBooks.length > 0 && (
        <Box>
          <BoxTitle icon={BookMarked}>Llegint ara</BoxTitle>
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
        </Box>
      )}
    </div>
  );
};
