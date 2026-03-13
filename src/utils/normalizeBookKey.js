/**
 * Normalització de títol i autor per a la comparació/deduplicació de llibres.
 * Ignora: majúscules/minúscules, espais extra, alguns símbols comuns, punts a l'autor.
 */

/**
 * Normalitza un títol per a comparació.
 * - trim, toLowerCase
 * - espais múltiples → un sol espai
 * - elimina accents (NFD + remove combining marks)
 * - & → " and "
 */
export function normalizeTitle(title) {
  if (title == null || typeof title !== "string") return "";
  let s = title.trim().toLowerCase().replace(/\s+/g, " ");
  s = s.normalize("NFD").replace(/\p{M}/gu, "");
  s = s.replace(/\s*&\s*/g, " and ");
  return s;
}

/**
 * Normalitza un autor per a comparació.
 * - trim, toLowerCase
 * - espais múltiples → un sol espai
 * - elimina accents
 * - punts (G. R. R. Martin) → tractats com a espais per unificar variacions
 */
export function normalizeAuthor(author) {
  if (author == null || typeof author !== "string") return "";
  let s = author.trim().toLowerCase().replace(/\s+/g, " ");
  s = s.normalize("NFD").replace(/\p{M}/gu, "");
  s = s.replace(/\./g, " ").replace(/\s+/g, " ").trim();
  return s;
}

/**
 * Genera una clau única per a (originalTitle, author) per a matching.
 */
export function getBookMatchKey(originalTitle, author) {
  const t = normalizeTitle(originalTitle);
  const a = normalizeAuthor(author);
  return `${t}|${a}`;
}
