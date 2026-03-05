import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { computePace, computeETA, getWeeklyPagesRead } from "./readingInsights";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const REFERENCE_TIME = new Date("2024-06-15T12:00:00Z").getTime();

describe("readingInsights", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(REFERENCE_TIME);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("computePace", () => {
    it("retorna 0 si pageLog és buit o null", () => {
      expect(computePace([])).toBe(0);
      expect(computePace(null)).toBe(0);
    });

    it("retorna 0 si hi ha menys de 2 entrades", () => {
      const log = [{ at: REFERENCE_TIME - MS_PER_DAY, page: 10 }];
      expect(computePace(log)).toBe(0);
    });

    it("calcula pàgines per dia amb 2 entrades", () => {
      const day1 = REFERENCE_TIME - 2 * MS_PER_DAY;
      const day2 = REFERENCE_TIME - 1 * MS_PER_DAY;
      const log = [
        { at: day1, page: 0 },
        { at: day2, page: 50 },
      ];
      expect(computePace(log)).toBe(50);
    });

    it("ignora deltes negatius (re-reading)", () => {
      const day1 = REFERENCE_TIME - 3 * MS_PER_DAY;
      const day2 = REFERENCE_TIME - 2 * MS_PER_DAY;
      const day3 = REFERENCE_TIME - 1 * MS_PER_DAY;
      const log = [
        { at: day1, page: 0 },
        { at: day2, page: 50 },
        { at: day3, page: 30 },
      ];
      expect(computePace(log)).toBe(25);
    });

    it("suma múltiples deltes positius", () => {
      const day1 = REFERENCE_TIME - 3 * MS_PER_DAY;
      const day2 = REFERENCE_TIME - 2 * MS_PER_DAY;
      const day3 = REFERENCE_TIME - 1 * MS_PER_DAY;
      const log = [
        { at: day1, page: 0 },
        { at: day2, page: 30 },
        { at: day3, page: 80 },
      ];
      expect(computePace(log)).toBe(40);
    });

    it("retorna 0 si les entrades són fora de la finestra de 7 dies", () => {
      const oldTime = REFERENCE_TIME - 10 * MS_PER_DAY;
      const log = [
        { at: oldTime, page: 0 },
        { at: oldTime + MS_PER_DAY, page: 50 },
      ];
      expect(computePace(log)).toBe(0);
    });
  });

  describe("computeETA", () => {
    it("retorna null si pages és 0 o invàlid", () => {
      expect(computeETA({ pages: 0, currentPage: 50 })).toBe(null);
      expect(computeETA({ pages: null, currentPage: 50 })).toBe(null);
    });

    it("retorna null si currentPage >= pages", () => {
      expect(computeETA({ pages: 100, currentPage: 100, pageLog: [] })).toBe(null);
      expect(computeETA({ pages: 100, currentPage: 101, pageLog: [] })).toBe(null);
    });

    it("retorna null si el pace és 0 (sense dades de lectura)", () => {
      expect(computeETA({ pages: 100, currentPage: 50, pageLog: [] })).toBe(null);
    });

    it("retorna daysLeft i dateStr quan hi ha dades suficients", () => {
      const day1 = REFERENCE_TIME - 2 * MS_PER_DAY;
      const day2 = REFERENCE_TIME - 1 * MS_PER_DAY;
      const log = [
        { at: day1, page: 0 },
        { at: day2, page: 50 },
      ];
      const result = computeETA({ pages: 100, currentPage: 50, pageLog: log });
      expect(result).not.toBe(null);
      expect(result.daysLeft).toBeGreaterThanOrEqual(1);
      expect(typeof result.dateStr).toBe("string");
      expect(result.dateStr).toMatch(/\d{1,2}\/\d{1,2}/);
    });
  });

  describe("getWeeklyPagesRead", () => {
    it("retorna 7 dies amb pagesRead 0 si pageLog és buit", () => {
      const result = getWeeklyPagesRead([]);
      expect(result).toHaveLength(7);
      result.forEach((d) => {
        expect(d).toHaveProperty("date");
        expect(d).toHaveProperty("pagesRead", 0);
      });
    });

    it("retorna 7 dies amb format date YYYY-MM-DD", () => {
      const result = getWeeklyPagesRead([]);
      result.forEach((d) => {
        expect(d.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("suma pàgines llegides per dia quan hi ha múltiples entrades", () => {
      const baseDay = REFERENCE_TIME - 1 * MS_PER_DAY;
      const dateStr = new Date(baseDay).toISOString().slice(0, 10);
      const log = [
        { at: baseDay, page: 0 },
        { at: baseDay + 3600000, page: 10 },
        { at: baseDay + 7200000, page: 25 },
      ];
      const result = getWeeklyPagesRead(log);
      const dayEntry = result.find((d) => d.date === dateStr);
      expect(dayEntry).toBeDefined();
      expect(dayEntry.pagesRead).toBe(25);
    });

    it("ignora deltes negatius (compta 0 per aquell dia)", () => {
      const baseDay = REFERENCE_TIME - 1 * MS_PER_DAY;
      const dateStr = new Date(baseDay).toISOString().slice(0, 10);
      const log = [
        { at: baseDay, page: 50 },
        { at: baseDay + 3600000, page: 30 },
      ];
      const result = getWeeklyPagesRead(log);
      const dayEntry = result.find((d) => d.date === dateStr);
      expect(dayEntry).toBeDefined();
      expect(dayEntry.pagesRead).toBe(0);
    });
  });
});
