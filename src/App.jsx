import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { WelcomeScreen } from "./components/layout/WelcomeScreen";
import { ConfirmModal } from "./components/common/ConfirmModal";
import { HomeView } from "./components/views/HomeView";
import { LibraryView } from "./components/views/LibraryView";
import { CommunityView } from "./components/views/CommunityView";
import { InviteAcceptView } from "./components/views/InviteAcceptView";
import { AddBookView } from "./components/views/AddBookView";
import { ProfileView } from "./components/views/ProfileView";
import { AdminCommunitiesView } from "./components/views/AdminCommunitiesView";
import { useAuth } from "./hooks/useAuth";
import { useBooks } from "./hooks/useBooks";
import { useStats } from "./hooks/useStats";
import { useLibraryFilters } from "./hooks/useLibraryFilters";
import { useEncouragementCount } from "./hooks/useEncouragementCount";
import { useUserPrefs } from "./hooks/useUserPrefs";
import { ROUTES } from "./utils/constants";
import { showCelebration, isCompletionTransition } from "./utils/celebration";
import { createBookCompletedNotification } from "./services/bookCompletedNotificationService";
import { addPointsForPages, grantCompletedBookBonus } from "./services/gamificationService";

/** Ruta /add i /add/:id: resol editingBook des del param i llibres, navega després de guardar/cancel·lar */
function AddBookRoute({ recordReadingActivity, userCommunityIds = [], user }) {
  const { id } = useParams();
  const { books, addBook, updateBook } = useBooks();
  const navigate = useNavigate();
  const editingBook =
    id != null ? books.find((b) => b.id === id) ?? null : null;

  useEffect(() => {
    if (id != null && editingBook == null && books.length > 0) {
      navigate(ROUTES.LIBRARY, { replace: true });
    }
  }, [id, editingBook, books.length, navigate]);

  const handleSave = async (bookData) => {
    try {
      let dataToSave =
        editingBook != null
          ? { ...editingBook, ...bookData }
          : { ...bookData };
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
      const newCurrentPage = bookData.currentPage != null ? parseInt(bookData.currentPage, 10) : null;
      const totalPages = (editingBook?.pages ?? bookData.pages) != null ? parseInt(editingBook?.pages ?? bookData.pages, 10) : null;
      const didComplete = totalPages != null && totalPages > 0 && newCurrentPage != null && newCurrentPage >= totalPages && prevCurrentPage < newCurrentPage;
      const deltaPages = prevCurrentPage < newCurrentPage ? newCurrentPage - prevCurrentPage : 0;
      if (didComplete) dataToSave = { ...dataToSave, status: "completed" };
      const bookTitle = (editingBook?.title ?? bookData.title) ?? "Llibre";
      if (editingBook) {
        await updateBook(editingBook.id, dataToSave);
        if (bookData.currentPage != null && recordReadingActivity) recordReadingActivity();
        if (isCompletionTransition(prevCurrentPage, newCurrentPage, totalPages)) showCelebration();
        if (user?.uid) {
          if (deltaPages > 0 && totalPages != null && totalPages > 0) addPointsForPages(user.uid, deltaPages, totalPages).catch((e) => console.error("Error punts pàgines:", e));
          if (didComplete) grantCompletedBookBonus(user.uid, editingBook.id).catch((e) => console.error("Error punts completat:", e));
        }
        if (didComplete && user?.uid && userCommunityIds?.length > 0) {
          for (const cid of userCommunityIds) {
            createBookCompletedNotification(cid, editingBook.id, bookTitle, user.uid, user.displayName ?? "Algú").catch((e) => console.error("Error creant notificació:", e));
          }
        }
      } else {
        const newBook = await addBook(dataToSave);
        if (bookData.currentPage != null && recordReadingActivity) recordReadingActivity();
        if (newCurrentPage != null && isCompletionTransition(0, newCurrentPage, totalPages)) showCelebration();
        if (user?.uid) {
          if (deltaPages > 0 && totalPages != null && totalPages > 0) addPointsForPages(user.uid, deltaPages, totalPages).catch((e) => console.error("Error punts pàgines:", e));
          if (didComplete && newBook?.id) grantCompletedBookBonus(user.uid, newBook.id).catch((e) => console.error("Error punts completat:", e));
        }
        if (didComplete && user?.uid && userCommunityIds?.length > 0 && newBook?.id) {
          for (const cid of userCommunityIds) {
            createBookCompletedNotification(cid, newBook.id, bookTitle, user.uid, user.displayName ?? "Algú").catch((e) => console.error("Error creant notificació:", e));
          }
        }
      }
      navigate(ROUTES.LIBRARY);
    } catch (error) {
      alert("Error al guardar el llibre. Torna-ho a intentar.");
    }
  };

  if (id != null && editingBook == null && books.length > 0) {
    return null;
  }

  return (
    <AddBookView
      editingBook={editingBook}
      onSave={handleSave}
      onCancel={() => navigate(ROUTES.LIBRARY)}
    />
  );
}

