const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Compute average pages per day from pageLog (last 7 days). Ignores negative deltas (re-reading).
 * @param {Array<{ at: number, page: number }>} pageLog
 * @returns {number} pages per day, or 0 if not enough data
 */
export function computePace(pageLog) {
  if (!pageLog || pageLog.length < 2) return 0;
  const sorted = [...pageLog].sort((a, b) => a.at - b.at);
  const now = Date.now();
  const sevenDaysAgo = now - 7 * MS_PER_DAY;
  const inWindow = sorted.filter((e) => e.at >= sevenDaysAgo);
  if (inWindow.length < 2) return 0;

  let totalPages = 0;
  for (let i = 1; i < inWindow.length; i++) {
    const delta = inWindow[i].page - inWindow[i - 1].page;
    if (delta > 0) totalPages += delta;
  }
  const firstTs = inWindow[0].at;
  const lastTs = inWindow[inWindow.length - 1].at;
  const daysSpan = (lastTs - firstTs) / MS_PER_DAY || 1;
  return totalPages / Math.min(daysSpan, 7);
}

/**
 * ETA for finishing the book: days left and estimated date. Returns null if pace <= 0 or pages total missing.
 * @param {{ pageLog?: Array<{ at: number, page: number }>, currentPage?: number, pages?: number }} book
 * @returns {{ daysLeft: number, dateStr: string } | null}
 */
export function computeETA(book) {
  const pages = parseInt(book.pages, 10);
  const current = parseInt(book.currentPage, 10) || 0;
  if (!pages || pages <= 0 || current >= pages) return null;

  const pace = computePace(book.pageLog || []);
  if (pace <= 0) return null;

  const remaining = pages - current;
  const daysLeft = Math.ceil(remaining / pace);
  const estimated = new Date();
  estimated.setDate(estimated.getDate() + daysLeft);
  const dateStr = estimated.toLocaleDateString("ca-ES", {
    day: "2-digit",
    month: "2-digit",
  });
  return { daysLeft, dateStr };
}

/**
 * Data for mini-chart: last 7 days of page progress (date key -> page value).
 * @param {Array<{ at: number, page: number }>} pageLog
 * @returns {Array<{ date: string, page: number }>} sorted by date ascending
 */
export function getWeeklyProgress(pageLog) {
  if (!pageLog || pageLog.length === 0) return [];
  const sorted = [...pageLog].sort((a, b) => a.at - b.at);
  const now = Date.now();
  const sevenDaysAgo = now - 7 * MS_PER_DAY;
  const inWindow = sorted.filter((e) => e.at >= sevenDaysAgo);
  const byDate = {};
  inWindow.forEach((e) => {
    const d = new Date(e.at).toISOString().slice(0, 10);
    byDate[d] = e.page;
  });
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, page: byDate[key] ?? null });
  }
  return days;
}

/**
 * Pages read per day for the last 7 days (deltas; negative deltas count as 0).
 * Multiple entries on the same day are summed.
 * @param {Array<{ at: number, page: number }>} pageLog
 * @returns {Array<{ date: string, pagesRead: number }>} last 7 days, ascending by date
 */
export function getWeeklyPagesRead(pageLog) {
  if (!pageLog || pageLog.length === 0) {
    return getLast7DaysWithPagesRead([]);
  }
  const sorted = [...pageLog].sort((a, b) => a.at - b.at);
  const now = Date.now();
  const sevenDaysAgo = now - 7 * MS_PER_DAY;
  const inWindow = sorted.filter((e) => e.at >= sevenDaysAgo);
  const byDate = {};
  for (let i = 1; i < inWindow.length; i++) {
    const delta = inWindow[i].page - inWindow[i - 1].page;
    const pagesRead = delta > 0 ? delta : 0;
    const key = new Date(inWindow[i].at).toISOString().slice(0, 10);
    byDate[key] = (byDate[key] || 0) + pagesRead;
  }
  return getLast7DaysWithPagesRead(byDate);
}

function getLast7DaysWithPagesRead(byDate) {
  const days = [];
  const now = Date.now();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ date: key, pagesRead: byDate[key] || 0 });
  }
  return days;
}
