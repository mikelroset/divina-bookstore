import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { computeStreak } from "./userPrefsService";

describe("userPrefsService", () => {
  describe("computeStreak", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("retorna 0 si readingActivityDays és buit", () => {
      expect(computeStreak([])).toBe(0);
      expect(computeStreak(null)).toBe(0);
      expect(computeStreak(undefined)).toBe(0);
    });

    it("retorna 0 si avui no hi ha activitat", () => {
      vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
      // Avui és 2026-03-15; si tenim només dies passats, streak 0
      expect(computeStreak(["2026-03-14", "2026-03-13"])).toBe(0);
    });

    it("retorna 1 si només avui hi ha activitat", () => {
      vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
      expect(computeStreak(["2026-03-15"])).toBe(1);
    });

    it("retorna 3 per tres dies consecutius acabant avui", () => {
      vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
      expect(computeStreak(["2026-03-15", "2026-03-14", "2026-03-13"])).toBe(3);
    });

    it("ignora dies no consecutius després del tall", () => {
      vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
      // 15, 14, 13 consecutius; 10 és un forat
      expect(computeStreak(["2026-03-15", "2026-03-14", "2026-03-13", "2026-03-10"])).toBe(3);
    });

    it("ordena correctament si els dies venen desordenats", () => {
      vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
      expect(computeStreak(["2026-03-13", "2026-03-15", "2026-03-14"])).toBe(3);
    });

    it("filtra entrades buides", () => {
      vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
      expect(computeStreak(["2026-03-15", "", "2026-03-14", null])).toBe(2);
    });
  });
});