const App = () => {
  const { user, login, logout } = useAuth();
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const stats = useStats();
  const { count: encouragementCount } = useEncouragementCount(user?.uid);
  const { annualGoal, setAnnualGoal, streak, recordReadingActivity, activeCommunityId, setActiveCommunityId, userCommunityIds, addCommunityToUser, syncUserCommunityIds } = useUserPrefs(user?.uid, user);
  const navigate = useNavigate();
  const [bookIdToDelete, setBookIdToDelete] = useState(null);
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredBooks,
  } = useLibraryFilters(books);

  const handleDeleteRequest = (id) => setBookIdToDelete(id);

  const handleDeleteConfirm = async () => {
    if (!bookIdToDelete) return;
    try {
      await deleteBook(bookIdToDelete);
    } catch (error) {
      console.error("Error al eliminar llibre:", error);
      alert("Error al eliminar el llibre. Torna-ho a intentar.");
    }
    setBookIdToDelete(null);
  };

  const handleGoogleLogin = async () => {
    try {
      await login();
      navigate(ROUTES.HOME);
    } catch (error) {
      alert("Error al iniciar sessió: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Error al fer logout:", error);
      alert("No s'ha pogut tancar la sessió. Torna-ho a intentar.");
    }
  };

  const handleEditBook = (book) => {
    navigate(`${ROUTES.ADD}/${book.id}`);
  };

  const handleUpdateCurrentPageFromHome = async (bookId, newCurrentPage) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;
    const prevCurrentPage = book.currentPage ?? 0;
    const totalPages = book.pages;
    const prevLog = book.pageLog || [];
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const newLog = [
      ...prevLog.filter((e) => e.at >= sevenDaysAgo),
      { at: now, page: newCurrentPage },
    ];
    const didComplete = totalPages != null && totalPages > 0 && newCurrentPage >= totalPages && prevCurrentPage < newCurrentPage;
    const deltaPages = prevCurrentPage < newCurrentPage ? newCurrentPage - prevCurrentPage : 0;
    const updateData = { currentPage: newCurrentPage, pageLog: newLog };
    if (didComplete) updateData.status = "completed";
    await updateBook(bookId, updateData);
    if (recordReadingActivity) recordReadingActivity();
    if (isCompletionTransition(prevCurrentPage, newCurrentPage, totalPages)) {
      showCelebration();
    }
    if (user?.uid) {
      if (deltaPages > 0 && totalPages != null && totalPages > 0) addPointsForPages(user.uid, deltaPages, totalPages).catch((e) => console.error("Error punts pàgines:", e));
      if (didComplete) grantCompletedBookBonus(user.uid, bookId).catch((e) => console.error("Error punts completat:", e));
    }
    if (didComplete && user?.uid && userCommunityIds?.length > 0) {
      const bookTitle = book.title ?? "Llibre";
      for (const cid of userCommunityIds) {
        createBookCompletedNotification(cid, bookId, bookTitle, user.uid, user.displayName ?? "Algú").catch((e) => console.error("Error creant notificació:", e));
      }
    }
  };

  if (!user) {
    return <WelcomeScreen onLogin={handleGoogleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-stone-50 to-slate-100 pb-20">
      <Header user={user} />

      <div className="max-w-4xl mx-auto px-6 py-8 overflow-x-hidden">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomeView user={user} stats={stats} books={books} annualGoal={annualGoal} streak={streak} onUpdateCurrentPage={handleUpdateCurrentPageFromHome} userCommunityIds={userCommunityIds} />} />
          <Route
            path={ROUTES.LIBRARY}
            element={
              <LibraryView
                books={filteredBooks}
                onEdit={handleEditBook}
                onDelete={handleDeleteRequest}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            }
          />
          <Route
            path={ROUTES.COMMUNITY}
            element={<CommunityView currentUser={user} userBooks={books} activeCommunityId={activeCommunityId} onSelectCommunity={setActiveCommunityId} userCommunityIds={userCommunityIds} addCommunityToUser={addCommunityToUser} syncUserCommunityIds={syncUserCommunityIds} />}
          />
          <Route
            path={`${ROUTES.COMMUNITY_INVITE}/:inviteId`}
            element={<InviteAcceptView currentUser={user} addCommunityToUser={addCommunityToUser} onSelectCommunity={setActiveCommunityId} />}
          />
          <Route path={ROUTES.ADD} element={<AddBookRoute recordReadingActivity={recordReadingActivity} userCommunityIds={userCommunityIds} user={user} />} />
          <Route path={`${ROUTES.ADD}/:id`} element={<AddBookRoute recordReadingActivity={recordReadingActivity} userCommunityIds={userCommunityIds} user={user} />} />
          <Route
            path={ROUTES.PROFILE}
            element={<ProfileView user={user} onLogout={handleLogout} stats={stats} annualGoal={annualGoal} setAnnualGoal={setAnnualGoal} />}
          />
          <Route
            path={ROUTES.ADMIN_COMMUNITIES}
            element={<AdminCommunitiesView currentUser={user} onBack={() => navigate(ROUTES.PROFILE)} />}
          />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </div>

      <ConfirmModal
        open={bookIdToDelete != null}
        title="Eliminar llibre"
        message="Estàs segur que vols eliminar aquest llibre? Aquesta acció no es pot desfer."
        confirmLabel="Eliminar"
        cancelLabel="Cancel·lar"
        confirmVariant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setBookIdToDelete(null)}
      />

      <BottomNav encouragementCount={encouragementCount} />
    </div>
  );
};

export default App;
