/** Identificadors de les pantalles principals (eviten magic strings) */
export const VIEW_IDS = {
  HOME: "home",
  LIBRARY: "library",
  COMMUNITY: "community",
  REVIEWS: "reviews",
  ADD: "add",
  PROFILE: "profile",
};

/** Paths de React Router (URLs) */
export const ROUTES = {
  HOME: "/",
  LIBRARY: "/library",
  COMMUNITY: "/community",
  COMMUNITY_MEMBER: "/community/member",
  COMMUNITY_INVITE: "/community/invite",
  REVIEWS: "/reviews",
  ADD: "/add",
  PROFILE: "/profile",
  ADMIN_COMMUNITIES: "/profile/admin-communities",
};

export const BOOK_GENRES = [
  "Altre",
  "Art",
  "Assaig",
  "Autoajuda",
  "Autobiografia",
  "Aventures",
  "Biografia",
  "Ciència",
  "Ciència-ficció",
  "Clàssic",
  "Còmic",
  "Cuina",
  "Distopia",
  "Divulgació",
  "Espiritualitat",
  "Fantasia",
  "Filosofia",
  "Històric",
  "Humor",
  "Infantil",
  "Juvenil",
  "Manga",
  "Misteri",
  "Negocis",
  "Noir",
  "Novel·la",
  "Poesia",
  "Realisme Màgic",
  "Romàntic",
  "Tecnologia",
  "Teatre",
  "Terror",
  "Thriller",
  "Viatges",
  "Western",
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

/** Comunitat per defecte (AC1 Gestió de comunitat) */
export const DEFAULT_COMMUNITY_ID = "homenatge-divina";
export const DEFAULT_COMMUNITY_NAME = "Homenatge a la Divina";
export const DEFAULT_COMMUNITY_OWNER_UID = "6g9VBE4EagT5yk8PuSZRHZGwAuH2";
