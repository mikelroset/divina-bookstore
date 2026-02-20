/** Identificadors de les pantalles principals (eviten magic strings) */
export const VIEW_IDS = {
  HOME: "home",
  LIBRARY: "library",
  COMMUNITY: "community",
  ADD: "add",
  PROFILE: "profile",
};

/** Paths de React Router (URLs) */
export const ROUTES = {
  HOME: "/",
  LIBRARY: "/library",
  COMMUNITY: "/community",
  ADD: "/add",
  PROFILE: "/profile",
};

export const BOOK_GENRES = [
  "Novel·la",
  "Fantasia",
  "Ciència-ficció",
  "Misteri",
  "Thriller",
  "Terror",
  "Romàntic",
  "Històric",
  "Biografia",
  "Autobiografia",
  "Assaig",
  "Filosofia",
  "Poesia",
  "Teatre",
  "Còmic",
  "Manga",
  "Infantil",
  "Juvenil",
  "Autoajuda",
  "Divulgació",
  "Cuina",
  "Viatges",
  "Art",
  "Ciència",
  "Tecnologia",
  "Negocis",
  "Espiritualitat",
  "Aventures",
  "Distopia",
  "Realisme Màgic",
  "Noir",
  "Western",
  "Humor",
  "Altre",
];

export const STATUS_LABELS = {
  wishlist: "Desitjat",
  pending: "Pendent",
  reading: "Llegint",
  completed: "Completat",
};

/** Valor del filtre "tots" a la biblioteca */
export const LIBRARY_FILTER_ALL = "all";

/** Opcions del select de filtre a la biblioteca (value + label) */
export const LIBRARY_FILTER_OPTIONS = [
  { value: "all", label: "Tots els llibres" },
  { value: "wishlist", label: "Desitjats" },
  { value: "pending", label: "Pendents" },
  { value: "reading", label: "Llegint" },
  { value: "completed", label: "Completats" },
];

export const STATUS_COLORS = {
  pending: "bg-slate-100 text-slate-700 border-slate-300",
  reading: "bg-blue-100 text-blue-700 border-blue-300",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-300",
  wishlist: "bg-amber-100 text-amber-700 border-amber-300",
};
