import React from "react";
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
import { VIEW_IDS } from "./utils/constants";

const App = () => {
  const { user, login, logout } = useAuth();
  const { books, addBook, updateBook, deleteBook } = useBooks();
  const stats = useStats();

  const [currentView, setCurrentView] = React.useState(VIEW_IDS.HOME);
  const [editingBook, setEditingBook] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");

  const handleGoogleLogin = async () => {
    try {
      await login();
      setCurrentView(VIEW_IDS.HOME);
    } catch (error) {
      alert("Error al iniciar sessió: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentView(VIEW_IDS.HOME);
    } catch (error) {
      console.error("Error al fer logout:", error);
    }
  };

  const addOrUpdateBook = async (bookData) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, bookData);
        setEditingBook(null);
      } else {
        await addBook(bookData);
      }
      setCurrentView(VIEW_IDS.LIBRARY);
    } catch (error) {
      alert("Error al guardar el llibre. Torna-ho a intentar.");
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

  const startEditing = (book) => {
    setEditingBook(book);
    setCurrentView(VIEW_IDS.ADD);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!user) {
    return <WelcomeScreen onLogin={handleGoogleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-stone-50 to-slate-100 pb-20">
      <Header user={user} />

      <div className="max-w-4xl mx-auto px-6 py-8">
        {currentView === VIEW_IDS.HOME && (
          <HomeView stats={stats} books={books} />
        )}
        {currentView === VIEW_IDS.LIBRARY && (
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
        {currentView === VIEW_IDS.COMMUNITY && (
          <CommunityView currentUser={user} userBooks={books} />
        )}
        {currentView === VIEW_IDS.ADD && (
          <AddBookView
            onSave={addOrUpdateBook}
            onCancel={() => {
              setCurrentView(VIEW_IDS.LIBRARY);
              setEditingBook(null);
            }}
            editingBook={editingBook}
          />
        )}
        {currentView === VIEW_IDS.PROFILE && (
          <ProfileView user={user} onLogout={handleLogout} stats={stats} />
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
