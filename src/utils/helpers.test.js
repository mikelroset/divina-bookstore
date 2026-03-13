import { describe, it, expect } from "vitest";
import {
  getDaysReading,
  calculateProgress,
  safeProgress,
  formatNumber,
  truncateText,
  generateId,
  validateISBN,
  normalizeISBN,
  sortBooks,
} from "./helpers";

describe("helpers", () => {
  describe("getDaysReading", () => {
    it("retorna 0 si startDate és null o undefined", () => {
      expect(getDaysReading(null)).toBe(0);
      expect(getDaysReading(undefined)).toBe(0);
    });
  });

  describe("safeProgress", () => {
    it("retorna percentatge vàlid per a dades coherents", () => {
      expect(safeProgress(50, 100)).toBe(50);
      expect(safeProgress(0, 100)).toBe(0);
      expect(safeProgress(100, 100)).toBe(100);
      expect(safeProgress(1, 3)).toBe(33);
    });
    it("retorna null si totalPages és 0 o negatiu", () => {
      expect(safeProgress(50, 0)).toBe(null);
      expect(safeProgress(0, -1)).toBe(null);
    });
    it("retorna null si currentPage és negatiu", () => {
      expect(safeProgress(-1, 100)).toBe(null);
    });
    it("retorna null si currentPage > totalPages", () => {
      expect(safeProgress(101, 100)).toBe(null);
      expect(safeProgress(150, 100)).toBe(null);
    });
    it("retorna null per NaN", () => {
      expect(safeProgress(NaN, 100)).toBe(null);
      expect(safeProgress(50, NaN)).toBe(null);
    });
    it("retorna null per null/undefined (tractats com NaN)", () => {
      expect(safeProgress(null, 100)).toBe(null);
      expect(safeProgress(50, null)).toBe(null);
    });
    it("limita a 100% si el càlcul supera 100", () => {
      expect(safeProgress(99, 100)).toBe(99);
      expect(safeProgress(100, 100)).toBe(100);
    });
  });

  describe("calculateProgress", () => {
    it("retorna 0 si falten dades", () => {
      expect(calculateProgress(0, 100)).toBe(0);
      expect(calculateProgress(50, 0)).toBe(0);
      expect(calculateProgress(null, 100)).toBe(0);
      expect(calculateProgress(50, null)).toBe(0);
    });
    it("calcula el percentatge arrodonit", () => {
      expect(calculateProgress(50, 100)).toBe(50);
      expect(calculateProgress(1, 3)).toBe(33);
      expect(calculateProgress(100, 100)).toBe(100);
    });
  });

  describe("formatNumber", () => {
    it("formata nombres amb separador de milers (ca-ES)", () => {
      expect(formatNumber(1000)).toBe("1.000");
      expect(formatNumber(1234567)).toBe("1.234.567");
    });
  });

  describe("truncateText", () => {
    it("retorna el text sencer si és més curt que maxLength", () => {
      expect(truncateText("Hola", 10)).toBe("Hola");
      expect(truncateText("Hola", 4)).toBe("Hola");
    });
    it("trunca i afegeix ... si és més llarg", () => {
      expect(truncateText("Hola món", 4)).toBe("Hola...");
      expect(truncateText("Text llarg", 6)).toBe("Text l...");
    });
    it("usa maxLength per defecte 100", () => {
      const text = "a".repeat(150);
      expect(truncateText(text).length).toBe(103);
      expect(truncateText(text).endsWith("...")).toBe(true);
    });
    it("retorna el mateix si text és null o buit", () => {
      expect(truncateText(null)).toBe(null);
      expect(truncateText("")).toBe("");
    });
  });

  describe("generateId", () => {
    it("retorna un string no buit", () => {
      expect(typeof generateId()).toBe("string");
      expect(generateId().length).toBeGreaterThan(0);
    });
    it("retorna valors diferents en crides successives", () => {
      expect(generateId()).not.toBe(generateId());
    });
  });

  describe("validateISBN", () => {
    it("retorna false si isbn és buit", () => {
      expect(validateISBN("")).toBe(false);
      expect(validateISBN(null)).toBe(false);
    });
    it("accepta ISBN-10 (10 dígits)", () => {
      expect(validateISBN("0123456789")).toBe(true);
      expect(validateISBN("012-345-678-9")).toBe(true);
    });
    it("accepta ISBN-13 (13 dígits)", () => {
      expect(validateISBN("9780123456789")).toBe(true);
      expect(validateISBN("978-0-12-345678-9")).toBe(true);
    });
    it("retorna false per formats invàlids", () => {
      expect(validateISBN("123")).toBe(false);
      expect(validateISBN("12345678901")).toBe(false);
      expect(validateISBN("abcdefghij")).toBe(false);
    });
  });

  describe("normalizeISBN", () => {
    it("retorna null si isbn és buit, null o no string", () => {
      expect(normalizeISBN("")).toBe(null);
      expect(normalizeISBN(null)).toBe(null);
      expect(normalizeISBN(undefined)).toBe(null);
      expect(normalizeISBN(123)).toBe(null);
    });
    it("normalitza ISBN-10 eliminant guions i espais", () => {
      expect(normalizeISBN("0123456789")).toBe("0123456789");
      expect(normalizeISBN("012-345-678-9")).toBe("0123456789");
      expect(normalizeISBN("0 1 2 3 4 5 6 7 8 9")).toBe("0123456789");
    });
    it("normalitza ISBN-13 eliminant guions i espais", () => {
      expect(normalizeISBN("9780123456789")).toBe("9780123456789");
      expect(normalizeISBN("978-0-12-345678-9")).toBe("9780123456789");
      expect(normalizeISBN("978 0 12 345678 9")).toBe("9780123456789");
    });
    it("elimina caràcters no numèrics (excepte dígits)", () => {
      expect(normalizeISBN("978-0-12-345678-9")).toBe("9780123456789");
    });
    it("retorna null si la longitud no és 10 ni 13 dígits", () => {
      expect(normalizeISBN("123")).toBe(null);
      expect(normalizeISBN("12345678901")).toBe(null);
      expect(normalizeISBN("12345678901234")).toBe(null);
      expect(normalizeISBN("abcdefghij")).toBe(null);
    });
  });

  describe("sortBooks", () => {
    const books = [
      { title: "C", author: "Autor B", rating: 3, year: 2020, startDate: "2022-01-01" },
      { title: "A", author: "Autor C", rating: 5, year: 2023, startDate: "2023-01-01" },
      { title: "B", author: "Autor A", rating: 4, year: 2021, startDate: "2021-01-01" },
    ];

    it("ordena per títol per defecte", () => {
      const sorted = sortBooks([...books]);
      expect(sorted.map((b) => b.title)).toEqual(["A", "B", "C"]);
    });
    it("ordena per autor", () => {
      const sorted = sortBooks([...books], "author");
      expect(sorted.map((b) => b.author)).toEqual(["Autor A", "Autor B", "Autor C"]);
    });
    it("ordena per valoració descendent", () => {
      const sorted = sortBooks([...books], "rating");
      expect(sorted.map((b) => b.rating)).toEqual([5, 4, 3]);
    });
    it("ordena per any descendent", () => {
      const sorted = sortBooks([...books], "year");
      expect(sorted.map((b) => b.year)).toEqual([2023, 2021, 2020]);
    });
    it("ordena per recent (startDate descendent)", () => {
      const sorted = sortBooks([...books], "recent");
      expect(sorted[0].title).toBe("A");
      expect(sorted[1].title).toBe("C");
      expect(sorted[2].title).toBe("B");
    });
    it("no muta l’array original", () => {
      const copy = [...books];
      sortBooks(copy, "title");
      expect(copy).toEqual(books);
    });
  });
});
