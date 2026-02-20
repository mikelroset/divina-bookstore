import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { computeStats } from "./stats";

describe("computeStats", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-06-15")); // 15 juny 2024
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("retorna zeros i N/A amb llista buida", () => {
    const result = computeStats([]);
    expect(result).toEqual({
      totalBooks: 0,
      completedBooks: 0,
      readingBooks: 0,
      pendingBooks: 0,
      booksThisMonth: 0,
      favoriteGenre: "N/A",
      progressPercentage: 0,
      totalPages: 0,
      readPages: 0,
    });
  });

  it("compta per estat (pending, reading, completed)", () => {
    const books = [
      { status: "pending", pages: 100 },
      { status: "reading", pages: 200, currentPage: 50 },
      { status: "completed", pages: 150 },
    ];
    const result = computeStats(books);
    expect(result.totalBooks).toBe(3);
    expect(result.pendingBooks).toBe(1);
    expect(result.readingBooks).toBe(1);
    expect(result.completedBooks).toBe(1);
  });

  it("calcula booksThisMonth (completats aquest mes)", () => {
    const books = [
      { status: "completed", endDate: "2024-06-10" },
      { status: "completed", endDate: "2024-05-01" },
      { status: "completed", endDate: "2024-06-20" },
    ];
    const result = computeStats(books);
    expect(result.booksThisMonth).toBe(2);
  });

  it("calcula favoriteGenre (més freqüent entre completats)", () => {
    const books = [
      { status: "completed", genre: "Novel·la" },
      { status: "completed", genre: "Fantasia" },
      { status: "completed", genre: "Novel·la" },
    ];
    const result = computeStats(books);
    expect(result.favoriteGenre).toBe("Novel·la");
  });

  it("calcula progressPercentage només dels llibres 'reading' (no pendents ni completats)", () => {
    const books = [
      { status: "completed", pages: 100 },
      { status: "reading", pages: 100, currentPage: 50 },
      { status: "pending", pages: 100 },
    ];
    const result = computeStats(books);
    expect(result.totalPages).toBe(100); // només el llibre "reading"
    expect(result.readPages).toBe(50); // currentPage del "reading"
    expect(result.progressPercentage).toBe(50);
  });

  it("no inclou pendents ni completats en totalPages/readPages del progrés", () => {
    const books = [
      { status: "pending", pages: 200 },
      { status: "completed", pages: 300 },
    ];
    const result = computeStats(books);
    expect(result.totalPages).toBe(0);
    expect(result.readPages).toBe(0);
    expect(result.progressPercentage).toBe(0);
  });

  it("progressPercentage és 0 si totalPages és 0", () => {
    const result = computeStats([{ status: "pending" }]);
    expect(result.progressPercentage).toBe(0);
  });

  it("favoriteGenre és N/A si no hi ha completats", () => {
    const result = computeStats([{ status: "reading", pages: 100 }]);
    expect(result.favoriteGenre).toBe("N/A");
  });
});
