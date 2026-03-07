import { useCallback } from "react";
import { showCelebration, isCompletionTransition } from "../utils/celebration";
import { createBookCompletedNotification } from "../services/bookCompletedNotificationService";
import { addPointsForPages, grantCompletedBookBonus } from "../services/gamificationService";

/**
 * Hook que encapsula la lògica de guardar un llibre: actualització de pàgines, gamificació i notificacions.
 * @param {Object} options
 * @param {{ uid?: string, displayName?: string }} [options.user] - Usuari actual
 * @param {string[]} [options.userCommunityIds] - IDs de comunitats de l'usuari
 * @param {() => Promise<void>} [options.recordReadingActivity] - Funció per registrar activitat de lectura
 * @param {(bookData: Object) => Promise<Object>} options.addBook - Funció per afegir llibre
 * @param {(bookId: string, bookData: Object) => Promise<Object>} options.updateBook - Funció per actualitzar llibre
 * @returns {{ saveBook: Function, updateCurrentPage: Function }}
 */
export function useBookSave({
  user,
  userCommunityIds = [],
  recordReadingActivity,
  addBook,
  updateBook,
}) {
  const userId = user?.uid;
  const displayName = user?.displayName ?? "Algú";
  const saveBook = useCallback(
    async (bookData, editingBook) => {
      let dataToSave =
        editingBook != null ? { ...editingBook, ...bookData } : { ...bookData };

      if (bookData.currentPage != null) {
        const prevLog = editingBook?.pageLog || [];
        const now = Date.now();
        const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
        const newLog = [
          ...prevLog.filter((e) => e.at >= sevenDaysAgo),
          { at: now, page: parseInt(bookData.currentPage, 10) || 0 },
        ];
        dataToSave = { ...dataToSave, pageLog: newLog };
      }

      const prevCurrentPage = editingBook?.currentPage ?? 0;
      const newCurrentPage =
        bookData.currentPage != null ? parseInt(bookData.currentPage, 10) : null;
      const totalPages =
        (editingBook?.pages ?? bookData.pages) != null
          ? parseInt(editingBook?.pages ?? bookData.pages, 10)
          : null;
      const didComplete =
        totalPages != null &&
        totalPages > 0 &&
        newCurrentPage != null &&
        newCurrentPage >= totalPages &&
        prevCurrentPage < newCurrentPage;
      const deltaPages =
        prevCurrentPage < newCurrentPage ? newCurrentPage - prevCurrentPage : 0;

      if (didComplete) dataToSave = { ...dataToSave, status: "completed" };
      const bookTitle = (editingBook?.title ?? bookData.title) ?? "Llibre";

      let savedBook;
      if (editingBook) {
        savedBook = await updateBook(editingBook.id, dataToSave);
      } else {
        savedBook = await addBook(dataToSave);
      }

      if (bookData.currentPage != null && recordReadingActivity) {
        recordReadingActivity();
      }
      if (
        isCompletionTransition(
          prevCurrentPage,
          newCurrentPage ?? prevCurrentPage,
          totalPages,
        )
      ) {
        showCelebration();
      }

      if (userId) {
        if (deltaPages > 0 && totalPages != null && totalPages > 0) {
          addPointsForPages(userId, deltaPages, totalPages).catch((e) =>
            console.error("Error punts pàgines:", e),
          );
        }
        const bookId = editingBook?.id ?? savedBook?.id;
        if (didComplete && bookId) {
          grantCompletedBookBonus(userId, bookId).catch((e) =>
            console.error("Error punts completat:", e),
          );
        }
        if (
          didComplete &&
          userId &&
          userCommunityIds?.length > 0 &&
          bookId
        ) {
          for (const cid of userCommunityIds) {
            createBookCompletedNotification(
              cid,
              bookId,
              bookTitle,
              userId,
              displayName,
            ).catch((e) =>
              console.error("Error creant notificació:", e),
            );
          }
        }
      }

      return savedBook;
    },
    [userId, displayName, userCommunityIds, recordReadingActivity, addBook, updateBook],
  );

  const updateCurrentPage = useCallback(
    async (book, bookId, newCurrentPage) => {
      const prevCurrentPage = book.currentPage ?? 0;
      const totalPages = book.pages;
      const prevLog = book.pageLog || [];
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
      const newLog = [
        ...prevLog.filter((e) => e.at >= sevenDaysAgo),
        { at: now, page: newCurrentPage },
      ];
      const didComplete =
        totalPages != null &&
        totalPages > 0 &&
        newCurrentPage >= totalPages &&
        prevCurrentPage < newCurrentPage;
      const deltaPages =
        prevCurrentPage < newCurrentPage ? newCurrentPage - prevCurrentPage : 0;
      const updateData = { currentPage: newCurrentPage, pageLog: newLog };
      if (didComplete) updateData.status = "completed";

      await updateBook(bookId, updateData);
      if (recordReadingActivity) recordReadingActivity();
      if (
        isCompletionTransition(prevCurrentPage, newCurrentPage, totalPages)
      ) {
        showCelebration();
      }
      if (userId) {
        if (deltaPages > 0 && totalPages != null && totalPages > 0) {
          addPointsForPages(userId, deltaPages, totalPages).catch((e) =>
            console.error("Error punts pàgines:", e),
          );
        }
        if (didComplete) {
          grantCompletedBookBonus(userId, bookId).catch((e) =>
            console.error("Error punts completat:", e),
          );
        }
        if (didComplete && userCommunityIds?.length > 0) {
          const bookTitle = book.title ?? "Llibre";
          for (const cid of userCommunityIds) {
            createBookCompletedNotification(
              cid,
              bookId,
              bookTitle,
              userId,
              displayName,
            ).catch((e) =>
              console.error("Error creant notificació:", e),
            );
          }
        }
      }
    },
    [userId, displayName, userCommunityIds, recordReadingActivity, updateBook],
  );

  return { saveBook, updateCurrentPage };
}
