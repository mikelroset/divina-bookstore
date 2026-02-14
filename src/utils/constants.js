export const SAMPLE_BOOKS = [
  {
    id: "1",
    title: "Cent Anys de Solitud",
    author: "Gabriel García Márquez",
    genre: "Realisme Màgic",
    status: "completed",
    rating: 5,
    description: "Una obra mestra de la literatura llatinoamericana.",
    comments:
      "Absolutament meravellós, una història que et captura des de la primera pàgina.",
    coverUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=450&fit=crop",
    isbn: "978-0307474728",
    pages: 417,
    publisher: "Editorial Sudamericana",
    year: 1967,
    language: "Espanyol",
    startDate: "2024-01-10",
    endDate: "2024-02-05",
    currentPage: 417,
  },
  {
    id: "2",
    title: "El Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasia",
    status: "reading",
    rating: 4,
    description: "L'aventura de Bilbo Saquet a la Terra Mitjana.",
    comments: "M'està encantant el món creat per Tolkien.",
    coverUrl:
      "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=300&h=450&fit=crop",
    isbn: "978-0547928227",
    pages: 310,
    publisher: "Minotauro",
    year: 1937,
    language: "Anglès",
    startDate: "2024-02-10",
    currentPage: 156,
  },
  {
    id: "3",
    title: "1984",
    author: "George Orwell",
    genre: "Distopia",
    status: "pending",
    rating: 0,
    description: "Una visió aterradora d'un futur totalitari.",
    comments: "",
    coverUrl:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=450&fit=crop",
    isbn: "978-0451524935",
    pages: 328,
    publisher: "Signet Classic",
    year: 1949,
    language: "Anglès",
  },
];

export const COMMUNITY_READERS = [
  {
    uid: "user456",
    displayName: "Joan Martí",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joan",
    currentBook: {
      title: "Dune",
      author: "Frank Herbert",
      genre: "Ciència-ficció",
      coverUrl:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=450&fit=crop",
      currentPage: 234,
      pages: 688,
      startDate: "2024-02-01",
    },
  },
  {
    uid: "user789",
    displayName: "Anna Soler",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
    currentBook: {
      title: "El Nom de la Rosa",
      author: "Umberto Eco",
      genre: "Misteri",
      coverUrl:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=450&fit=crop",
      currentPage: 156,
      pages: 536,
      startDate: "2024-02-12",
    },
  },
  {
    uid: "user101",
    displayName: "Marc Ribas",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marc",
    currentBook: {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      genre: "Assaig",
      coverUrl:
        "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=450&fit=crop",
      currentPage: 89,
      pages: 512,
      startDate: "2024-02-14",
    },
  },
  {
    uid: "user202",
    displayName: "Laura Vidal",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Laura",
    currentBook: {
      title: "La Casa dels Esperits",
      author: "Isabel Allende",
      genre: "Realisme Màgic",
      coverUrl:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=450&fit=crop",
      currentPage: 267,
      pages: 433,
      startDate: "2024-01-28",
    },
  },
];

export const STATUS_LABELS = {
  pending: "Pendent",
  reading: "Llegint",
  completed: "Completat",
};

export const STATUS_COLORS = {
  pending: "bg-slate-100 text-slate-700 border-slate-300",
  reading: "bg-amber-100 text-amber-700 border-amber-300",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-300",
};
