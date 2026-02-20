import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useParams, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { WelcomeScreen } from "./components/layout/WelcomeScreen";
import { HomeView } from "./components/views/HomeView";
import { LibraryView } from "./components/views/LibraryView";
import { CommunityView } from "./components/views/CommunityView";
import { AddBookView } from "./components/views/AddBookView";
import { ProfileView } from "./components/views/ProfileView";
import { useAuth } from "./hooks/useAuth";
import { useBooks } from "./hooks/useBooks";
import { useStats } from "./hooks/useStats";
import { useLibraryFilters } from "./hooks/useLibraryFilters";
import { ROUTES } from "./utils/constants";

/** Ruta /add i /add/:id: resol editingBook des del param i llibres, navega després de guardar/cancel·lar */
function AddBookRoute() {
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
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
      } else {
        await addBook(bookData);
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
  const navigate = useNavigate();
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filteredBooks,
  } = useLibraryFilters(books);

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
    }
  };

  const handleDeleteBook = async (id) => {
    if (confirm("Estàs segur que vols eliminar aquest llibre?")) {
      try {
        await deleteBook(id);
      } catch (error) {
        console.error("Error al eliminar llibre:", error);
        alert("Error al eliminar el llibre. Torna-ho a intentar.");
      }
    }
  };

  const handleEditBook = (book) => {
    navigate(`${ROUTES.ADD}/${book.id}`);
  };

  if (!user) {
    return <WelcomeScreen onLogin={handleGoogleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-stone-50 to-slate-100 pb-20">
      <Header user={user} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomeView stats={stats} books={books} />} />
          <Route
            path={ROUTES.LIBRARY}
            element={
              <LibraryView
                books={filteredBooks}
                onEdit={handleEditBook}
                onDelete={handleDeleteBook}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            }
          />
          <Route
            path={ROUTES.COMMUNITY}
            element={<CommunityView currentUser={user} userBooks={books} />}
          />
          <Route path={ROUTES.ADD} element={<AddBookRoute />} />
          <Route path={`${ROUTES.ADD}/:id`} element={<AddBookRoute />} />
          <Route
            path={ROUTES.PROFILE}
            element={<ProfileView user={user} onLogout={handleLogout} stats={stats} />}
          />
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </div>

      <BottomNav />
    </div>
  );
};

export default App;
