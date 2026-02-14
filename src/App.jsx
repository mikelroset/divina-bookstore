// ============================================
// FILE: src/App.jsx - Amb Firebase Real (CORREGIT)
// ============================================
import React from "react";
import { Header } from "./components/layout/Header";
import { BottomNav } from "./components/layout/BottomNav";
import { WelcomeScreen } from "./components/layout/WelcomeScreen";
import { HomeView } from "./components/views/HomeView";
import { LibraryView } from "./components/views/LibraryView";
import { CommunityView } from "./components/views/CommunityView";
import { AddBookView } from "./components/views/AddBookView";
import { ProfileView } from "./components/views/ProfileView";
import { useAuth } from "./context/AuthContext";
import { useBooks } from "./context/BooksContext";

const App = () => {
  // Hooks de Context (donen accés a user, login, logout, books, etc.)
  const { user, login, logout } = useAuth();
  const { books, addBook, updateBook, deleteBook } = useBooks();

  // Estats locals per la navegació i UI
  const [currentView, setCurrentView] = React.useState("home");
  const [editingBook, setEditingBook] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");

  // Login amb Google
  const handleGoogleLogin = async () => {
    console.log("🔵 handleGoogleLogin cridat");
    try {
      console.log("🔵 Cridant login()...");
      await login();
      console.log("✅ Login exitós!");
      setCurrentView("home");
    } catch (error) {
      console.error("❌ Error al fer login:", error);
      alert("Error al iniciar sessió: " + error.message);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await logout();
      setCurrentView("home");
    } catch (error) {
      console.error("Error al fer logout:", error);
    }
  };

  // Calcular estadístiques
  const getStats = () => {
    const completedBooks = books.filter((b) => b.status === "completed");
    const currentMonth = new Date().getMonth();
    const booksThisMonth = completedBooks.filter((b) => {
      if (!b.endDate) return false;
      return new Date(b.endDate).getMonth() === currentMonth;
    });

    const genreCounts = {};
    completedBooks.forEach((book) => {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    });
    const favoriteGenre =
      Object.keys(genreCounts).length > 0
        ? Object.keys(genreCounts).reduce((a, b) =>
            genreCounts[a] > genreCounts[b] ? a : b,
          )
        : "N/A";

    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const readPages = books.reduce((sum, book) => {
      if (book.status === "completed") return sum + (book.pages || 0);
      if (book.status === "reading") return sum + (book.currentPage || 0);
      return sum;
    }, 0);
    const progressPercentage =
      totalPages > 0 ? Math.round((readPages / totalPages) * 100) : 0;

    return {
      booksThisMonth: booksThisMonth.length,
      favoriteGenre,
      progressPercentage,
      totalBooks: books.length,
      completedBooks: completedBooks.length,
    };
  };

  // Afegir o actualitzar llibre (usa els mètodes del context)
  const addOrUpdateBook = async (bookData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
        setEditingBook(null);
      } else {
        await addBook(bookData);
      }
      setCurrentView("library");
    } catch (error) {
      console.error("Error al guardar llibre:", error);
      alert("Error al guardar el llibre. Torna-ho a intentar.");
    }
  };

  // Eliminar llibre (usa el mètode del context)
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

  // Començar a editar un llibre
  const startEditing = (book) => {
    setEditingBook(book);
    setCurrentView("add");
  };

  // Filtrar llibres
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Si no hi ha usuari, mostrar pantalla de benvinguda
  if (!user) {
    return <WelcomeScreen onLogin={handleGoogleLogin} />;
  }

  // App principal (quan hi ha usuari autenticat)
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-slate-100 pb-20">
      <Header user={user} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentView === "home" && (
          <HomeView stats={getStats()} books={books} />
        )}
        {currentView === "library" && (
          <LibraryView
            books={filteredBooks}
            onEdit={startEditing}
            onDelete={handleDeleteBook}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        )}
        {currentView === "community" && (
          <CommunityView currentUser={user} userBooks={books} />
        )}
        {currentView === "add" && (
          <AddBookView
            onSave={addOrUpdateBook}
            onCancel={() => {
              setCurrentView("library");
              setEditingBook(null);
            }}
            editingBook={editingBook}
          />
        )}
        {currentView === "profile" && (
          <ProfileView user={user} onLogout={handleLogout} stats={getStats()} />
        )}
      </div>

      <BottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
        setEditingBook={setEditingBook}
      />
    </div>
  );
};

export default App;
