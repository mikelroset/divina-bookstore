import { describe, it, expect } from "vitest";
import { pointsToLevel, pointsToNextLevel } from "./gamificationService";

describe("gamificationService", () => {
  describe("pointsToLevel", () => {
    it("retorna 1 per 0 punts", () => {
      expect(pointsToLevel(0)).toBe(1);
    });

    it("retorna 1 per pocs punts", () => {
      expect(pointsToLevel(100)).toBe(1);
      expect(pointsToLevel(170)).toBe(1);
    });

    it("retorna 2 quan s'arriba a ~171 punts", () => {
      expect(pointsToLevel(171)).toBe(2);
      expect(pointsToLevel(200)).toBe(2);
    });

    it("incrementa el nivell cada ~171 punts", () => {
      expect(pointsToLevel(342)).toBe(3);
      expect(pointsToLevel(513)).toBe(4);
    });

    it("retorna 71 com a màxim", () => {
      expect(pointsToLevel(12000)).toBe(71);
      expect(pointsToLevel(999999)).toBe(71);
    });

    it("gestiona null/undefined com 0", () => {
      expect(pointsToLevel(null)).toBe(1);
      expect(pointsToLevel(undefined)).toBe(1);
    });
  });

  describe("pointsToNextLevel", () => {
    it("retorna progressPct 100 quan nivell és 71", () => {
      const r = pointsToNextLevel(99999);
      expect(r.points).toBe(0);
      expect(r.progressPct).toBe(100);
    });

    it("retorna punts restants i progress per nivell 1", () => {
      const r = pointsToNextLevel(0);
      expect(r.points).toBe(171);
      expect(r.progressPct).toBe(0);
    });

    it("retorna punts restants correctes a mig camí", () => {
      const r = pointsToNextLevel(85);
      expect(r.points).toBe(86);
      expect(r.progressPct).toBe(50);
    });

    it("retorna punts necessaris per al següent nivell quan està en un nivell intermig", () => {
      const r = pointsToNextLevel(171);
      expect(r.points).toBe(171);
      expect(r.progressPct).toBe(0);
    });

    it("retorna 0 punts quan arriba al nivell màxim", () => {
      const r = pointsToNextLevel(12140);
      expect(r.points).toBe(0);
      expect(r.progressPct).toBe(100);
    });
  });
});
